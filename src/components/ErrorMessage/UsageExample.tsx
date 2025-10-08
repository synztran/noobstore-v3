import React from "react";
import { SimpleErrorMessage, useErrorMessage } from "./index";

// Example 1: Simple usage with manual control
const SimpleUsageExample: React.FC = () => {
	const [showError, setShowError] = React.useState(false);

	const handleShowError = () => {
		setShowError(true);
	};

	const handleCloseError = () => {
		setShowError(false);
	};

	return (
		<div className="p-4">
			<button
				onClick={handleShowError}
				className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
				Show Error Message
			</button>

			{showError && (
				<SimpleErrorMessage
					message="This is a simple error message with animated border effects!"
					onClose={handleCloseError}
				/>
			)}
		</div>
	);
};

// Example 2: Using the hook for more control
const HookUsageExample: React.FC = () => {
	const { errorState, showError, hideError, clearError } = useErrorMessage();

	const handleShowError = () => {
		showError("Something went wrong! Please try again.", {
			type: "error",
			autoHide: true,
			autoHideDelay: 3000,
		});
	};

	const handleShowWarning = () => {
		showError("Warning: This action cannot be undone.", {
			type: "warning",
			autoHide: false,
		});
	};

	const handleShowInfo = () => {
		showError("Information: Operation completed successfully.", {
			type: "info",
			autoHide: true,
			autoHideDelay: 2000,
		});
	};

	return (
		<div className="p-4 space-y-4">
			<div className="space-x-2">
				<button
					onClick={handleShowError}
					className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
					Show Error
				</button>
				<button
					onClick={handleShowWarning}
					className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">
					Show Warning
				</button>
				<button
					onClick={handleShowInfo}
					className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
					Show Info
				</button>
			</div>

			{errorState.isVisible && (
				<SimpleErrorMessage
					message={errorState.message}
					onClose={hideError}
					autoHide={errorState.autoHide}
					autoHideDelay={errorState.autoHideDelay}
				/>
			)}
		</div>
	);
};

// Example 3: Integration with existing error handling
const IntegrationExample: React.FC = () => {
	const [showError, setShowError] = React.useState(false);

	// Simulate an API error
	const simulateApiError = async () => {
		try {
			// Simulate API call
			await new Promise((_, reject) =>
				setTimeout(() => reject(new Error("API Error")), 1000)
			);
		} catch (error) {
			setShowError(true);
		}
	};

	return (
		<div className="p-4">
			<button
				onClick={simulateApiError}
				className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
				Simulate API Error
			</button>

			{showError && (
				<SimpleErrorMessage
					message="Failed to fetch data. Please check your connection and try again."
					onClose={() => setShowError(false)}
					autoHide={true}
					autoHideDelay={5000}
				/>
			)}
		</div>
	);
};

export { SimpleUsageExample, HookUsageExample, IntegrationExample };

