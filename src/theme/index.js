import { createTheme } from '@mui/material'

// Create a theme instance.
// const theme = createTheme({
// 	components: {
// 		MuiRadio: {
// 			styleOverrides: {
// 				colorSecondary: {
// 					color: "#66bb6a",
// 					"&$checked": {
// 						color: "#66bb6a",
// 					},
// 				},
// 			},
// 		},
// 		MuiInputAdornment: {
// 			styleOverrides: {
// 				positionStart: {
// 					margin: 8,
// 				},
// 			},
// 		},
// 		MuiOutlinedInput: {
// 			styleOverrides: {
// 				root: {
// 					position: "relative",
// 					"& $notchedOutline": {
// 						borderColor: "rgba(0, 0, 0, 0.23)",
// 					},
// 					"&:hover:not($disabled):not($focused):not($error) $notchedOutline":
// 						{
// 							borderColor: "#fff",
// 							boxShadow: "0 0 0 0.2rem rgba(0,180,110,0.25)",
// 							outline: 0,
// 							"@media (hover: none)": {
// 								borderColor: "rgba(0, 0, 0, 0.23)",
// 							},
// 						},
// 					"&$focused $notchedOutline": {
// 						borderColor: "#fff",
// 						outline: 0,
// 						boxShadow: "0 0 0 0.2rem rgba(0,180,110,0.25)",
// 						borderWidth: 3,
// 					},
// 				},
// 			},
// 		},
// 		MuiDrawer: {
// 			styleOverrides: {
// 				paper: {
// 					width: "80%",
// 					overflowY: "auto",
// 				},
// 			},
// 		},
// 		MuiFormLabel: {
// 			styleOverrides: {
// 				root: {
// 					"&$focused": {
// 						borderColor: "#fff",
// 					},
// 				},
// 			},
// 		},
// 		MuiFab: {
// 			styleOverrides: {
// 				root: {
// 					backgroundColor: "#fff",
// 					textTransform: "unset",
// 					boxShadow: "0 0 0 0.2rem rgba(0,180,110,0.25)",
// 					"&$extended": {
// 						paddingLeft: 20,
// 						paddingRight: 20,
// 						paddingTop: 5,
// 						paddingBottom: 5,
// 						borderRadius: 25,
// 						height: 38,
// 						color: "#919aa3",
// 						boxShadow: "3px 3px 6px rgba(0,0,0,0.08)",
// 						"&:hover": {
// 							color: "#343a40",
// 							backgroundColor: "transparent",
// 						},
// 					},
// 				},
// 			},
// 		},
// 		MuiButton: {
// 			styleOverrides: {
// 				root: {
// 					textTransform: "capitalize",
// 				},
// 			},
// 		},
// 		MuiPagination: {
// 			styleOverrides: {
// 				root: {
// 					padding: 10,
// 				},
// 			},
// 		},
// 		MuiPaginationItem: {
// 			styleOverrides: {
// 				page: {
// 					color: "#0E1983",
// 					"&$disabled": {
// 						opacity: 0.18,
// 					},
// 					"&$selected": {
// 						color: "#09884D",
// 						backgroundColor: "none",
// 						border: "1px solid #09884D",
// 					},
// 				},
// 			},
// 		},
// 		MuiTypography: {
// 			styleOverrides: {
// 				root: {
// 					fontFamily: "Nunito, sans-serif",
// 				},
// 			},
// 		},
// 		MuiTextField: {
// 			styleOverrides: {
// 				root: {
// 					"& .MuiInputBase-root": {
// 						height: 56,
// 					},
// 				},
// 			},
// 		},
// 		MuiTooltip: {
// 			styleOverrides: {
// 				tooltip: {
// 					fontSize: "1rem",
// 					fontFamily: "Nunito, sans-serif",
// 					backgroundColor: "rgba(0, 0, 0, 0.87)",
// 					color: "#fff",
// 					padding: "8px 12px",
// 					borderRadius: "4px",
// 					boxShadow:
// 						"0px 3px 14px 2px rgba(0,0,0,0.12), 0px 5px 5px -3px rgba(0,0,0,0.20)",
// 				},
// 			},
// 		},
// 	},
// 	typography: {
// 		fontFamily: "Nunito, sans-serif",
// 		subtitle2: {
// 			fontSize: 13,
// 		},
// 		button: {
// 			fontFamily: "Nunito, sans-serif",
// 		},
// 	},
// 	palette: {
// 		primary: {
// 			main: "#556cd6",
// 		},
// 		secondary: {
// 			main: "#19857b",
// 		},
// 		error: {
// 			main: red.A400,
// 		},
// 	},
// });

const theme = createTheme({
  palette: {
    primary: {
      light: '#f47044', // 400
      main: '#ca5025', // 500 — brand primary
      dark: '#aa421e', // 600
      contrastText: '#ffffff',
    },
    secondary: {
      light: '#bb8672', // 400
      main: '#a96650', // 500 — brand secondary
      dark: '#8d5241', // 600
      contrastText: '#ffffff',
    },
    info: {
      light: '#33c5df', // 400
      main: '#009bbd', // 500 — brand tertiary
      dark: '#007d97', // 600
      contrastText: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Nunito, sans-serif',
  },
  overrides: {
    MuiTooltip: {
      tooltip: {
        fontSize: '1rem',
        fontFamily: 'Nunito, sans-serif',
        backgroundColor: 'rgba(0, 0, 0, 0.87)',
        color: '#fff',
      },
    },
  },
})

export default theme
