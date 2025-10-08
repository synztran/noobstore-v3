import React, { forwardRef, useImperativeHandle } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useRecaptcha } from "@/hook/useRecaptcha";

interface RecaptchaWrapperProps {
	siteKey: string;
	size?: "compact" | "normal" | "invisible";
	theme?: "light" | "dark";
	onVerify?: (token: string) => void;
	onError?: (error: string) => void;
	onExpired?: () => void;
	className?: string;
	tabIndex?: number;
}

export interface RecaptchaWrapperRef {
	executeRecaptcha: () => Promise<string | null>;
	resetRecaptcha: () => void;
	getToken: () => string | null;
	isLoading: boolean;
	error: string | null;
}

/**
 * Reusable reCAPTCHA wrapper component with TypeScript support
 * Supports both visible and invisible reCAPTCHA modes
 */
export const RecaptchaWrapper = forwardRef<
	RecaptchaWrapperRef,
	RecaptchaWrapperProps
>(
	(
		{
			siteKey,
			size = "normal",
			theme = "light",
			onVerify,
			onError,
			onExpired,
			className,
			tabIndex,
		},
		ref
	) => {
		const {
			recaptchaRef,
			token,
			isLoading,
			error,
			executeRecaptcha,
			resetRecaptcha,
			onRecaptchaChange,
		} = useRecaptcha({ siteKey, onError, onSuccess: onVerify });

		// Expose methods to parent components via ref
		useImperativeHandle(
			ref,
			() => ({
				executeRecaptcha,
				resetRecaptcha,
				getToken: () => token,
				isLoading,
				error,
			}),
			[executeRecaptcha, resetRecaptcha, token, isLoading, error]
		);

		const handleExpired = () => {
			resetRecaptcha();
			onExpired?.();
		};

		// Don't render anything for invisible reCAPTCHA unless executing
		if (size === "invisible") {
			return (
				<></>
				// <ReCAPTCHA
				// 	ref={recaptchaRef}
				// 	sitekey={siteKey}
				// 	size="invisible"
				// 	onChange={onRecaptchaChange}
				// 	onExpired={handleExpired}
				// 	onErrored={onError?.bind(null, "")}
				// />
			);
		}

		// Render visible reCAPTCHA
		return (
			<div className={`recaptcha-wrapper ${className || ""}`}>
				<></>
				{/* <ReCAPTCHA
					ref={recaptchaRef}
					sitekey={siteKey}
					size={size}
					theme={theme}
					onChange={onRecaptchaChange}
					onExpired={handleExpired}
					onErrored={onError?.bind(null, "")}
					tabindex={tabIndex}
				/> */}
				{error && (
					<div className="text-red-500 text-sm mt-2" role="alert">
						{error}
					</div>
				)}
				{isLoading && (
					<div className="text-gray-500 text-sm mt-2">
						Verifying...
					</div>
				)}
			</div>
		);
	}
);

RecaptchaWrapper.displayName = "RecaptchaWrapper";

/**
 * Invisible reCAPTCHA component for seamless form integration
 */
export const InvisibleRecaptcha = forwardRef<
	RecaptchaWrapperRef,
	Omit<RecaptchaWrapperProps, "size" | "theme">
>((props, ref) => <RecaptchaWrapper {...props} size="invisible" ref={ref} />);

InvisibleRecaptcha.displayName = "InvisibleRecaptcha";

/**
 * Visible reCAPTCHA component with checkbox
 */
export const VisibleRecaptcha = forwardRef<
	RecaptchaWrapperRef,
	RecaptchaWrapperProps
>((props, ref) => <RecaptchaWrapper {...props} ref={ref} />);

VisibleRecaptcha.displayName = "VisibleRecaptcha";
