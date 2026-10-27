import { Card, CardContent, Typography, IconButton, Tooltip, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { CAMERA_ELEMENT_ID } from "../hooks/useCameraScanner";

/** Live camera view. The scanner library renders the video into the div below. */
export default function CameraPanel({ onStop }) {
  return (
    <div className="row justify-content-center mb-4">
      <div className="col-12 col-md-8 col-lg-6">
        <Card className="panel">
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography fontWeight={700}>Hold the code inside the frame</Typography>
              <Tooltip title="Stop camera">
                <IconButton onClick={onStop} aria-label="Stop camera"><CloseIcon /></IconButton>
              </Tooltip>
            </Box>
            <div id={CAMERA_ELEMENT_ID} className="reader" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
