/**
 * Utility functions for reCAPTCHA v4 integration
 * Handles client-side token management and server-side validation
 */

export interface RecaptchaValidationResponse {
	success: boolean;
	score?: number;
	action?: string;
	challenge_ts?: string;
	hostname?: string;
	"error-codes"?: string[];
}

/**
 * Validates reCAPTCHA token on the server side
 * @param token - The reCAPTCHA token to validate
 * @param secretKey - The reCAPTCHA secret key (should be from environment variables)
 * @param expectedAction - The expected action for this token (optional)
 * @param minimumScore - The minimum score required (default: 0.5)
 * @returns Promise<RecaptchaValidationResponse>
 */
export async function validateRecaptchaToken(
	token: string,
	secretKey: string,
	expectedAction?: string,
	minimumScore: number = 0.5
): Promise<RecaptchaValidationResponse> {
	if (!token) {
		return {
			success: false,
			"error-codes": ["missing-input-response"],
		};
	}

	if (!secretKey) {
		return {
			success: false,
			"error-codes": ["missing-input-secret"],
		};
	}

	try {
		const response = await fetch(
			"https://www.google.com/recaptcha/api/siteverify",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: new URLSearchParams({
					secret: secretKey,
					response: token,
				}),
			}
		);

		const data: RecaptchaValidationResponse = await response.json();

		// Check if the basic validation passed
		if (!data.success) {
			return data;
		}

		// For reCAPTCHA v3/v4, check the score
		if (data.score !== undefined && data.score < minimumScore) {
			return {
				success: false,
				score: data.score,
				"error-codes": ["score-threshold-not-met"],
			};
		}

		// Check if the action matches (if provided)
		if (expectedAction && data.action !== expectedAction) {
			return {
				success: false,
				action: data.action,
				"error-codes": ["action-mismatch"],
			};
		}

		return data;
	} catch (error) {
		console.error("reCAPTCHA validation error:", error);
		return {
			success: false,
			"error-codes": ["network-error"],
		};
	}
}

/**
 * Client-side utility to get reCAPTCHA token
 * @param siteKey - The reCAPTCHA site key
 * @param action - The action to associate with this token
 * @returns Promise<string | null>
 */
export async function getRecaptchaToken(
	siteKey: string,
	action: string = "submit"
): Promise<string | null> {
	return new Promise((resolve) => {
		if (typeof window === "undefined" || !window.grecaptcha) {
			console.warn("reCAPTCHA not loaded");
			resolve(null);
			return;
		}

		window.grecaptcha.ready(() => {
			window.grecaptcha
				.execute(siteKey, { action })
				.then((token: string) => {
					resolve(token);
				})
				.catch((error: any) => {
					console.error("reCAPTCHA execution error:", error);
					resolve(null);
				});
		});
	});
}

/**
 * Utility to check if reCAPTCHA is loaded and ready
 * @returns boolean
 */
export function isRecaptchaReady(): boolean {
	return (
		typeof window !== "undefined" &&
		!!window.grecaptcha &&
		!!window.grecaptcha.ready
	);
}

/**
 * Utility to load reCAPTCHA script dynamically
 * @param siteKey - The reCAPTCHA site key
 * @returns Promise<boolean>
 */
export function loadRecaptchaScript(siteKey: string): Promise<boolean> {
	return new Promise((resolve) => {
		if (typeof window === "undefined") {
			resolve(false);
			return;
		}

		// Check if already loaded
		if (window.grecaptcha) {
			resolve(true);
			return;
		}

		// Check if script is already being loaded
		const existingScript = document.querySelector(
			`script[src*="recaptcha/api.js"]`
		);
		if (existingScript) {
			existingScript.addEventListener("load", () => resolve(true));
			existingScript.addEventListener("error", () => resolve(false));
			return;
		}

		// Load the script
		const script = document.createElement("script");
		script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
		script.async = true;
		script.defer = true;

		script.onload = () => resolve(true);
		script.onerror = () => resolve(false);

		document.head.appendChild(script);
	});
}

/**
 * Utility for handling reCAPTCHA errors
 * @param errorCodes - Array of error codes from reCAPTCHA response
 * @returns Human-readable error message
 */
export function getRecaptchaErrorMessage(errorCodes?: string[]): string {
	if (!errorCodes || errorCodes.length === 0) {
		return "Unknown reCAPTCHA error";
	}

	const errorMessages: { [key: string]: string } = {
		"missing-input-secret": "The secret parameter is missing.",
		"invalid-input-secret": "The secret parameter is invalid or malformed.",
		"missing-input-response": "The response parameter is missing.",
		"invalid-input-response":
			"The response parameter is invalid or malformed.",
		"bad-request": "The request is invalid or malformed.",
		"timeout-or-duplicate":
			"The response is no longer valid: either is too old or has been used previously.",
		"score-threshold-not-met":
			"The reCAPTCHA score is below the required threshold.",
		"action-mismatch": "The action does not match the expected action.",
		"network-error": "Network error occurred while validating reCAPTCHA.",
	};

	const firstError = errorCodes[0];
	if (!firstError) {
		return "Unknown reCAPTCHA error";
	}
	return errorMessages[firstError] || `reCAPTCHA error: ${firstError}`;
}

// Type declarations for window.grecaptcha
declare global {
	interface Window {
		grecaptcha: {
			ready: (callback: () => void) => void;
			execute: (
				siteKey: string,
				options: { action: string }
			) => Promise<string>;
		};
	}
}
