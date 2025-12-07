import { IStep } from "@/hook/useRaffleStepper";
import { motion } from "motion/react";

interface StepIndicatorProps {
	step: IStep;
	currentStep: IStep;
	index: number;
	steps: IStep[];
}

const getStatus = (steps: IStep[], currentStep: IStep, step: IStep) => {
	const currentIndex = steps?.findIndex(
		(s) => s.props.stepValue === currentStep.props.stepValue
	);
	const stepIndex = steps?.findIndex(
		(s) => s.props.stepValue === step.props.stepValue
	);
	if (stepIndex < currentIndex) return "complete";
	if (stepIndex === currentIndex) return "active";
	return "inactive";
};

export default function StepIndicator({
	step,
	currentStep,
	index,
	steps,
}: StepIndicatorProps) {
	const status = getStatus(steps, currentStep, step);
	return (
		<motion.div
			className="relative outline-none focus:outline-none text-center flex flex-col items-center"
			animate={status}
			initial={false}>
			<motion.div
				variants={{
					inactive: {
						scale: 1,
						backgroundColor: "#edf2f7",
						color: "#a3a3a3",
					},
					active: {
						scale: 1,
						backgroundColor: "var(--primary-color)",
						color: "#5227FF",
					},
					complete: {
						scale: 1,
						backgroundColor: "var(--primary-color)",
						color: "#3b82f6",
					},
				}}
				transition={{ duration: 0.3 }}
				className="flex h-8 w-8 items-center justify-center rounded-full font-semibold">
				{status === "complete" ? (
					<svg
						fill="none"
						stroke="currentColor"
						strokeWidth={5}
						viewBox="0 0 24 24"
						className="h-4 w-4 text-black">
						<motion.path
							initial={{ pathLength: 0 }}
							animate={{ pathLength: 1 }}
							transition={{
								delay: 0.1,
								type: "tween",
								ease: "easeOut",
								duration: 0.3,
							}}
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M5 13l4 4L19 7"
							stroke="white"
						/>
					</svg>
				) : status === "active" ? (
					<div className="h-3 w-3 rounded-full bg-white" />
				) : (
					<span className="text-lg">{index}</span>
				)}
			</motion.div>
			<div className="absolute -bottom-8 max-w-[100px] truncate font-semibold  text-sm">
				{step.props.name}
			</div>
		</motion.div>
	);
}
