import React, { useEffect, useState } from "react";

interface IProps {
	message: string;
	type?: "error" | "warning" | "info";
	onClose?: () => void;
	autoHide?: boolean;
	autoHideDelay?: number;
	className?: string;
	showIcon?: boolean;
}

const ErrorMessage: React.FC<IProps> = ({
	message,
	type = "error",
	onClose,
	autoHide = false,
	autoHideDelay = 5000,
	className = "",
	showIcon = true,
}) => {
	const [isVisible, setIsVisible] = useState(true);
	const [isAnimating, setIsAnimating] = useState(false);

	useEffect(() => {
		if (autoHide) {
			const timer = setTimeout(() => {
				handleClose();
			}, autoHideDelay);
			return () => clearTimeout(timer);
		}
	}, [autoHide, autoHideDelay]);

	useEffect(() => {
		// Trigger animation on mount
		setIsAnimating(true);
		const timer = setTimeout(() => setIsAnimating(false), 600);
		return () => clearTimeout(timer);
	}, []);

	const handleClose = () => {
		setIsVisible(false);
		setTimeout(() => {
			onClose?.();
		}, 300);
	};

	const getTypeStyles = () => {
		switch (type) {
			case "warning":
				return {
					bg: "bg-gradient-to-r from-orange-50 to-yellow-50",
					border: "border-orange-200",
					text: "text-orange-800",
					icon: "⚠️",
					iconBg: "bg-orange-100",
					iconText: "text-orange-600",
				};
			case "info":
				return {
					bg: "bg-gradient-to-r from-blue-50 to-cyan-50",
					border: "border-blue-200",
					text: "text-blue-800",
					icon: "ℹ️",
					iconBg: "bg-blue-100",
					iconText: "text-blue-600",
				};
			default:
				return {
					bg: "bg-gradient-to-r from-red-50 to-pink-50",
					border: "border-red-200",
					text: "text-red-800",
					icon: "❌",
					iconBg: "bg-red-100",
					iconText: "text-red-600",
				};
		}
	};

	const typeStyles = getTypeStyles();

	if (!isVisible) return null;

	return (
		<>
			<div
				className={`
					relative overflow-hidden rounded-lg shadow-lg border-2
					${typeStyles.bg} ${typeStyles.border} ${typeStyles.text}
					transform transition-all duration-300 ease-out
					${isAnimating ? "scale-105 shadow-2xl" : "scale-100"}
					${className}
				`}
				style={{
					animation: isAnimating
						? "slideInBounce 0.6s ease-out"
						: "none",
				}}>
				{/* Animated border effect */}
				<div className="absolute inset-0 rounded-lg overflow-hidden">
					<div
						className="absolute inset-0 opacity-30"
						style={{
							background: `linear-gradient(45deg, transparent 30%, ${type === "error" ? "#ef4444" : type === "warning" ? "#f59e0b" : "#3b82f6"} 50%, transparent 70%)`,
							animation: "borderFlow 2s linear infinite",
							transform: "translateX(-100%)",
						}}
					/>
					<div
						className="absolute inset-0 opacity-20"
						style={{
							background: `linear-gradient(-45deg, transparent 30%, ${type === "error" ? "#ec4899" : type === "warning" ? "#eab308" : "#06b6d4"} 50%, transparent 70%)`,
							animation:
								"borderFlow 2.5s linear infinite reverse",
							transform: "translateX(100%)",
						}}
					/>
				</div>

				{/* Pulsing glow effect */}
				<div
					className="absolute inset-0 rounded-lg opacity-20"
					style={{
						background: `radial-gradient(circle at center, ${type === "error" ? "#ef4444" : type === "warning" ? "#f59e0b" : "#3b82f6"} 0%, transparent 70%)`,
						animation: "pulse 2s ease-in-out infinite",
					}}
				/>

				{/* Content */}
				<div className="relative z-10 flex items-start p-4">
					{showIcon && (
						<div
							className={`
								flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
								${typeStyles.iconBg} ${typeStyles.iconText}
								transform transition-all duration-300
								${isAnimating ? "scale-110 rotate-12" : "scale-100 rotate-0"}
							`}>
							<span className="text-lg">{typeStyles.icon}</span>
						</div>
					)}

					<div className="flex-1 ml-3">
						<p className="text-sm font-medium leading-5">
							{message}
						</p>
					</div>

					{onClose && (
						<button
							onClick={handleClose}
							className={`
								flex-shrink-0 ml-3 p-1 rounded-full
								${typeStyles.iconText} hover:bg-black hover:bg-opacity-10
								transition-all duration-200 transform hover:scale-110
								focus:outline-none focus:ring-2 focus:ring-offset-2
								${type === "error" ? "focus:ring-red-500" : type === "warning" ? "focus:ring-orange-500" : "focus:ring-blue-500"}
							`}>
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
					<div className="absolute bottom-0 left-0 right-0 h-1 bg-black bg-opacity-10 rounded-b-lg overflow-hidden">
						<div
							className={`h-full ${type === "error" ? "bg-red-500" : type === "warning" ? "bg-orange-500" : "bg-blue-500"}`}
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

				@keyframes pulse {
					0%,
					100% {
						opacity: 0.1;
						transform: scale(1);
					}
					50% {
						opacity: 0.3;
						transform: scale(1.05);
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

				@keyframes shake {
					0%,
					100% {
						transform: translateX(0);
					}
					10%,
					30%,
					50%,
					70%,
					90% {
						transform: translateX(-2px);
					}
					20%,
					40%,
					60%,
					80% {
						transform: translateX(2px);
					}
				}
			`}</style>
		</>
	);
};

export default ErrorMessage;
