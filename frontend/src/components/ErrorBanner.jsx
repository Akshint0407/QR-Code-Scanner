import { Alert } from "@mui/material";

export default function ErrorBanner({ message, onClose }) {
  if (!message) return null;
  return (
    <div className="row justify-content-center mb-4">
      <div className="col-12 col-md-8 col-lg-6">
        <Alert severity="error" onClose={onClose}>{message}</Alert>
      </div>
    </div>
  );
}
