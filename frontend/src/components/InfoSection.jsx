import {
  Typography, Card, CardContent, Accordion, AccordionSummary, AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { PARTS, USES, FAQ } from "../content";

function InfoList({ title, items, color }) {
  return (
    <Card className="panel h-100">
      <CardContent className="p-4">
        <Typography variant="h6" fontWeight={800} mb={2}>{title}</Typography>
        {items.map(([heading, text]) => (
          <div key={heading} className="mb-3">
            <Typography fontWeight={700} color={color}>{heading}</Typography>
            <Typography variant="body2" sx={{ opacity: 0.75 }}>{text}</Typography>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

/** "What is a QR code?" explainer, anatomy, uses and FAQ. */
export default function InfoSection() {
  return (
    <section className="info-section" id="about">
      <div className="row justify-content-center text-center mb-4">
        <div className="col-12 col-lg-8">
          <Typography variant="h4" fontWeight={800}>What is a QR code?</Typography>
          <Typography sx={{ opacity: 0.75 }} mt={2}>
            A QR code is a two-dimensional barcode: a square grid of black and white modules
            that stores text, a link or other data. A phone camera reads it in a fraction of a
            second, so you can jump from the physical world to a website, a payment or a
            contact card with one scan.
          </Typography>
        </div>
      </div>

      <div className="row g-4 mb-5">
        <div className="col-12 col-lg-6">
          <InfoList title="Anatomy of a QR code" items={PARTS} color="secondary" />
        </div>
        <div className="col-12 col-lg-6">
          <InfoList title="Where you see them" items={USES} color="primary.light" />
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-12 col-lg-9">
          <Typography variant="h5" fontWeight={800} mb={2}>Common questions</Typography>
          {FAQ.map(([q, a]) => (
            <Accordion key={q} disableGutters className="panel faq">
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontWeight={700}>{q}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ opacity: 0.8 }}>{a}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      </div>
    </section>
  );
}
