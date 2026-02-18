import { EnumRaffleStatus } from "@/interface/Client/Raffle";
import DateUtils from "@/utils/DateUtils";
import { AnimatePresence, motion } from "framer-motion";
import React, { memo, useEffect, useRef, useState } from "react";

interface CountdownProps {
	startDate: string | Date;
	endDate: string | Date;
	raffleStatus: EnumRaffleStatus;
	className?: string;
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

// Motion variants for digit animation
const digitVariants: any = {
	initial: { y: 20, opacity: 0 },
	animate: {
		y: 0,
		opacity: 1,
		transition: { type: "spring", stiffness: 300, damping: 24 },
	},
	exit: { y: -20, opacity: 0, transition: { duration: 0.2 } },
};

const labelVariants: any = {
	initial: { opacity: 0 },
	animate: { opacity: 1, transition: { duration: 0.3 } },
	exit: { opacity: 0, transition: { duration: 0.2 } },
};

const RaffleDetailCountdown: React.FC<CountdownProps> = ({
	startDate,
	endDate,
	raffleStatus,
	className = "",
}) => {
	const [mode, setMode] = useState<EnumRaffleStatus>(raffleStatus);
	const [timeLeft, setTimeLeft] = useState<{
		days: number;
		hours: number;
		minutes: number;
		seconds: number;
	}>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		const start = DateUtils.parseServerDate(startDate);
		const end = DateUtils.parseServerDate(endDate);

		const update = () => {
			const nowDate = new Date();
			const { mode: m, diff } = DateUtils.getTimeLeft(
				start,
				end,
				nowDate,
			);
			setMode(m as typeof mode);
			setTimeLeft(formatTime(diff));
		};

		update();
		intervalRef.current = setInterval(update, 1000);

		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, [startDate, endDate]);

	// Animated digit component
	const AnimatedDigit = ({ value }: { value: string }) => (
		<AnimatePresence mode="wait" initial={false}>
			<motion.p
				key={value}
				variants={digitVariants}
				initial="initial"
				animate="animate"
				exit="exit"
				className="text-2xl font-mono font-black text-white">
				{value}
			</motion.p>
		</AnimatePresence>
	);

	// Time unit component
	const TimeUnit = ({ value, label }: { value: string; label: string }) => (
		<div className="text-center">
			<AnimatedDigit value={value} />
			<p className="text-[8px] uppercase font-bold text-slate-500 mt-1">
				{label}
			</p>
		</div>
	);

	return (
		<div
			className={`bg-black/40 rounded-xl p-4 border border-white/5 space-y-4 ${className}`}>
			{/* Header with live indicator */}
			<div className="flex items-center gap-2">
				<div className="relative flex h-2 w-2">
					<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
					<span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
				</div>
				<p className="text-[10px] uppercase tracking-widest font-bold text-blue-400">
					Entries Closing In
				</p>
			</div>

			{/* Countdown display */}
			{mode !== EnumRaffleStatus.ENDED ? (
				<div className="flex justify-between items-end text-white gap-2">
					<TimeUnit value={pad(timeLeft.days)} label="Days" />
					<span className="text-slate-600 font-mono text-xl mb-5">
						:
					</span>
					<TimeUnit value={pad(timeLeft.hours)} label="Hours" />
					<span className="text-slate-600 font-mono text-xl mb-5">
						:
					</span>
					<TimeUnit value={pad(timeLeft.minutes)} label="Mins" />
					<span className="text-slate-600 font-mono text-xl mb-5">
						:
					</span>
					<TimeUnit value={pad(timeLeft.seconds)} label="Secs" />
				</div>
			) : (
				<AnimatePresence mode="wait" initial={false}>
					<motion.div
						key="raffle-ended"
						variants={labelVariants}
						initial="initial"
						animate="animate"
						exit="exit"
						className="py-6 text-center">
						<p className="text-lg font-semibold text-white">
							Raffle Ended
						</p>
					</motion.div>
				</AnimatePresence>
			)}
		</div>
	);
};

export default memo(RaffleDetailCountdown);
