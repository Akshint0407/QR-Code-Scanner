import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

export const CAMERA_ELEMENT_ID = "camera-reader";
const REAR = /back|rear|environment/i;

function friendlyError(err) {
  const msg = String(err?.message || err);
  if (/NotAllowed|permission|denied/i.test(msg))
    return "Camera access is blocked. Click the lock icon in the address bar, set Camera to Allow, then reload.";
  if (/NotReadable|in use|Could not start video/i.test(msg))
    return "Another app is using the camera. Close Zoom, Teams or other tabs and try again.";
  if (/NotFound|No camera/i.test(msg)) return "No camera was found on this device.";
  return msg;
}

/**
 * Starts the camera while `active` is true (the browser shows its permission prompt)
 * and stops it when `active` turns false or the component unmounts.
 */
export default function useCameraScanner({ active, onResult, onError }) {
  const callbacks = useRef({ onResult, onError });
  callbacks.current = { onResult, onError };

  useEffect(() => {
    if (!active) return;
    const scanner = new Html5Qrcode(CAMERA_ELEMENT_ID);
    let cancelled = false;

    (async () => {
      try {
        const cameras = await Html5Qrcode.getCameras();
        if (!cameras.length) throw new Error("No camera found on this device.");
        // Prefer a rear camera, then try every camera in turn until one opens
        // (laptops often list an infrared or virtual camera that cannot be read).
        const ordered = [
          ...cameras.filter((c) => REAR.test(c.label)),
          ...cameras.filter((c) => !REAR.test(c.label)),
        ];
        let lastErr;
        for (const cam of ordered) {
          if (cancelled) return;
          try {
            await scanner.start(
              cam.id,
              { fps: 10, qrbox: { width: 260, height: 260 } },
              (text) => callbacks.current.onResult(text),
              () => {}
            );
            lastErr = null;
            break;
          } catch (e) {
            lastErr = e;
          }
        }
        if (lastErr) throw lastErr;
      } catch (err) {
        if (!cancelled) callbacks.current.onError(friendlyError(err));
      }
    })();

    return () => {
      cancelled = true;
      if (scanner.isScanning) scanner.stop().then(() => scanner.clear()).catch(() => {});
    };
  }, [active]);
}
