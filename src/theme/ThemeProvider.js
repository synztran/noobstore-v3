import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from ".";

const MuiThemeProvider = ({ children }) => (
	<ThemeProvider theme={theme}>
		<CssBaseline />
		{children}
	</ThemeProvider>
);

export default MuiThemeProvider;
