import { useState } from "react";
import { API_URL } from "../config";

/**
 * Talks to the backend: POST {API_URL}/generate with { text }
 * and expects the QR code as a JPG image in the response.
 */
export default function useQrGenerator() {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [qrUrl, setQrUrl] = useState("");

  const openDialog = () => {
    setError("");
    setIsOpen(true);
  };
  const closeDialog = () => !loading && setIsOpen(false);

  const closePreview = () => {
    if (qrUrl) URL.revokeObjectURL(qrUrl);
    setQrUrl("");
  };

  const generate = async () => {
    if (!text.trim()) {
      setError("Type something to turn into a QR code.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim() }),
      });
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      const blob = await res.blob();
      if (qrUrl) URL.revokeObjectURL(qrUrl);
      setQrUrl(URL.createObjectURL(blob));
      setIsOpen(false); // input closes, preview opens
    } catch (err) {
      setError(
        err instanceof TypeError
          ? "Could not reach the server. Check that the backend is running and allows requests from this page (CORS)."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  return { isOpen, text, setText, loading, error, qrUrl, openDialog, closeDialog, generate, closePreview };
}
