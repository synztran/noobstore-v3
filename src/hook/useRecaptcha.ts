import { useCallback, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

interface UseRecaptchaReturn {
	recaptchaRef: React.RefObject<ReCAPTCHA>;
	token: string | null;
	isLoading: boolean;
	error: string | null;
	executeRecaptcha: () => Promise<string | null>;
	resetRecaptcha: () => void;
	onRecaptchaChange: (token: string | null) => void;
}

interface UseRecaptchaOptions {
	siteKey: string;
	onError?: (error: string) => void;
	onSuccess?: (token: string) => void;
}

/**
 * Custom hook for managing reCAPTCHA v4 integration
 * Provides methods for executing, resetting, and handling reCAPTCHA tokens
 */
export const useRecaptcha = (
	options: UseRecaptchaOptions
): UseRecaptchaReturn => {
	const { siteKey, onError, onSuccess } = options;

	const recaptchaRef = useRef<ReCAPTCHA>(null);
	const [token, setToken] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const executeRecaptcha = useCallback(async (): Promise<string | null> => {
		if (!recaptchaRef.current) {
			const errorMsg = "reCAPTCHA not initialized";
			setError(errorMsg);
			onError?.(errorMsg);
			return null;
		}

		try {
			setIsLoading(true);
			setError(null);

			// Execute reCAPTCHA
			const recaptchaToken = await recaptchaRef.current.executeAsync();

			if (recaptchaToken) {
				setToken(recaptchaToken);
				onSuccess?.(recaptchaToken);
				return recaptchaToken;
			} else {
				const errorMsg = "Failed to get reCAPTCHA token";
				setError(errorMsg);
				onError?.(errorMsg);
				return null;
			}
		} catch (err) {
			const errorMsg =
				err instanceof Error
					? err.message
					: "reCAPTCHA execution failed";
			setError(errorMsg);
			onError?.(errorMsg);
			return null;
		} finally {
			setIsLoading(false);
		}
	}, [onError, onSuccess]);

	const resetRecaptcha = useCallback(() => {
		if (recaptchaRef.current) {
			recaptchaRef.current.reset();
			setToken(null);
			setError(null);
			setIsLoading(false);
		}
	}, []);

	const onRecaptchaChange = useCallback(
		(newToken: string | null) => {
			setToken(newToken);
			setError(null);

			if (newToken) {
				onSuccess?.(newToken);
			}
		},
		[onSuccess]
	);

	return {
		recaptchaRef,
		token,
		isLoading,
		error,
		executeRecaptcha,
		resetRecaptcha,
		onRecaptchaChange,
	};
};

/**
 * Hook for invisible reCAPTCHA (recommended for forms)
 */
export const useInvisibleRecaptcha = (
	siteKey: string,
	onError?: (error: string) => void,
	onSuccess?: (token: string) => void
) => {
	return useRecaptcha({ siteKey, onError, onSuccess });
};

/**
 * Hook for visible reCAPTCHA checkbox
 */
export const useVisibleRecaptcha = (
	siteKey: string,
	onError?: (error: string) => void,
	onSuccess?: (token: string) => void
) => {
	return useRecaptcha({ siteKey, onError, onSuccess });
};
