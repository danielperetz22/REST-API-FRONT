import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: "white",
          color: "#eb341f",
          border: "1px solid #eb341f",
          padding: "10px 30px",
          fontWeight: "bold",
          transition: "all 0.3s ease",
          "&:hover": {
            backgroundColor: "#eb341f",
            color: "white",
          },
        },
      },
    },
  },
});

export default theme;
