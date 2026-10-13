import { Typography } from "@mui/material";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";

export default function Hero() {
  return (
    <div className="row justify-content-center text-center mb-5">
      <div className="col-12 col-lg-8">
        <div className="viewfinder mx-auto mb-4">
          <span className="corner tl" /><span className="corner tr" />
          <span className="corner bl" /><span className="corner br" />
          <QrCodeScannerIcon sx={{ fontSize: 64 }} color="secondary" />
        </div>
        <Typography variant="h3" fontWeight={800} className="hero-title">
          Read any QR code in seconds
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.7, mt: 2, fontWeight: 400 }}>
          Scan with your camera, import a picture, or create a QR code of your own.
        </Typography>
      </div>
    </div>
  );
}
