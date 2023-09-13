import vars from "./variables";
import { createTheme } from "@mui/material/styles";

const { primaryFont, primaryBgColor } = vars;

let theme = createTheme();

theme = createTheme( {
  typography: {
    fontFamily: primaryFont,
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: `
        *, body {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: ${primaryFont}
        }
        body {
          background: ${primaryBgColor}
        }
      `,
    },
  }
} );

export default theme;