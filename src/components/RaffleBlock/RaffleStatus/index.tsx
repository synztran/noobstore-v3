import { EnumRaffleStatus } from "@/interface/Client/Raffle";
import { AnimatePresence, motion } from "framer-motion";

interface IProps {
	mode: EnumRaffleStatus;
}

const STATUS_TEXT: Record<
	EnumRaffleStatus,
	{
		title: string;
		color: string;
		bgColor: string;
	}
> = {
	[EnumRaffleStatus.UPCOMING]: {
		title: "Sắp diễn ra",
		color: "text-yellow-800",
		bgColor: "bg-yellow-200",
	},
	[EnumRaffleStatus.ACTIVE]: {
		title: "Đang diễn ra",
		color: "text-green-800",
		bgColor: "bg-green-300",
	},
	[EnumRaffleStatus.COMPLETED]: {
		title: "Đã kết thúc",
		color: "text-blue-800",
		bgColor: "bg-blue-200",
	},
	[EnumRaffleStatus.CANCELLED]: {
		title: "Đã hủy",
		color: "text-gray-800",
		bgColor: "bg-gray-200",
	},
};

const textVariants = {
	initial: { opacity: 0, y: 16 },
	animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
	exit: { opacity: 0, y: -16, transition: { duration: 0.3 } },
};

const RaffleStatus = ({ mode }: IProps) => {
	console.log("moe", mode);
	return (
		<AnimatePresence mode="wait" initial={false}>
			<motion.span
				key={mode}
				variants={textVariants}
				initial="initial"
				animate="animate"
				exit="exit"
				className={`text-lg font-bold tracking-wide border border-gray-300 rounded-md p-2 max-h-[36px] leading-[1] ${STATUS_TEXT[mode].bgColor} ${STATUS_TEXT[mode].color}`}>
				{STATUS_TEXT[mode].title || ""}
			</motion.span>
		</AnimatePresence>
	);
};

export default RaffleStatus;
