import { CssBaseline } from "@mui/material";
import theme from ".";
import { ThemeProvider } from "styled-components";

const MuiThemeProvider = ({ children }) => (
	<ThemeProvider theme={theme}>
		<CssBaseline />
		{children}
	</ThemeProvider>
);

export default MuiThemeProvider;
