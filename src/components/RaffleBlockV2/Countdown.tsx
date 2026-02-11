import { mappingRaffleStatusLabel } from "@/constants";
import { useAuth } from "@/context/Auth";
import { EnumRaffleStatus } from "@/interface/Client/Raffle";
import { IAuthUser } from "@/interface/Context/auth";
import DateUtils from "@/utils/DateUtils";
import { AnimatePresence, motion } from "framer-motion";
import { Timer } from "lucide-react";
import React, { memo, useEffect, useRef, useState } from "react";

interface RaffleCountDownProps {
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

// Move color constants down here for clarity and easier editing
const STATUS_COLORS: Record<EnumRaffleStatus, string> = {
	[EnumRaffleStatus.UPCOMING]: "from-[#ffe29f] to-[#ffd200]",
	[EnumRaffleStatus.ONGOING]: "from-[#a8ffeb] to-[#43cea2]",
	[EnumRaffleStatus.ENDED]: "from-[#e0eafc] to-[#cfdef3]",
	[EnumRaffleStatus.CANCELLED]: "from-[#f5f5f5] to-[#dcdcdc]",
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

const RaffleV2Countdown: React.FC<RaffleCountDownProps> = ({
	startDate,
	endDate,
	raffleStatus,
	className = "",
}) => {
	const { user } = useAuth() as unknown as { user: IAuthUser | null };
	const [now, setNow] = useState<Date>(new Date());
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
			// nowDate is local time; getTimeLeft compares timestamps so using Date objects is fine
			const nowDate = new Date();
			const { mode: m, diff } = DateUtils.getTimeLeft(
				start,
				end,
				nowDate,
			);
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
				className={`inline-block text-lg ${mappingRaffleStatusLabel[raffleStatus]?.iconColor}`}
				style={{ minWidth: "2ch" }}>
				{value}
			</motion.span>
		</AnimatePresence>
	);

	return (
		<div
			className={`border border-gray-200 bg-gray-50 rounded-md p-2 flex items-center justify-between gap-2 ${fancyBg} ${className}`}>
			<div
				className={`clear-both relative uppercase font-semibold text-sm inline-flex gap-1 items-end`}>
				<Timer
					size={20}
					className={`${mappingRaffleStatusLabel[raffleStatus]?.iconColor} scale-110`}
				/>
				<div className="leading-4">
					{mappingRaffleStatusLabel[raffleStatus]?.label}
				</div>
			</div>
			{mode !== EnumRaffleStatus.ENDED ? (
				<div className="flex gap-1 text-[20px] font-mono font-bold items-center text-lg">
					<AnimatedDigit value={pad(timeLeft.days)} />
					<span className="text-lg">:</span>
					<AnimatedDigit value={pad(timeLeft.hours)} />
					<span className="text-lg">:</span>
					<AnimatedDigit value={pad(timeLeft.minutes)} />
					<span className="text-lg">:</span>
					<AnimatedDigit value={pad(timeLeft.seconds)} />
				</div>
			) : (
				<AnimatePresence mode="wait" initial={false}>
					<motion.span
						key="raffle-ended"
						variants={textVariants}
						initial="initial"
						animate="animate"
						exit="exit"
						className="text-xl font-semibold"
						style={{ color: "#111" }}>
						Raffle đã kết thúc.
					</motion.span>
				</AnimatePresence>
			)}
		</div>
	);
};

export default memo(RaffleV2Countdown);
