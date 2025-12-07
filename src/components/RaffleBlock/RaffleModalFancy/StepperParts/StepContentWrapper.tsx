import { classNames } from "@/utils/AppConfig";
import { AnimatePresence, motion } from "motion/react";
import { ReactNode, useState } from "react";
import SlideTransition from "./SlideTransition";

interface StepContentWrapperProps {
	isCompleted: boolean;
	currentStep: number;
	direction: number;
	children: ReactNode;
	className?: string;
	disabled?: boolean;
}

export default function StepContentWrapper({
	isCompleted,
	currentStep,
	direction,
	children,
	className = "",
	disabled = false,
}: StepContentWrapperProps) {
	const [parentHeight, setParentHeight] = useState<number>(0);

	return (
		<motion.div
			transition={{ type: "spring", duration: 0.4 }}
			className={classNames(
				className,
				"relative overflow-hidden overflow-y-auto",
				"py-4",
				disabled ? "pointer-events-none opacity-50 blur-sm" : ""
			)}>
			<AnimatePresence initial={false} mode="sync" custom={direction}>
				{!isCompleted && (
					<SlideTransition
						key={currentStep}
						direction={direction}
						onHeightReady={(h) => setParentHeight(h)}>
						{children}
					</SlideTransition>
				)}
			</AnimatePresence>
		</motion.div>
	);
}
