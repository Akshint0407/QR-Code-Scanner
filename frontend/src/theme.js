import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#5B5BF0" },
    secondary: { main: "#2DD4BF" },
    background: { default: "#0B1026", paper: "#141B3A" },
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: '"Manrope", "Segoe UI", sans-serif',
    button: { textTransform: "none", fontWeight: 700 },
  },
});

export default theme;
