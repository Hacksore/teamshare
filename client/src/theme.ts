import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  spacing: 0,
  palette: {
    background: {
      default: "#3c3c3c",
    },
    type: "dark",
    error: {
      main: "#f44336"
    },
    primary: {      
      main: "#5fa948",
      contrastText: "#fff",
    },
    text: {
      primary: "#fff",
    },
    secondary: {
      light: "#fff",
      main: "#fff",
      contrastText: "#000",
    },
  },
});

export { theme };