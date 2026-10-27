import { Card, CardContent, Typography, Button } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import { REPO } from "../config";

export default function OpenSourceCard() {
  return (
    <section className="row justify-content-center mt-5">
      <div className="col-12 col-lg-8">
        <Card className="panel open-source text-center">
          <CardContent className="p-4 p-md-5">
            <GitHubIcon sx={{ fontSize: 44 }} />
            <Typography variant="h5" fontWeight={800} mt={1}>This project is open source</Typography>
            <Typography sx={{ opacity: 0.75 }} mt={1} mb={3}>
              Want the code? The full project is on GitHub: the YOLOv8 QR detector, the
              multi-decoder pipeline and this web interface. Use it, learn from it, and send
              improvements back.
            </Typography>
            <Button variant="contained" color="secondary" size="large"
              startIcon={<GitHubIcon />} href={REPO} target="_blank" rel="noopener noreferrer">
              View on GitHub
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
