import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface RaffleCountDownProps {
	startDate: string | Date;
	endDate: string | Date;
	raffleStatus?: "upcoming" | "running" | "ended";
	className?: string;
}

function getTimeLeft(start: Date, end: Date, now: Date) {
	if (now < start) {
		const diff = start.getTime() - now.getTime();
		return { mode: "upcoming", diff };
	}
	if (now >= start && now <= end) {
		const diff = end.getTime() - now.getTime();
		return { mode: "running", diff };
	}
	return { mode: "ended", diff: 0 };
}

function formatTime(ms: number) {
	const totalSeconds = Math.max(0, Math.floor(ms / 1000));
	const days = Math.floor(totalSeconds / (3600 * 24));
	const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;
	return { days, hours, minutes, seconds };
}

const pad = (n: number) => n.toString().padStart(2, "0");

// Move color constants down here for clarity and easier editing
const STATUS_COLORS = {
	// upcoming: "from-[#ffe29f] to-[#ffd200]",
	// running: "from-[#a8ffeb] to-[#43cea2]",
	// ended: "from-[#e0eafc] to-[#cfdef3]",
	upcoming: "bg-gray-200",
	running: "bg-green-400",
	ended: "bg-gray-400",
};

const STATUS_TEXT = {
	upcoming: "Sắp diễn ra",
	running: "Đang diễn ra",
	ended: "Đã kết thúc",
};

// Motion variants for flip/slide effect
const digitVariants = {
	initial: { y: 24, opacity: 0, scale: 0.95 },
	animate: {
		y: 0,
		opacity: 1,
		scale: 1,
		transition: { type: "spring", stiffness: 300, damping: 24 },
	},
	exit: { y: -24, opacity: 0, scale: 0.95, transition: { duration: 0.18 } },
};

const textVariants = {
	initial: { opacity: 0, y: 16 },
	animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
	exit: { opacity: 0, y: -16, transition: { duration: 0.3 } },
};

const RaffleCountDown: React.FC<RaffleCountDownProps> = ({
	startDate,
	endDate,
	raffleStatus,
	className = "",
}) => {
	const [now, setNow] = useState<Date>(new Date());
	const [mode, setMode] = useState<"upcoming" | "running" | "ended">(
		"running"
	);
	const [timeLeft, setTimeLeft] = useState<{
		days: number;
		hours: number;
		minutes: number;
		seconds: number;
	}>({
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
	});
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		const start = new Date(startDate);
		const end = new Date(endDate);

		const update = () => {
			const nowDate = new Date();
			const { mode: m, diff } = getTimeLeft(start, end, nowDate);
			setMode(m as typeof mode);
			setTimeLeft(formatTime(diff));
			setNow(nowDate);
		};

		update();
		intervalRef.current = setInterval(update, 1000);

		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, [startDate, endDate]);

	const colorClass = STATUS_COLORS[mode];
	const fancyBg = `bg-gradient-to-r ${colorClass}`;

	// Helper to render animated digit
	const AnimatedDigit = ({ value }: { value: string | number }) => (
		<AnimatePresence mode="wait" initial={false}>
			<motion.span
				key={value}
				variants={digitVariants as any}
				initial="initial"
				animate="animate"
				exit="exit"
				className="inline-block text-2xl"
				style={{ minWidth: "2ch" }}>
				{value}
			</motion.span>
		</AnimatePresence>
	);

	return (
		<div
			className={`rounded-md border border-gray-300 shadow-sm px-6 py-4 flex flex-col items-center gap-2 ${fancyBg} ${className}`}
			style={{
				letterSpacing: "0.02em",
				boxShadow: "0 4px 24px 0 rgba(0,0,0,0.10)",
			}}>
			<AnimatePresence mode="wait" initial={false}>
				<motion.span
					key={mode}
					variants={textVariants}
					initial="initial"
					animate="animate"
					exit="exit"
					className="text-xl font-bold tracking-wide mb-1"
					style={{ color: "#111" }}>
					{STATUS_TEXT[mode]}
				</motion.span>
			</AnimatePresence>
			{mode !== "ended" ? (
				<div className="flex gap-1 text-[20px] font-mono font-bold items-start">
					<div className="flex flex-col items-center min-w-[30px]">
						<AnimatedDigit value={pad(timeLeft.days)} />
						<span
							className="text-base font-medium opacity-80"
							style={{ color: "#111" }}>
							Ngày
						</span>
					</div>
					<span className="text-2xl font-bold h-[24px]">:</span>
					<div className="flex flex-col items-center min-w-[30px]">
						<AnimatedDigit value={pad(timeLeft.hours)} />
						<span
							className="text-base font-medium opacity-80"
							style={{ color: "#111" }}>
							Giờ
						</span>
					</div>
					<span className="text-2xl font-bold h-[24px]">:</span>
					<div className="flex flex-col items-center min-w-[30px]">
						<AnimatedDigit value={pad(timeLeft.minutes)} />
						<span
							className="text-base font-medium opacity-80"
							style={{ color: "#111" }}>
							Phút
						</span>
					</div>
					<span className="text-2xl font-bold h-[24px]">:</span>
					<div className="flex flex-col items-center">
						<AnimatedDigit value={pad(timeLeft.seconds)} />
						<span
							className="text-base font-medium opacity-80"
							style={{ color: "#111" }}>
							Giây
						</span>
					</div>
				</div>
			) : (
				<AnimatePresence mode="wait" initial={false}>
					<motion.span
						key="raffle-ended"
						variants={textVariants}
						initial="initial"
						animate="animate"
						exit="exit"
						className="text-xl font-semibold mt-2"
						style={{ color: "#111" }}>
						Chúc may mắn! Raffle đã kết thúc.
					</motion.span>
				</AnimatePresence>
			)}
		</div>
	);
};

export default RaffleCountDown;
