import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import GitHubIcon from "@mui/icons-material/GitHub";
import { REPO } from "../config";

export default function Header() {
  return (
    <AppBar position="static" elevation={0} color="transparent" className="top-bar">
      <Toolbar>
        <QrCodeScannerIcon color="secondary" sx={{ mr: 1.2 }} />
        <Typography variant="h6" fontWeight={800}>The Beast</Typography>
        <Typography variant="body2" sx={{ ml: 1.5, opacity: 0.6 }} className="d-none d-sm-block">
          QR code scanner
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Button color="inherit" href="#about" className="d-none d-sm-inline-flex">About QR codes</Button>
        <Button color="inherit" startIcon={<GitHubIcon />} href={REPO} target="_blank" rel="noopener noreferrer">
          GitHub
        </Button>
      </Toolbar>
    </AppBar>
  );
}
