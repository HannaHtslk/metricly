import type { PaletteMode } from "@mui/material";
import { createTheme } from "@mui/material";

export const getTheme = (mode: PaletteMode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: "#6366f1",
      },
      secondary: {
        main: "#22d3ee",
      },
      background: {
        default: mode === "light" ? "#f1f1f85c" : "#0a0f1e",
        paper: mode === "light" ? "#ffffff" : "#1e293b",
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontFamily: '"Varela Round", sans-serif' },
      h2: { fontFamily: '"Varela Round", sans-serif' },
      h3: { fontFamily: '"Varela Round", sans-serif' },
      h4: { fontFamily: '"Varela Round", sans-serif' },
      h5: { fontFamily: '"Varela Round", sans-serif' },
      h6: { fontFamily: '"Varela Round", sans-serif' },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: mode === "light" ? "#ffffff" : "#070b16",
            borderRight:
              mode === "light"
                ? "1px solid rgba(0,0,0,0.08)"
                : "1px solid rgba(255,255,255,0.05)",
            boxShadow: "none",
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            margin: "2px 8px",
          },
        },
      },
    },
  });
