import { StepValue } from "@/components/RaffleBlock/RaffleModalFancy/Stepper/types";
import React, { ReactNode } from "react";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface IStep {
	props: {
		stepValue: StepValue;
		name: string;
	};
	children: ReactNode;
}

interface States {
	steps: IStep[];
	currentStep: IStep | null;
	direction: number;
	// user: IAuthUser | null;
	raffleData: any;
	isLoading: boolean;
	isSubmitting: boolean;
	hasSecretKey: boolean;
	totalSteps: number;
	isLastStep: boolean;
	isCompleted: boolean;
}

interface Actions {
	setSteps: (steps: IStep[]) => void;
	setCurrentStep: (step: IStep | null) => void;
	setDirection: (dir: number) => void;
	updateStep: (newStep: IStep) => void;
	handleBack: () => void;
	handleNext: () => void;
	// init: (params: { user: IAuthUser | null; children: ReactNode }) => void;
	init: (params: { children: ReactNode }) => void;
}

type RaffleStepStore = States & { actions: Actions };

const InitialState: States = {
	steps: [],
	currentStep: null,
	direction: 0,
	// user: null,
	raffleData: null,
	isLoading: false,
	isSubmitting: false,
	hasSecretKey: false,
	totalSteps: 0,
	isLastStep: false,
	isCompleted: false,
};

const useRaffleStep = create<RaffleStepStore>()(
	devtools((set, get) => ({
		...InitialState,
		actions: {
			setSteps: (steps) => set((state) => ({ ...state, steps })),
			setCurrentStep: (step) =>
				set((state) => ({ ...state, currentStep: step })),
			setDirection: (dir) =>
				set((state) => ({ ...state, direction: dir })),
			updateStep: (newStep) => {
				const steps = get().steps;
				set((state) => ({ ...state, currentStep: newStep }));
				if (
					newStep?.props?.stepValue ===
					steps[steps.length - 1]?.props.stepValue
				) {
					set((state) => ({
						...state,
						currentStep: steps?.[0] || null,
						direction: 0,
					}));
				}
			},
			handleBack: () => {
				const { currentStep, steps } = get();
				const { updateStep } = get().actions;
				if (!currentStep) return;
				if (
					currentStep?.props.stepValue === steps?.[0]?.props.stepValue
				) {
					return;
				}
				const currentIndex = steps.findIndex(
					(step) =>
						step.props.stepValue === currentStep?.props.stepValue
				);
				const prevIndex = Math.max(0, currentIndex - 1);
				const prevStep = steps[prevIndex];
				if (prevStep) {
					set((state) => ({ ...state, direction: -1 }));
					updateStep(prevStep);
				}
			},
			handleNext: () => {
				const { currentStep, steps } = get();
				const { updateStep } = get().actions;
				set((state) => ({ ...state, direction: 1 }));
				const currentIndex = steps.findIndex(
					(step) =>
						step.props.stepValue === currentStep?.props.stepValue
				);
				const nextIndex = Math.min(steps.length - 1, currentIndex + 1);
				const nextStep = steps[nextIndex];
				if (nextStep) {
					updateStep(nextStep);
				}
			},
			init: ({ children }) => {
				console.log("children in init:", children);
				// set((state) => ({ ...state, user }));
				const childrenSteps = React.Children.toArray(children)
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

				set({
					steps: childrenSteps,
					totalSteps: childrenSteps.length,
					currentStep:
						childrenSteps.length > 0 ? childrenSteps[0] : null,
				});
			},
		},
	}))
);

export const useRaffleStepAction = () =>
	useRaffleStep((state) => state.actions);
export default useRaffleStep;
