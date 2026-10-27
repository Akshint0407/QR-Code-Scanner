import { useState } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";

import theme from "./theme";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ErrorBanner from "./components/ErrorBanner";
import CameraPanel from "./components/CameraPanel";
import ActionCards from "./components/ActionCards";
import ResultCard from "./components/ResultCard";
import GenerateDialog from "./components/GenerateDialog";
import QrPreviewDialog from "./components/QrPreviewDialog";
import InfoSection from "./components/InfoSection";
import OpenSourceCard from "./components/OpenSourceCard";
import Footer from "./components/Footer";

import useCameraScanner from "./hooks/useCameraScanner";
import useImageImport, { FILE_ELEMENT_ID } from "./hooks/useImageImport";
import useQrGenerator from "./hooks/useQrGenerator";
import "./App.css";

export default function App() {
  const [mode, setMode] = useState("home"); // "home" | "camera"
  const [result, setResult] = useState("");
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");

  const showError = (message) => {
    setError(message);
    setMode("home");
  };

  // Option 1: scan with the camera
  useCameraScanner({
    active: mode === "camera",
    onResult: (text) => {
      setResult(text);
      setPreview("");
      setMode("home"); // leaving camera mode stops the camera
    },
    onError: showError,
  });

  const startCamera = () => {
    setError("");
    setResult("");
    setPreview("");
    setMode("camera");
  };

  // Option 2: import an image from the device
  const imageImport = useImageImport({
    onStart: (previewUrl) => {
      setError("");
      setResult("");
      setPreview(previewUrl);
    },
    onResult: setResult,
    onError: setError,
  });

  // Option 3: generate a QR code through the backend
  const generator = useQrGenerator();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />

      <main className="container py-5">
        <Hero />

        {mode === "camera" && <CameraPanel onStop={() => setMode("home")} />}
        <ErrorBanner message={error} onClose={() => setError("")} />

        {mode === "home" && (
          <ActionCards
            onScan={startCamera}
            onPickImage={imageImport.openPicker}
            onGenerate={generator.openDialog}
            fileInputRef={imageImport.inputRef}
            onFileChange={imageImport.handleFile}
          />
        )}

        {result && <ResultCard result={result} preview={preview} />}

        <InfoSection />
        <OpenSourceCard />

        <GenerateDialog
          open={generator.isOpen}
          text={generator.text}
          onTextChange={generator.setText}
          loading={generator.loading}
          error={generator.error}
          onClose={generator.closeDialog}
          onSubmit={generator.generate}
        />
        <QrPreviewDialog url={generator.qrUrl} onClose={generator.closePreview} />

        {/* mount point html5-qrcode needs for image scanning */}
        <div id={FILE_ELEMENT_ID} hidden />
      </main>

      <Footer />
    </ThemeProvider>
  );
}
