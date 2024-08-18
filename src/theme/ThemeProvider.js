// ThemeProvider.js
import { CssBaseline } from '@mui/material';
// import { theme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/styles';
import theme from '.';

const MuiThemeProvider = ({ children }) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    {children}
  </ThemeProvider>
);

export default MuiThemeProvider;
