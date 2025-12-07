import { IStep } from "@/hook/useRaffleStepper";
import { classNames } from "@/utils/AppConfig";
import useRaffle, { useRaffleAction } from "@/zustand/useRaffle";
import { AnimatePresence, motion } from "motion/react";
import { ReactNode, useState } from "react";
import SlideTransition from "./SlideTransition";

interface StepContentWrapperProps {
	isCompleted: boolean;
	currentStep: IStep;
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
	const { setScrollToBottom } = useRaffleAction();
	const { isScrollToBottom } = useRaffle();
	const [parentHeight, setParentHeight] = useState<number>(0);

	const isElementScrolledToBottom = (el: HTMLElement | null): boolean => {
		if (!el) return false;
		return el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
	};

	const handleScroll = () => {
		if (!isScrollToBottom) {
			const container = document.getElementById("scrollContainer");
			if (isElementScrolledToBottom(container)) {
				setScrollToBottom(true);
			}
		}
	};

	return (
		<motion.div
			id="scrollContainer"
			onScroll={handleScroll}
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
						key={currentStep?.props.stepValue}
						direction={direction}
						onHeightReady={(h) => setParentHeight(h)}>
						{children}
					</SlideTransition>
				)}
			</AnimatePresence>
		</motion.div>
	);
}
