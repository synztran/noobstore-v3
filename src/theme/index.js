import { red } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

// Create a theme instance.
const theme = createTheme({
	components: {
		MuiRadio: {
			styleOverrides: {
				colorSecondary: {
					color: "#66bb6a",
					"&$checked": {
						color: "#66bb6a",
					},
				},
			},
		},
		MuiInputAdornment: {
			styleOverrides: {
				positionStart: {
					margin: 8,
				},
			},
		},
		MuiOutlinedInput: {
			styleOverrides: {
				root: {
					position: "relative",
					"& $notchedOutline": {
						borderColor: "rgba(0, 0, 0, 0.23)",
					},
					"&:hover:not($disabled):not($focused):not($error) $notchedOutline":
						{
							borderColor: "#fff",
							boxShadow: "0 0 0 0.2rem rgba(0,180,110,0.25)",
							outline: 0,
							"@media (hover: none)": {
								borderColor: "rgba(0, 0, 0, 0.23)",
							},
						},
					"&$focused $notchedOutline": {
						borderColor: "#fff",
						outline: 0,
						boxShadow: "0 0 0 0.2rem rgba(0,180,110,0.25)",
						borderWidth: 3,
					},
				},
			},
		},
		MuiDrawer: {
			styleOverrides: {
				paper: {
					width: "80%",
					overflowY: "auto",
				},
			},
		},
		MuiFormLabel: {
			styleOverrides: {
				root: {
					"&$focused": {
						borderColor: "#fff",
					},
				},
			},
		},
		MuiFab: {
			styleOverrides: {
				root: {
					backgroundColor: "#fff",
					textTransform: "unset",
					boxShadow: "0 0 0 0.2rem rgba(0,180,110,0.25)",
					"&$extended": {
						paddingLeft: 20,
						paddingRight: 20,
						paddingTop: 5,
						paddingBottom: 5,
						borderRadius: 25,
						height: 38,
						color: "#919aa3",
						boxShadow: "3px 3px 6px rgba(0,0,0,0.08)",
						"&:hover": {
							color: "#343a40",
							backgroundColor: "transparent",
						},
					},
				},
			},
		},
		MuiButton: {
			styleOverrides: {
				root: {
					textTransform: "capitalize",
				},
			},
		},
		MuiPagination: {
			styleOverrides: {
				root: {
					padding: 10,
				},
			},
		},
		MuiPaginationItem: {
			styleOverrides: {
				page: {
					color: "#0E1983",
					"&$disabled": {
						opacity: 0.18,
					},
					"&$selected": {
						color: "#09884D",
						backgroundColor: "none",
						border: "1px solid #09884D",
					},
				},
			},
		},
		MuiTypography: {
			styleOverrides: {
				root: {
					fontFamily: "Nunito, sans-serif",
				},
			},
		},
		MuiTextField: {
			styleOverrides: {
				root: {
					"& .MuiInputBase-root": {
						height: 56,
					},
				},
			},
		},
	},
	typography: {
		fontFamily: "Nunito, sans-serif",
		subtitle2: {
			fontSize: 13,
		},
		button: {
			fontFamily: "Nunito, sans-serif",
		},
	},
	palette: {
		primary: {
			main: "#556cd6",
		},
		secondary: {
			main: "#19857b",
		},
		error: {
			main: red.A400,
		},
	},
});

export default theme;
