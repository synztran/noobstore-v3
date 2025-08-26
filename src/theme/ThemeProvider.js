import { ThemeProvider } from "@material-ui/core/styles";
import { CssBaseline } from "@mui/material";
import theme from ".";

const MuiThemeProvider = ({ children }) => (
	<ThemeProvider theme={theme}>
		<CssBaseline />
		{children}
	</ThemeProvider>
);

export default MuiThemeProvider;
