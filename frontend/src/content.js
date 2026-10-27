// Static text for the "What is a QR code?" section.
export const PARTS = [
  ["Finder patterns", "The three large squares in the corners. They tell a scanner where the code is and which way is up, so it reads from any angle."],
  ["Alignment & timing patterns", "Smaller markers that keep the grid straight when a code is curved, tilted or printed on a bent surface."],
  ["Data & error correction", "The patterned modules in the middle. Extra recovery data lets a scanner rebuild the message even if part of the code is dirty or damaged."],
  ["Quiet zone", "The empty white border around the code. Without it, scanners struggle to separate the code from its background."],
];

export const USES = [
  ["Links", "Open a website, menu or app page without typing."],
  ["Payments", "Pay a shop or a friend. UPI codes are everywhere in India."],
  ["Wi-Fi & contacts", "Join a network or save a contact in one scan."],
  ["Tickets & passes", "Boarding passes, event entry and parcel tracking."],
];

export const FAQ = [
  ["What does QR stand for?", "Quick Response. The code was designed to be read fast by machines."],
  ["Who invented it?", "Masahiro Hara and a team at Denso Wave, a Toyota supplier, created it in 1994 to track car parts on assembly lines. Denso Wave made the standard free to use."],
  ["How much can one hold?", "Up to about 7,000 digits or 4,000 letters and symbols, depending on size and error-correction level. Codes come in 40 sizes, from 21×21 to 177×177 modules."],
  ["How can a damaged code still scan?", "Reed-Solomon error correction. The four levels (L, M, Q, H) can recover roughly 7%, 15%, 25% or 30% of the code."],
  ["Are QR codes safe?", "The code is just data, but the link inside can lead anywhere. Check the address before you open it, especially on stickers in public places."],
  ["Why won't my code scan?", "Common causes are blur, glare, low contrast, a cropped quiet zone, or a very small code. Try a sharper, closer, well-lit photo."],
];
