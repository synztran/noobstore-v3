module.exports = {
	testEnvironment: "jsdom",
	roots: ["<rootDir>/src"],
	testMatch: [
		"**/__tests__/**/*.test.(ts|tsx|js)",
		"**/?(*.)+(spec|test).(ts|tsx|js)",
	],
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/src/$1",
	},
	transform: {
		"^.+\\.tsx?$": [
			"ts-jest",
			{
				tsconfig: {
					jsx: "react",
					esModuleInterop: true,
					allowSyntheticDefaultImports: true,
				},
			},
		],
	},
	moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
	setupFilesAfterEnv: ["<rootDir>/src/__tests__/setup.ts"],
	collectCoverageFrom: [
		"src/**/*.{ts,tsx}",
		"!src/**/*.d.ts",
		"!src/**/*.stories.tsx",
		"!src/pages/_app.tsx",
		"!src/pages/_document.tsx",
	],
	coverageThreshold: {
		global: {
			branches: 50,
			functions: 50,
			lines: 50,
			statements: 50,
		},
	},
};
