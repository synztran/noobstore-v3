import { StepValue } from "@/components/RaffleBlock/RaffleModalFancy/Stepper/types";
import { IBEResponseRaffleInfo } from "@/interface/Client/Raffle";
import { IAuthUser } from "@/interface/Context/auth";
import React, {
	Children,
	ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";

export interface IStep {
	props: {
		stepValue: StepValue;
		name: string;
	};
	children: ReactNode;
}

export function useRaffleStepper({
	raffleData,
	user,
	open,
	onFinalStepCompleted,
	onStepChange,
	children,
}: {
	raffleId: string;
	raffleData: IBEResponseRaffleInfo | null;
	user: IAuthUser | null;
	open: boolean;
	onClose: () => void;
	onFinalStepCompleted: () => void;
	onStepChange: (step: IStep) => void;
	// raffleFormSubmit: RaffleSubmitForm | null;
	children: ReactNode;
}) {
	const [steps, setSteps] = useState<IStep[]>([]);
	const [currentStep, setCurrentStep] = useState<IStep | null>(null);
	const [direction, setDirection] = useState<number>(0);
	const [isScrollBottom, setScrollBottom] = useState<boolean>(false);

	const isCompleted = useMemo(() => {
		const currentStepIdx = steps.findIndex(
			(step) => step.props.stepValue === currentStep?.props.stepValue
		);
		return Boolean(currentStepIdx > -1 && currentStepIdx > steps.length);
	}, [steps, currentStep]);

	const isLastStep = useMemo(() => {
		return Boolean(
			currentStep?.props.stepValue ===
				steps[steps.length - 1]?.props.stepValue
		);
	}, [currentStep, steps]);

	const resetStep = useCallback(() => {
		onFinalStepCompleted();
		setCurrentStep(steps?.[0] || null);
		setDirection(0);
	}, [onFinalStepCompleted, steps]);

	const updateStep = useCallback(
		(newStep: IStep) => {
			setCurrentStep(newStep);
			onStepChange(newStep);
		},
		[onStepChange, steps]
	);

	const handleBack = useCallback(() => {
		if (!currentStep) return;
		if (currentStep?.props.stepValue === steps?.[0]?.props.stepValue) {
			return;
		}
		const currentIndex = steps.findIndex(
			(step) => step.props.stepValue === currentStep?.props.stepValue
		);
		const prevIndex = Math.max(0, currentIndex - 1);
		const prevStep = steps[prevIndex];
		if (prevStep) {
			setDirection(-1);
			updateStep(prevStep);
		}
	}, [currentStep, updateStep, steps]);

	const handleNext = useCallback(() => {
		const currentIndex = steps.findIndex(
			(step) => step.props.stepValue === currentStep?.props.stepValue
		);

		if (currentIndex === steps.length - 1) {
			resetStep();
			setDirection(0);
			return;
		}

		const nextIndex = Math.min(steps.length - 1, currentIndex + 1);
		const nextStep = steps[nextIndex];
		if (nextStep) {
			setDirection(1);
			updateStep(nextStep);
		}
	}, [updateStep, steps, currentStep]);

	useEffect(() => {
		if (open) {
			const originalStyle = window.getComputedStyle(
				document.body
			).overflow;
			document.body.style.overflow = "hidden";
			return () => {
				document.body.style.overflow = originalStyle;
			};
		}
		return undefined;
	}, [open]);

	useEffect(() => {
		if (steps && !currentStep) {
			setCurrentStep(steps[0] || null);
		}
	}, [currentStep, steps]);

	useEffect(() => {
		const childrenSteps = Children.toArray(children)
			.filter((child): child is React.ReactElement =>
				React.isValidElement(child)
			)
			.map((el) => ({
				props: {
					stepValue: el.props.stepValue as StepValue,
					name: el.props.name as string,
				},
				children: el,
			}));
		setSteps(childrenSteps);
	}, [children]);

	return {
		steps,
		user,
		// isSubmitting,
		currentStep,
		direction,
		setCurrentStep,
		setDirection,
		updateStep,
		handleBack,
		handleNext,
		// handleSubmitRaffle,
		// hasSecretKey: raffleData?.isHaveSecretKey ?? false,
		totalSteps: steps.length,
		isLastStep,
		isCompleted,
		isScrollBottom,
		setScrollBottom,
	};
}
