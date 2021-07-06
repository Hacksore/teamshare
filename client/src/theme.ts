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
      main: "#76bc7d",
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