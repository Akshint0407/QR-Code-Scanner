import { useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

// html5-qrcode needs an element with this id to exist in the page (see App.jsx)
export const FILE_ELEMENT_ID = "file-reader";

/** Lets the user pick an image from their device and decodes the QR code in it. */
export default function useImageImport({ onStart, onResult, onError }) {
  const inputRef = useRef(null);

  const openPicker = () => inputRef.current?.click();

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    onStart(previewUrl);
    try {
      const text = await new Html5Qrcode(FILE_ELEMENT_ID).scanFile(file, false);
      onResult(text);
    } catch {
      onError("No QR code found in that image. Try a sharper or closer picture.");
    }
  };

  return { inputRef, openPicker, handleFile };
}
