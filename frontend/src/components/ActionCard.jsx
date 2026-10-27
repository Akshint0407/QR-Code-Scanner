import { Card, CardContent, Typography } from "@mui/material";

/** One option card: icon, title, description and a button (passed as children). */
export default function ActionCard({ icon, title, description, children }) {
  return (
    <div className="col-12 col-md-6 col-lg-4">
      <Card className="panel action-card h-100">
        <CardContent className="p-4 d-flex flex-column h-100">
          {icon}
          <Typography variant="h5" fontWeight={800} mt={2}>{title}</Typography>
          <Typography sx={{ opacity: 0.7 }} mt={1} mb={3}>{description}</Typography>
          {children}
        </CardContent>
      </Card>
    </div>
  );
}
