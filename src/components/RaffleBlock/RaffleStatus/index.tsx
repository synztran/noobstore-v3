import { motion, AnimatePresence } from "framer-motion";

interface IProps {
	mode: "upcoming" | "running" | "ended";
}

const STATUS_TEXT = {
	upcoming: "Sắp diễn ra",
	running: "Đang diễn ra",
	ended: "Đã kết thúc",
};

const textVariants = {
	initial: { opacity: 0, y: 16 },
	animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
	exit: { opacity: 0, y: -16, transition: { duration: 0.3 } },
};

const RaffleStatus = ({ mode }: IProps) => {
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
