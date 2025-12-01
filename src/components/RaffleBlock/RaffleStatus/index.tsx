import { EnumRaffleStatus } from "@/interface/Client/Raffle";
import { motion, AnimatePresence } from "framer-motion";

interface IProps {
	mode: EnumRaffleStatus;
}

const STATUS_TEXT: Record<EnumRaffleStatus, string> = {
	[EnumRaffleStatus.UPCOMING]: "Sắp diễn ra",
	[EnumRaffleStatus.ACTIVE]: "Đang diễn ra",
	[EnumRaffleStatus.COMPLETED]: "Đã kết thúc",
	[EnumRaffleStatus.CANCELLED]: "Đã hủy",
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
				className="text-lg font-bold tracking-wide border border-gray-300 rounded-md p-2 max-h-[36px] leading-[1] bg-gray-200">
				{STATUS_TEXT[mode]}
			</motion.span>
		</AnimatePresence>
	);
};

export default RaffleStatus;
