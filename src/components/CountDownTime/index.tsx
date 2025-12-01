import React, { useState, useEffect, useCallback } from "react";

interface CountDownTimeProps {
	className?: string;
	targetDate?: Date;
	showSeconds?: boolean;
	showAmPm?: boolean;
	fontSize?: number;
	color?: string;
}

const CountDownTime: React.FC<CountDownTimeProps> = ({
	className = "",
	targetDate,
	showSeconds = true,
	showAmPm = true,
	fontSize = 80,
	color = "#ffffff",
}) => {
	const [time, setTime] = useState(new Date());
	const [displayValues, setDisplayValues] = useState({
		hours: "00",
		minutes: "00",
		seconds: "00",
		ampm: "AM",
	});
	const [animating, setAnimating] = useState({
		hours: false,
		minutes: false,
		seconds: false,
		ampm: false,
	});

	const formatTime = useCallback((date: Date) => {
		let hours = date.getHours();
		const minutes = date.getMinutes();
		const seconds = date.getSeconds();

		// Convert to 12-hour format
		const ampm = hours >= 12 ? "PM" : "AM";
		hours = hours % 12 || 12;

		return {
			hours: hours.toString().padStart(2, "0"),
			minutes: minutes.toString().padStart(2, "0"),
			seconds: seconds.toString().padStart(2, "0"),
			ampm,
		};
	}, []);

	const updateTime = useCallback(() => {
		const now = targetDate || new Date();
		const newTimeValues = formatTime(now);

		// Check which values changed for animation
		const newAnimating = {
			hours: displayValues.hours !== newTimeValues.hours,
			minutes: displayValues.minutes !== newTimeValues.minutes,
			seconds: displayValues.seconds !== newTimeValues.seconds,
			ampm: displayValues.ampm !== newTimeValues.ampm,
		};

		setDisplayValues(newTimeValues);
		setAnimating(newAnimating);

		// Reset animation after transition
		setTimeout(() => {
			setAnimating({
				hours: false,
				minutes: false,
				seconds: false,
				ampm: false,
			});
		}, 700); // Match the duration from original code
	}, [targetDate, formatTime, displayValues]);

	useEffect(() => {
		updateTime();
		const interval = setInterval(updateTime, 1000);
		return () => clearInterval(interval);
	}, [updateTime]);

	const DigitDisplay: React.FC<{
		value: string;
		isAnimating: boolean;
		fontSize: number;
		color: string;
	}> = ({ value, isAnimating, fontSize, color }) => {
		const digits = value.split("");

		return (
			<div className="flex">
				{digits.map((digit, index) => (
					<div
						key={index}
						className="relative overflow-hidden"
						style={{
							width: fontSize * 0.6,
							height: fontSize * 1.2,
						}}>
						<div
							className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out ${
								isAnimating
									? "transform -translate-y-full opacity-0 scale-50"
									: "transform translate-y-0 opacity-100 scale-100"
							}`}
							style={{
								fontSize: `${fontSize}px`,
								lineHeight: `${fontSize}px`,
								color,
								fontFamily: "'Rubik Iso', monospace",
								fontWeight: "bold",
							}}>
							{digit}
						</div>
						{isAnimating && (
							<div
								className="absolute inset-0 flex items-center justify-center transform translate-y-full opacity-100 scale-50 transition-all duration-700 ease-in-out"
								style={{
									fontSize: `${fontSize}px`,
									lineHeight: `${fontSize}px`,
									color,
									fontFamily: "'Rubik Iso', monospace",
									fontWeight: "bold",
								}}>
								{digit}
							</div>
						)}
					</div>
				))}
			</div>
		);
	};

	return (
		<div className={`flex items-center justify-center ${className}`}>
			<style jsx global>{`
				@import url("https://fonts.googleapis.com/css2?family=Rubik+Iso&display=swap");
			`}</style>

			<div className="flex items-center space-x-2">
				{/* Hours */}
				<div className="flex items-center">
					<DigitDisplay
						value={displayValues.hours}
						isAnimating={animating.hours}
						fontSize={fontSize}
						color={color}
					/>
				</div>

				{/* Colon */}
				<div
					className="mx-2"
					style={{
						fontSize: `${fontSize}px`,
						lineHeight: `${fontSize}px`,
						color,
						fontFamily: "'Rubik Iso', monospace",
						fontWeight: "bold",
					}}>
					:
				</div>

				{/* Minutes */}
				<div className="flex items-center">
					<DigitDisplay
						value={displayValues.minutes}
						isAnimating={animating.minutes}
						fontSize={fontSize}
						color={color}
					/>
				</div>

				{/* Seconds */}
				{showSeconds && (
					<>
						<div
							className="mx-2"
							style={{
								fontSize: `${fontSize}px`,
								lineHeight: `${fontSize}px`,
								color,
								fontFamily: "'Rubik Iso', monospace",
								fontWeight: "bold",
							}}>
							:
						</div>
						<div className="flex items-center">
							<DigitDisplay
								value={displayValues.seconds}
								isAnimating={animating.seconds}
								fontSize={fontSize}
								color={color}
							/>
						</div>
					</>
				)}

				{/* AM/PM */}
				{showAmPm && (
					<div className="ml-4">
						<div
							className={`transition-all duration-700 ease-in-out ${
								animating.ampm
									? "transform -translate-y-full opacity-0 scale-50"
									: "transform translate-y-0 opacity-100 scale-100"
							}`}
							style={{
								fontSize: `${fontSize * 0.5}px`,
								lineHeight: `${fontSize * 0.5}px`,
								color,
								fontFamily: "'Rubik Iso', monospace",
								fontWeight: "bold",
							}}>
							{displayValues.ampm}
						</div>
						{animating.ampm && (
							<div
								className="transform translate-y-full opacity-100 scale-50 transition-all duration-700 ease-in-out"
								style={{
									fontSize: `${fontSize * 0.5}px`,
									lineHeight: `${fontSize * 0.5}px`,
									color,
									fontFamily: "'Rubik Iso', monospace",
									fontWeight: "bold",
								}}>
								{displayValues.ampm}
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default CountDownTime;
