import React, { useEffect, useState } from "react";

interface SimpleErrorMessageProps {
	message: string;
	onClose?: () => void;
	autoHide?: boolean;
	autoHideDelay?: number;
	className?: string;
}

const SimpleErrorMessage: React.FC<SimpleErrorMessageProps> = ({
	message,
	onClose,
	autoHide = false,
	autoHideDelay = 4000,
	className = "",
}) => {
	const [isVisible, setIsVisible] = useState(true);

	useEffect(() => {
		if (autoHide) {
			const timer = setTimeout(() => {
				handleClose();
			}, autoHideDelay);
			return () => clearTimeout(timer);
		}
		return;
	}, [autoHide, autoHideDelay]);

	const handleClose = () => {
		setIsVisible(false);
		setTimeout(() => {
			onClose?.();
		}, 300);
	};

	if (!isVisible) return null;

	return (
		<>
			<div
				className={`
					relative overflow-hidden rounded-lg shadow-lg border-2 border-red-200
					bg-gradient-to-r from-red-50 to-pink-50 text-red-800
					transform transition-all duration-300 ease-out animate-slideInBounce
					${className}
				`}
				style={{
					position: "fixed",
					top: "20px",
					right: "20px",
					maxWidth: "400px",
					zIndex: 9999,
				}}>
				{/* Animated border effect */}
				<div className="absolute inset-0 rounded-lg overflow-hidden">
					<div
						className="absolute inset-0 opacity-30"
						style={{
							background:
								"linear-gradient(45deg, transparent 30%, #ef4444 50%, transparent 70%)",
							animation: "borderFlow 2s linear infinite",
							transform: "translateX(-100%)",
						}}
					/>
				</div>

				{/* Content */}
				<div className="relative z-10 flex items-start p-4">
					<div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center mr-3">
						<span className="text-sm">❌</span>
					</div>

					<div className="flex-1">
						<p className="text-sm font-medium leading-5">
							{message}
						</p>
					</div>

					{onClose && (
						<button
							onClick={handleClose}
							className="flex-shrink-0 ml-3 p-1 rounded-full text-red-600 hover:bg-red-100 transition-all duration-200 focus:outline-none">
							<svg
								className="w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					)}
				</div>

				{/* Progress bar for auto-hide */}
				{autoHide && (
					<div className="absolute bottom-0 left-0 right-0 h-1 bg-red-200 rounded-b-lg overflow-hidden">
						<div
							className="h-full bg-red-500"
							style={{
								animation: `progressBar ${autoHideDelay}ms linear forwards`,
							}}
						/>
					</div>
				)}
			</div>

			<style jsx>{`
				@keyframes slideInBounce {
					0% {
						transform: translateX(100%) scale(0.8);
						opacity: 0;
					}
					50% {
						transform: translateX(-10%) scale(1.05);
						opacity: 0.8;
					}
					100% {
						transform: translateX(0) scale(1);
						opacity: 1;
					}
				}

				@keyframes borderFlow {
					0% {
						transform: translateX(-100%);
					}
					100% {
						transform: translateX(100%);
					}
				}

				@keyframes progressBar {
					0% {
						width: 100%;
					}
					100% {
						width: 0%;
					}
				}

				.animate-slideInBounce {
					animation: slideInBounce 0.6s ease-out;
				}
			`}</style>
		</>
	);
};

export default SimpleErrorMessage;
