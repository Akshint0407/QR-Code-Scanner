import { useState } from "react";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { isUrl } from "../utils";

/** Shows the decoded text with Copy / Open link actions (and the imported image, if any). */
export default function ResultCard({ result, preview }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="row justify-content-center mt-4">
      <div className="col-12 col-lg-10">
        <Card className="panel result-card">
          <CardContent className="p-4">
            <div className="row g-3 align-items-center">
              {preview && (
                <div className="col-12 col-sm-3">
                  <img src={preview} alt="Imported QR" className="img-fluid rounded" />
                </div>
              )}
              <div className="col">
                <Typography variant="subtitle2" color="secondary" fontWeight={700}>Decoded result</Typography>
                <Typography className="result-text" mt={0.5}>{result}</Typography>
                <Box mt={2} display="flex" gap={1} flexWrap="wrap">
                  <Button variant="outlined" color="secondary" startIcon={<ContentCopyIcon />} onClick={copy}>
                    {copied ? "Copied" : "Copy"}
                  </Button>
                  {isUrl(result) && (
                    <Button variant="outlined" startIcon={<OpenInNewIcon />}
                      href={result} target="_blank" rel="noopener noreferrer">
                      Open link
                    </Button>
                  )}
                </Box>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
