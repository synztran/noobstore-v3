import React, { useState } from "react";
import ErrorMessage from "./index";

const ErrorMessageDemo: React.FC = () => {
	const [showError, setShowError] = useState(false);
	const [showWarning, setShowWarning] = useState(false);
	const [showInfo, setShowInfo] = useState(false);
	const [showAutoHide, setShowAutoHide] = useState(false);

	return (
		<div className="p-8 space-y-6 bg-gray-50 min-h-screen">
			<div className="max-w-2xl mx-auto">
				<h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
					Animated Error Message Component
				</h1>

				{/* Demo Controls */}
				<div className="bg-white p-6 rounded-lg shadow-md mb-6">
					<h2 className="text-xl font-semibold mb-4">
						Demo Controls
					</h2>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
						<button
							onClick={() => setShowError(!showError)}
							className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
							{showError ? "Hide" : "Show"} Error
						</button>
						<button
							onClick={() => setShowWarning(!showWarning)}
							className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
							{showWarning ? "Hide" : "Show"} Warning
						</button>
						<button
							onClick={() => setShowInfo(!showInfo)}
							className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
							{showInfo ? "Hide" : "Show"} Info
						</button>
						<button
							onClick={() => setShowAutoHide(!showAutoHide)}
							className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
							{showAutoHide ? "Hide" : "Show"} Auto-Hide
						</button>
					</div>
				</div>

				{/* Error Message Examples */}
				<div className="space-y-4">
					{showError && (
						<ErrorMessage
							message="Something went wrong! Please check your input and try again."
							type="error"
							onClose={() => setShowError(false)}
						/>
					)}

					{showWarning && (
						<ErrorMessage
							message="Warning: This action cannot be undone. Please proceed with caution."
							type="warning"
							onClose={() => setShowWarning(false)}
						/>
					)}

					{showInfo && (
						<ErrorMessage
							message="Information: Your request has been processed successfully."
							type="info"
							onClose={() => setShowInfo(false)}
						/>
					)}

					{showAutoHide && (
						<ErrorMessage
							message="This message will automatically disappear in 5 seconds."
							type="info"
							autoHide={true}
							autoHideDelay={5000}
							onClose={() => setShowAutoHide(false)}
						/>
					)}
				</div>

				{/* Features */}
				<div className="bg-white p-6 rounded-lg shadow-md mt-6">
					<h2 className="text-xl font-semibold mb-4">Features</h2>
					<ul className="space-y-2 text-gray-700">
						<li className="flex items-center">
							<span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
							Animated border effects with flowing gradients
						</li>
						<li className="flex items-center">
							<span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
							Slide-in bounce animation on appear
						</li>
						<li className="flex items-center">
							<span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
							Pulsing glow effect for attention
						</li>
						<li className="flex items-center">
							<span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
							Auto-hide functionality with progress bar
						</li>
						<li className="flex items-center">
							<span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
							Multiple types: error, warning, info
						</li>
						<li className="flex items-center">
							<span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
							Responsive design with Tailwind CSS
						</li>
						<li className="flex items-center">
							<span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
							Customizable icons and styling
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default ErrorMessageDemo;
