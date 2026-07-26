import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",

    primary: {
      main: "#ff2d55", // Navbar pink
      light: "#ff5c78",
      dark: "#d81b4e",
      contrastText: "#ffffff",
    },

    secondary: {
      main: "#1976d2", // Blue buttons
      light: "#42a5f5",
      dark: "#1565c0",
      contrastText: "#ffffff",
    },

    background: {
      default: "#000000",
      paper: "#111111",
    },

    text: {
      primary: "#ffffff",
      secondary: "#bdbdbd",
    },

    divider: "#2d2d2d",

    success: {
      main: "#4caf50",
    },

    error: {
      main: "#f44336",
    },
  },

  typography: {
    fontFamily: `'Poppins', 'Roboto', sans-serif`,

    h1: {
      fontWeight: 700,
    },

    h2: {
      fontWeight: 700,
    },

    h3: {
      fontWeight: 600,
    },

    h4: {
      fontWeight: 600,
    },

    h5: {
      fontWeight: 600,
    },

    h6: {
      fontWeight: 600,
    },

    button: {
      textTransform: "none",
      fontWeight: 600,
      fontSize: "1rem",
    },
  },

  shape: {
    borderRadius: 10,
  },

  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#ff2d55",
          boxShadow: "none",
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "10px 24px",
          fontWeight: 600,
        },

        containedPrimary: {
          backgroundColor: "#ff2d55",

          "&:hover": {
            backgroundColor: "#e91e63",
          },
        },

        containedSecondary: {
          backgroundColor: "#1976d2",

          "&:hover": {
            backgroundColor: "#1565c0",
          },
        },

        outlined: {
          borderColor: "#1976d2",
          color: "#ffffff",

          "&:hover": {
            borderColor: "#42a5f5",
          },
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#111111",
          color: "#ffffff",
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#111111",
          borderRadius: 16,
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
    },

    MuiInputBase: {
      styleOverrides: {
        input: {
          color: "#fff",
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#0d0d0d",

          "& fieldset": {
            borderColor: "#444",
          },

          "&:hover fieldset": {
            borderColor: "#666",
          },

          "&.Mui-focused fieldset": {
            borderColor: "#1976d2",
          },
        },

        input: {
          color: "#ffffff",
        },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#bdbdbd",

          "&.Mui-focused": {
            color: "#ff2d55",
          },
        },
      },
    },

    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: "#1976d2",
          height: 3,
        },
      },
    },

    MuiTab: {
      styleOverrides: {
        root: {
          color: "#bdbdbd",

          "&.Mui-selected": {
            color: "#ffffff",
          },
        },
      },
    },
  },
});

export default theme;
