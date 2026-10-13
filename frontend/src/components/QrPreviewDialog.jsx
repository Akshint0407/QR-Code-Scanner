import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Tooltip } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

/** Shows the generated QR image. The download button is faint until hovered (see App.css). */
export default function QrPreviewDialog({ url, onClose }) {
  return (
    <Dialog open={!!url} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 800 }}>Your QR code</DialogTitle>
      <DialogContent>
        <div className="qr-preview-wrap">
          <img src={url} alt="Generated QR code" className="qr-preview-img" />
          <Tooltip title="Download JPG">
            <IconButton component="a" href={url} download="qr-code.jpg"
              aria-label="Download QR code" className="dl-btn">
              <DownloadIcon />
            </IconButton>
          </Tooltip>
        </div>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
