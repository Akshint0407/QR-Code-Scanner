import { Button } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import ImageIcon from "@mui/icons-material/Image";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import ActionCard from "./ActionCard";

/** The three main options: scan, import, generate. */
export default function ActionCards({ onScan, onPickImage, onGenerate, fileInputRef, onFileChange }) {
  return (
    <div className="row g-4 justify-content-center">
      <ActionCard
        icon={<CameraAltIcon color="secondary" sx={{ fontSize: 40 }} />}
        title="Scan with camera"
        description="Uses your webcam or phone camera. Your browser asks for permission first."
      >
        <Button variant="contained" color="secondary" size="large"
          startIcon={<CameraAltIcon />} onClick={onScan} className="mt-auto">
          Start scanning
        </Button>
      </ActionCard>

      <ActionCard
        icon={<ImageIcon color="primary" sx={{ fontSize: 40 }} />}
        title="Import from device"
        description="Choose a PNG or JPG containing a QR code from your local storage."
      >
        <Button variant="contained" size="large" startIcon={<ImageIcon />}
          onClick={onPickImage} className="mt-auto">
          Choose image
        </Button>
        <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={onFileChange} />
      </ActionCard>

      <ActionCard
        icon={<QrCode2Icon sx={{ fontSize: 40, color: "#F5B94A" }} />}
        title="Generate a QR code"
        description="Type a link or any text and get a downloadable QR code image."
      >
        <Button variant="outlined" size="large" startIcon={<QrCode2Icon />}
          onClick={onGenerate} className="mt-auto gen-btn">
          Create QR code
        </Button>
      </ActionCard>
    </div>
  );
}
