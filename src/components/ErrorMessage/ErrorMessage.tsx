import React, { useEffect, useRef, useState } from "react";

interface ErrorMessageProps {
	message: string;
	type?: "error" | "warning" | "info";
	onClose?: () => void;
	autoHide?: boolean;
	autoHideDelay?: number;
	className?: string;
	showIcon?: boolean;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
	message,
	type = "error",
	onClose,
	autoHide = false,
	autoHideDelay = 5000,
	className = "",
	showIcon = true,
}) => {
	// Only show the error the first time the component is mounted
	const [hasShown, setHasShown] = useState(false);
	const [isVisible, setIsVisible] = useState(true);
	const [isAnimating, setIsAnimating] = useState(false);
	const [progress, setProgress] = useState(100);
	const progressRef = useRef<number>(100);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		if (!hasShown) {
			setHasShown(true);
			setIsVisible(true);
		} else {
			setIsVisible(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // Only run on mount

	useEffect(() => {
		if (!isVisible) return;
		if (autoHide) {
			const start = Date.now();
			const tick = () => {
				const elapsed = Date.now() - start;
				const percent = Math.max(
					0,
					100 - (elapsed / autoHideDelay) * 100
				);
				progressRef.current = percent;
				setProgress(percent);
				if (percent <= 0) {
					handleClose();
				}
			};
			intervalRef.current = setInterval(tick, 30);
			const timer = setTimeout(() => {
				handleClose();
			}, autoHideDelay);
			return () => {
				clearTimeout(timer);
				if (intervalRef.current) clearInterval(intervalRef.current);
			};
		}
		return;
	}, [autoHide, autoHideDelay, isVisible]);

	useEffect(() => {
		if (!isVisible) return;
		setIsAnimating(true);
		const timer = setTimeout(() => setIsAnimating(false), 600);
		return () => clearTimeout(timer);
	}, [isVisible]);

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
					progress: "bg-orange-500",
					shadow: "shadow-orange-200",
				};
			case "info":
				return {
					bg: "bg-gradient-to-r from-blue-50 to-cyan-50",
					border: "border-blue-200",
					text: "text-blue-800",
					icon: "ℹ️",
					iconBg: "bg-blue-100",
					iconText: "text-blue-600",
					progress: "bg-blue-500",
					shadow: "shadow-blue-200",
				};
			default:
				return {
					bg: "bg-gradient-to-r from-red-50 to-pink-50",
					border: "border-red-200",
					text: "text-red-800",
					icon: "❌",
					iconBg: "bg-red-100",
					iconText: "text-red-600",
					progress: "bg-red-500",
					shadow: "shadow-red-200",
				};
		}
	};

	const typeStyles = getTypeStyles();

	if (!isVisible) return null;

	return (
		<>
			<div
				className={`
					error-tooltip-absolute
					absolute top-0 right-0 z-50
					min-w-[260px] max-w-xs
					${typeStyles.bg} ${typeStyles.border} ${typeStyles.text} ${typeStyles.shadow}
					rounded-lg border-2 shadow-lg
					transition-all duration-300 ease-out
					${isAnimating ? "scale-105 shadow-2xl" : "scale-100"}
					${className}
				`}
				style={{
					animation: isAnimating
						? "slideInTooltip 0.6s cubic-bezier(0.23, 1, 0.32, 1)"
						: "none",
				}}>
				{/* Content */}
				<div className="relative z-10 flex items-start p-4">
					{showIcon && (
						<div
							className={`
								flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
								${typeStyles.iconBg} ${typeStyles.iconText}
								transition-all duration-300
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
								${
									type === "error"
										? "focus:ring-red-500"
										: type === "warning"
											? "focus:ring-orange-500"
											: "focus:ring-blue-500"
								}
							`}
							aria-label="Đóng">
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
							className={`h-full transition-all duration-100 ${typeStyles.progress}`}
							style={{
								width: `${progress}%`,
							}}
						/>
					</div>
				)}
			</div>
			<style jsx>{`
				@keyframes slideInTooltip {
					0% {
						transform: translateX(40%) scale(0.9);
						opacity: 0;
					}
					60% {
						transform: translateX(-4%) scale(1.04);
						opacity: 0.9;
					}
					100% {
						transform: translateX(0) scale(1);
						opacity: 1;
					}
				}
			`}</style>
		</>
	);
};

export default ErrorMessage;
