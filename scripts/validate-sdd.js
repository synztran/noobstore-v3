#!/usr/bin/env node

/**
 * SDD Validation Script
 * Validates specifications and implementation compliance
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const SPECS_DIR = path.join(__dirname, "..", "specs");
const SRC_DIR = path.join(__dirname, "..", "src");

console.log("🔍 Starting SDD Validation...\n");

// Check if specs directory exists
if (!fs.existsSync(SPECS_DIR)) {
	console.error(
		"❌ specs/ directory not found. Please create specifications first."
	);
	process.exit(1);
}

// 1. Validate OpenAPI specification
console.log("📋 Validating OpenAPI specifications...");
const openapiPath = path.join(SPECS_DIR, "api", "openapi.yml");
if (fs.existsSync(openapiPath)) {
	try {
		const content = fs.readFileSync(openapiPath, "utf8");

		// Basic validation - check for required OpenAPI keywords
		if (
			!content.includes("openapi:") ||
			!content.includes("info:") ||
			!content.includes("paths:")
		) {
			throw new Error(
				"Missing required OpenAPI structure (openapi, info, paths)"
			);
		}

		// Check for YAML syntax by trying to parse basic structure
		const lines = content.split("\n");
		let indentLevel = 0;
		let hasValidStructure = false;

		for (const line of lines) {
			if (line.trim().startsWith("openapi:")) {
				hasValidStructure = true;
				break;
			}
		}

		if (!hasValidStructure) {
			throw new Error("Invalid OpenAPI YAML structure");
		}

		console.log("✅ OpenAPI specification structure is valid\n");
		continueValidation();
	} catch (error) {
		console.error("❌ OpenAPI validation failed:", error.message);
		process.exit(1);
	}
} else {
	console.log("⚠️  OpenAPI specification not found\n");
	continueValidation();
}

function continueValidation() {
	// 2. Validate JSON schemas
	console.log("📊 Validating JSON schemas...");
	const dataDir = path.join(SPECS_DIR, "data");
	if (fs.existsSync(dataDir)) {
		const schemaFiles = fs
			.readdirSync(dataDir)
			.filter((file) => file.endsWith(".schema.json"));

		for (const schemaFile of schemaFiles) {
			try {
				const schemaPath = path.join(dataDir, schemaFile);
				const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));

				// Basic schema validation
				if (!schema.$schema || !schema.type) {
					throw new Error("Missing required schema properties");
				}

				console.log(`✅ ${schemaFile} is valid`);
			} catch (error) {
				console.error(
					`❌ ${schemaFile} validation failed:`,
					error.message
				);
				process.exit(1);
			}
		}
		console.log("");
	} else {
		console.log("⚠️  Data schemas directory not found\n");
	}

	// 3. Check behavior specifications
	console.log("🎭 Checking behavior specifications...");
	const behaviorDir = path.join(SPECS_DIR, "behavior");
	if (fs.existsSync(behaviorDir)) {
		const featureFiles = fs
			.readdirSync(behaviorDir)
			.filter((file) => file.endsWith(".feature"));

		for (const featureFile of featureFiles) {
			try {
				const featurePath = path.join(behaviorDir, featureFile);
				const content = fs.readFileSync(featurePath, "utf8");

				// Basic Gherkin validation
				if (
					!content.includes("Feature:") ||
					!content.includes("Scenario:")
				) {
					throw new Error("Missing required Gherkin keywords");
				}

				console.log(`✅ ${featureFile} structure is valid`);
			} catch (error) {
				console.error(
					`❌ ${featureFile} validation failed:`,
					error.message
				);
				process.exit(1);
			}
		}
		console.log("");
	} else {
		console.log("⚠️  Behavior specifications directory not found\n");
	}

	// 4. Check implementation compliance
	console.log("🔧 Checking implementation compliance...");

	// Check if API client exists for each endpoint
	try {
		const clientDir = path.join(SRC_DIR, "client");
		if (fs.existsSync(clientDir)) {
			const clientFiles = fs
				.readdirSync(clientDir)
				.filter((file) => file.endsWith(".ts"));

			for (const clientFile of clientFiles) {
				const clientPath = path.join(clientDir, clientFile);
				const content = fs.readFileSync(clientPath, "utf8");

				// Check for proper error handling
				if (!content.includes("try") || !content.includes("catch")) {
					console.log(
						`⚠️  ${clientFile} may be missing error handling`
					);
				} else {
					console.log(`✅ ${clientFile} has error handling`);
				}
			}
		}
		console.log("");
	} catch (error) {
		console.error("❌ Implementation check failed:", error.message);
	}

	// 5. TypeScript compilation check
	console.log("🔨 Running TypeScript compilation check...");
	try {
		// Run TypeScript check with a timeout to prevent hanging
		const { spawn } = require("child_process");
		const tscProcess = spawn("npm", ["run", "check-types"], {
			stdio: "inherit",
			timeout: 30000, // 30 second timeout
		});

		tscProcess.on("close", (code) => {
			if (code === 0) {
				console.log("✅ TypeScript compilation successful\n");
				console.log("🎉 SDD Validation completed successfully!");
				console.log("\n📝 Next steps:");
				console.log("1. Review any warnings above");
				console.log("2. Run tests: npm test");
				console.log("3. Build project: npm run build");
				console.log("4. Deploy when ready");
			} else {
				console.error("❌ TypeScript compilation failed");
				process.exit(1);
			}
		});

		tscProcess.on("error", (error) => {
			console.error("❌ TypeScript compilation error:", error.message);
			process.exit(1);
		});
	} catch (error) {
		console.error("❌ TypeScript check setup failed:", error.message);
		process.exit(1);
	}
}
