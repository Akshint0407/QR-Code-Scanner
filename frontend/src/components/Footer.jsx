import { Typography } from "@mui/material";
import { REPO } from "../config";

export default function Footer() {
  return (
    <footer className="site-footer text-center py-4">
      <Typography variant="body2" sx={{ opacity: 0.6 }}>
        The Beast · Open source on{" "}
        <a href={REPO} target="_blank" rel="noopener noreferrer">GitHub</a>
      </Typography>
    </footer>
  );
}
