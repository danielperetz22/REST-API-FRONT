import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: "white",
          color: "#a6a29a",
          border: "2px solid #a6a29a",
          fontWeight: "bold",
          fontSize: "16px",
          borderRadius: "8px",
          textTransform: "none",
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            backgroundColor: "#a6a29a",
            color: "white",
            transform: "translateY(-2px)",
          },
          "&:active": {
            transform: "translateY(0px)",
          },
        },
      },
    },
  },
});

export default theme;
