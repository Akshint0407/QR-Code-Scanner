import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Alert, CircularProgress,
} from "@mui/material";
import QrCode2Icon from "@mui/icons-material/QrCode2";

/** Text box where the user types what the QR code should contain. */
export default function GenerateDialog({ open, text, onTextChange, loading, error, onClose, onSubmit }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 800 }}>Generate a QR code</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus fullWidth multiline minRows={3} margin="dense"
          label="Text or link"
          placeholder="https://example.com"
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          disabled={loading}
        />
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button variant="contained" color="secondary" onClick={onSubmit} disabled={loading}
          startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <QrCode2Icon />}>
          {loading ? "Generating…" : "Generate"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
