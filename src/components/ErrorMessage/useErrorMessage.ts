import { useState, useCallback } from "react";

interface ErrorMessageState {
	message: string;
	isVisible: boolean;
	type: "error" | "warning" | "info";
	autoHide: boolean;
	autoHideDelay: number;
}

export const useErrorMessage = () => {
	const [errorState, setErrorState] = useState<ErrorMessageState>({
		message: "",
		isVisible: false,
		type: "error",
		autoHide: false,
		autoHideDelay: 4000,
	});

	const showError = useCallback(
		(
			message: string,
			options?: {
				type?: "error" | "warning" | "info";
				autoHide?: boolean;
				autoHideDelay?: number;
			}
		) => {
			setErrorState({
				message,
				isVisible: true,
				type: options?.type || "error",
				autoHide: options?.autoHide || false,
				autoHideDelay: options?.autoHideDelay || 4000,
			});
		},
		[]
	);

	const hideError = useCallback(() => {
		setErrorState((prev) => ({ ...prev, isVisible: false }));
	}, []);

	const clearError = useCallback(() => {
		setErrorState({
			message: "",
			isVisible: false,
			type: "error",
			autoHide: false,
			autoHideDelay: 4000,
		});
	}, []);

	return {
		errorState,
		showError,
		hideError,
		clearError,
	};
};

