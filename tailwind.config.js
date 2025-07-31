// const { letterSpacing } = require("@material-ui/system");
const plugin = require("tailwindcss/plugin");
// const colors = require("tailwindcss/colors");

const generateNumbers = (start, end, space = 10) => {
	const numbers = {};
	for (let i = start; i <= end; i += space) {
		numbers[Math.round(i)] = `${Math.round(i)}px`;
	}
	return numbers;
};

const generatePercents = (start, end) => {
	const percents = {};
	for (let i = start; i <= end; i++) {
		percents[i] = `${i}%`;
	}
	return percents;
};

module.exports = {
	// corePlugins: {
	// 	preflight: false,
	// },
	import: "#_next",
	// prefix: 'th-',
	content: ["./src/**/*.{js,ts,jsx,tsx}", "./packages/**/*.{js,ts,jsx,tsx}"],
	// purge: {
	// 	enabled: true,
	// 	content: ["./**/*.html", "./*.html", "./**/*.js", "./*.js"],
	// 	options: {
	// 		safelist: [],
	// 	},
	// },
	theme: {
		borderWidth: {
			DEFAULT: "1px",
			0: "0",
			2: "2px",
			3: "3px",
			4: "4px",
			6: "6px",
			8: "8px",
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
			55: "55rem",
		},
		opacity: {
			80: ".8",
			0: "0",
			100: "1",
		},
		letterSpacing: {
			...generateNumbers(0, 10, 0.1),
		},
		extend: {
			fontFamily: {
				nunito: ['"Nunito"', "sans-serif"],
				roboto: ['"Roboto Mono"', "sans-serif"],
			},
			screens: {
				xs: "320px",
				sm: "576px",
				md: "960px",
				lg: "1440px",
				xl: "1920px",
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
					bgMenu: "#f6f9ff",
				},
				// ...colors,
			},
			lineHeight: {
				hero: "4.5rem",
				"50px": "50px",
			},
			height: {
				88: "22rem",
				"50vh": "50vh",
				"95-px": "95px",
				"70-px": "70px",
				"350-px": "350px",
				"500-px": "500px",
				"600-px": "600px",
				...generateNumbers(100, 1000),
			},
			zIndex: {
				1: 1,
				60: 60,
				2: 2,
				3: 3,
			},
			inset: {
				"-100": "-100%",
				"-225-px": "-225px",
				"-160-px": "-160px",
				"-150-px": "-150px",
				"-94-px": "-94px",
				"-50-px": "-50px",
				"-29-px": "-29px",
				"-20-px": "-20px",
				"25-px": "25px",
				"40-px": "40px",
				"95-px": "95px",
				"145-px": "145px",
				"195-px": "195px",
				"210-px": "210px",
				"260-px": "260px",
			},
			maxWidth: {
				"8xl": "1408px",
				90: "90%",
				1600: "1600px",
				"100-px": "100px",
				"120-px": "120px",
				"150-px": "150px",
				"180-px": "180px",
				"200-px": "200px",
				"210-px": "210px",
				"580-px": "580px",
			},
			minWidth: {
				"140-px": "140px",
				48: "12rem",
			},
			minHeight: {
				inherit: "inherit",
				"screen-75": "75vh",
				...generateNumbers(100, 1000),
			},
			maxHeight: {
				"860-px": "860px",
				...generateNumbers(100, 1000),
			},
			borderRadius: {
				sm: "0.25rem",
				half: "50%",
				full: "100%",
				...generateNumbers(0, 100),
			},
			animation: {
				shine404_3s: "shine404 3s ease-in-out infinite",
				smallnbig404_3s: "smallnbig404 3s ease-in-out infinite",
				upndown404_3s: "updown404 3s ease-in-out infinite",
				scaleUpDown: "scaleUpDown 1.5s ease-in-out infinite",
			},
			keyframes: {
				updown404: {
					"0%": { transform: "translateY(5px)" },
					"50%": { transform: "translateY(15px)" },
					"100%": { transform: "translateY(5px)" },
				},
				smallnbig404: {
					"0%": { width: "90px" },
					"50%": { width: "100px" },
					"100%": { width: "90px" },
				},
				shine404: {
					"0%": { opacity: ".2" },
					"25%": { opacity: ".1" },
					"50%": { opacity: ".2" },
					"100%": { opacity: ".2" },
				},
				scaleUpDown: {
					"0%": { transform: "scale(0.95)" },
					"50%": { transform: "scale(1.05)" },
					"100%": { transform: "scale(0.95)" },
				},
			},
			width: {
				...generateNumbers(100, 1000), // generate withs from 100 to 1000
			},
			translate: {
				half: "50%",
			},
			transitionProperty: {
				"bg-0.5s-ease": "background-color 0.5s ease",
				"trasform-0.5s-ease": "transform 0.5s ease",
			},
			backgroundSize: {
				full: "100%",
			},
			flex: {
				2: "2 2 0%",
			},
			top: {
				unset: "unset",
			},
			bottom: {
				unset: "unset",
			},
			transform: {
				unset: "unset",
			},
			rotate: {
				"y-180": "180deg",
				"y-90": "90deg",
				"y-45": "45deg",
				"y-30": "30deg",
				"y-15": "15deg",
				"y-0": "0deg",
				"y--15": "-15deg",
				"y--30": "-30deg",
				"y--45": "-45deg",
				"y--90": "-90deg",
				"y--180": "-180deg",
			},
		},
	},
	variants: [
		"responsive",
		"group-hover",
		"focus-within",
		"first",
		"last",
		"odd",
		"even",
		"hover",
		"focus",
		"active",
		"visited",
		"disabled",
	],
	plugins: [
		require("@tailwindcss/forms"),
		plugin(function ({ addComponents, theme }) {
			const screens = theme("screens", {});
			addComponents([
				{
					".container": { width: "100%" },
				},
				{
					[`@media (min-width: ${screens.sm})`]: {
						".container": {
							"max-width": "640px",
						},
					},
				},
				{
					[`@media (min-width: ${screens.md})`]: {
						".container": {
							"max-width": "1024px",
						},
					},
				},
				{
					[`@media (min-width: ${screens.lg})`]: {
						".container": {
							"max-width": "1280px",
						},
					},
				},
				{
					[`@media (min-width: ${screens.xl})`]: {
						".container": {
							"max-width": "1280px",
						},
					},
				},
				{
					[`@media (min-width: ${screens["2xl"]})`]: {
						".container": {
							"max-width": "1440px",
						},
					},
				},
			]);
		}),
	],
};
