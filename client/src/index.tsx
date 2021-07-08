import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { CssBaseline, ThemeProvider } from "@material-ui/core";
import { theme } from "./theme";
import { RecoilRoot } from "recoil"

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RecoilRoot>
       <App />
      </RecoilRoot>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
