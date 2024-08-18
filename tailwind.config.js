module.exports = {
	// corePlugins: {
	// 	preflight: false,
	// },
	import: '#_next',
	// prefix: 'th-',
	content: [
		"./src/**/*.{js,ts,jsx,tsx}",
		"./packages/**/*.{js,ts,jsx,tsx}"
	],
	theme: {
		borderWidth: {
			DEFAULT: '1px',
			'0': '0',
			'2': '2px',
			'3': '3px',
			'4': '4px',
			'6': '6px',
			'8': '8px',
		},
		fontSize: {
			xs: "0.75rem",
			sm: "0.875rem",
			base: "1rem",
			lg: "1.125rem",
			xl: "1.25rem",
			"2xl": "2rem",
			"3xl": "3rem",
			"4xl": "4rem",
			"5xl": "5rem",
			"6xl": "6rem",
			"7xl": "7rem",
			"8xl": "8rem",
			"9xl": "9rem",
			"10xl": "10rem",
		},
		extend: {
			screens: {
				xs: "320px",
				sm: "576px",
				md: "960px",
				lg: "1440px",
			},
			colors: {
				primary: {
					100: "#E6F6FE",
					200: "#C0EAFC",
					300: "#9ADDFB",
					400: "#4FC3F7",
					500: "#03A9F4",
					600: "#0398DC",
					700: "#026592",
					800: "#014C6E",
					900: "#013349",
				},
				gray: {
					100: "#f7fafc",
					200: "#edf2f7",
					300: "#e2e8f0",
					400: "#cbd5e0",
					500: "#a0aec0",
					600: "#718096",
					700: "#4a5568",
					800: "#2d3748",
					900: "#1a202c",
				},
				blue: {
					bgMenu: '#f6f9ff'
				}
			},
			lineHeight: {
				hero: "4.5rem",
			},
			height: {
				88: "22rem",
				"50vh": "50vh",
				400: "400px",
				520: "520px",
			},
			zIndex: {
				1: 1,
				60: 60,
			},
			maxWidth: {
				"8xl": "1408px",
				90: "90%",
				1600: "1600px"
			},
			minHeight: {
				"inherit": "inherit",
			},
			borderRadius: {
				sm: "0.25rem",
				half: "50%",
			},
		},
	},
	plugins: [
		require("@tailwindcss/forms"),
	],
};
