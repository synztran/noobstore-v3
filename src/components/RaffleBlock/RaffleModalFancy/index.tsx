import React, {
	useState,
	Children,
	useRef,
	useLayoutEffect,
	HTMLAttributes,
	ReactNode,
	useEffect,
} from "react";
import { motion, AnimatePresence, Variants, steps } from "motion/react";
import { CircularProgress, Divider } from "@mui/material";
import { classNames } from "@/utils/AppConfig";
import { RaffleData, RaffleSubmitForm } from "@/interface/Raffle";
import RaffleBadge from "../RaffleBadge";
import NotifyUtils from "@/utils/NotifyUtils";
import {
	IBEResponseRaffleInfo,
	IRequestRaffleJoin,
} from "@/interface/Client/Raffle";
import useRafflesQuery from "@/react-query/raffles/api/useRafflesQueries";
import useRaffleFeaturedQueries from "@/react-query/raffles/api/useRaffleDetailQueries";
import useRaffleDetailQueries from "@/react-query/raffles/api/useRaffleDetailQueries";
import { useRaffleJoinMutation } from "@/react-query/raffles/api/useRaffleJoinMutation";
import { useAuth } from "@/context/Auth";
import { IAuthUser } from "@/interface/Context/auth";
import { IResponse } from "@/interface/Client/interface";
import { SuccessRaffleJoin } from "@/components/CustomToastMessage";

interface StepperProps extends HTMLAttributes<HTMLDivElement> {
	raffleId: string;
	open: boolean;
	onClose: () => void;
	children: ReactNode;
	initialStep?: number;
	onStepChange?: (step: number) => void;
	onFinalStepCompleted?: () => void;
	stepCircleContainerClassName?: string;
	stepContainerClassName?: string;
	contentClassName?: string;
	footerClassName?: string;
	backButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
	nextButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
	backButtonText?: string;
	nextButtonText?: string;
	disableStepIndicators?: boolean;
	renderStepIndicator?: (props: {
		step: number;
		stepName: string;
		currentStep: number;
		onStepClick: (clicked: number) => void;
	}) => ReactNode;
	// raffleData: IBEResponseRaffleInfo | null;
	raffleFormSubmit: RaffleSubmitForm | null;
}

export default function Stepper({
	raffleId,
	open,
	onClose,
	children,
	initialStep = 1,
	onStepChange = () => {},
	onFinalStepCompleted = () => {},
	stepCircleContainerClassName = "",
	stepContainerClassName = "",
	contentClassName = "",
	footerClassName = "",
	backButtonProps = {},
	nextButtonProps = {},
	backButtonText = "Back",
	nextButtonText = "Continue",
	disableStepIndicators = false,
	renderStepIndicator,
	raffleFormSubmit,
	...rest
}: StepperProps) {
	console.log("raffleFormSubmit", raffleFormSubmit);
	const { user } = useAuth() as unknown as { user: IAuthUser | null };
	const { data: raffleData, isPending: isLoading } = useRaffleDetailQueries({
		params: { raffleId },
		enabled: open && !!raffleId,
	});
	const postSubmitRaffle = useRaffleJoinMutation({
		onSuccess: (response: IResponse<any>) => {
			console.log("response", response);
			if (response.status !== "OK") return;
			// NotifyUtils.success(
			// 	<SuccessRaffleJoin
			// 		serviceBookingId={response.data?.payment?.serviceBookingId}
			// 	/>
			// );
			onFinalStepCompleted();
			onClose();
		},
	});
	const { mutate, isPending: isSubmitting } = postSubmitRaffle;

	const [currentStep, setCurrentStep] = useState<number>(initialStep);
	const [direction, setDirection] = useState<number>(0);
	const stepsArray = Children.toArray(children);
	const totalSteps = stepsArray.length;
	const isCompleted = currentStep > totalSteps;
	const isLastStep = currentStep === totalSteps;

	const updateStep = (newStep: number) => {
		setCurrentStep(newStep);
		if (newStep > totalSteps) {
			onFinalStepCompleted();
			setCurrentStep(1);
			setDirection(0);
		} else {
			onStepChange(newStep);
		}
	};

	const handleBack = () => {
		if (currentStep > 1) {
			setDirection(-1);
			updateStep(currentStep - 1);
		}
	};

	const handleNext = () => {
		setDirection(1);
		updateStep(currentStep + 1);
	};

	const handleSubmitRaffle = () => {
		if (!raffleFormSubmit) return;

		const payload: IRequestRaffleJoin = {
			customerId: user?.customerId || null,
			raffleId: raffleFormSubmit?.raffleId || "",
			shipping: {
				// phone: raffleFormSubmit?.phone || "",
				address: raffleFormSubmit?.address || "",
				city: raffleFormSubmit?.city || "",
				companyName: raffleFormSubmit?.companyName || "",
				zipCode: raffleFormSubmit?.zipCode || "",
				shippingMethod: raffleFormSubmit?.shippingMethod || {
					name: "",
					price: null,
				},
				note: raffleFormSubmit?.note || "",
			},
			fullName: raffleFormSubmit?.fullName || "",
			email: raffleFormSubmit?.email || "",
			phone: raffleFormSubmit?.phone || "",
			raffleItemSelections: raffleFormSubmit.productSelections.filter(
				(item) => item.selected && item.priority !== null
			),
		};

		mutate({ payload });
	};
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

	console.log("isLoading", raffleData, isLoading);

	if (!open) return null;
	if (!raffleData) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div
				className="fixed inset-0 bg-black/40 backdrop-blur-md"
				aria-hidden="true"
			/>
			<div
				className="flex min-h-[60vh] flex-1 flex-col items-center justify-center p-4 relative max-h-full overflow-hidden"
				{...rest}>
				<div
					className={`mx-auto w-full max-w-[50vw] max-h-full rounded-xl shadow-xl bg-white overflow-hidden relative ${stepCircleContainerClassName}`}
					style={{ border: "1px solid #222" }}>
					<div className="flex items-center gap-2 p-4">
						<RaffleBadge type={raffleData.raffleType} />
						<div className="text-2xl font-semibold">
							{raffleData?.title || ""}
						</div>
					</div>
					<div
						className={`${stepContainerClassName} flex w-full items-center px-12 pt-4 pb-10`}>
						{stepsArray.map((step, index) => {
							const stepNumber = index + 1;
							const stepName =
								React.isValidElement(step) &&
								step.props &&
								"name" in step.props
									? step.props.name
									: "";
							const isNotLastStep = index < totalSteps - 1;
							return (
								<React.Fragment key={stepNumber}>
									{renderStepIndicator ? (
										renderStepIndicator({
											step: stepNumber,
											stepName: stepName,
											currentStep,
											onStepClick: (clicked) => {
												setDirection(
													clicked > currentStep
														? 1
														: -1
												);
												updateStep(clicked);
											},
										})
									) : (
										<StepIndicator
											step={stepNumber}
											stepName={stepName}
											disableStepIndicators={
												disableStepIndicators
											}
											currentStep={currentStep}
											onClickStep={(clicked) => {
												setDirection(
													clicked > currentStep
														? 1
														: -1
												);
												updateStep(clicked);
											}}
										/>
									)}
									{isNotLastStep && (
										<StepConnector
											isComplete={
												currentStep > stepNumber
											}
										/>
									)}
								</React.Fragment>
							);
						})}
					</div>
					<Divider />
					<StepContentWrapper
						isCompleted={isCompleted}
						currentStep={currentStep}
						direction={direction}
						className={`min-h-[65vh] ${contentClassName}`}
						disabled={isSubmitting}>
						{stepsArray[currentStep - 1]}
					</StepContentWrapper>
					{!isCompleted && raffleFormSubmit && (
						<FooterActions
							isLastStep={isLastStep}
							currentStep={currentStep}
							handleClose={onClose}
							handleBack={handleBack}
							backButtonProps={backButtonProps}
							backButtonText={backButtonText}
							handleNext={handleNext}
							stepsArray={stepsArray}
							raffleFormSubmit={raffleFormSubmit}
							nextButtonProps={nextButtonProps}
							nextButtonText={nextButtonText}
							footerClassName={footerClassName}
							isSubmitting={isSubmitting}
							handleSubmitRaffle={handleSubmitRaffle}
						/>
					)}
				</div>
			</div>
		</div>
	);
}

interface StepContentWrapperProps {
	isCompleted: boolean;
	currentStep: number;
	direction: number;
	children: ReactNode;
	className?: string;
	disabled?: boolean;
}

function StepContentWrapper({
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
			// animate={{ height: isCompleted ? 0 : parentHeight }}
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

interface SlideTransitionProps {
	children: ReactNode;
	direction: number;
	onHeightReady: (height: number) => void;
}

function SlideTransition({
	children,
	direction,
	onHeightReady,
}: SlideTransitionProps) {
	const containerRef = useRef<HTMLDivElement | null>(null);

	useLayoutEffect(() => {
		if (containerRef.current) {
			onHeightReady(containerRef.current.offsetHeight);
		}
	}, [children, onHeightReady]);

	return (
		<motion.div
			ref={containerRef}
			custom={direction}
			variants={stepVariants}
			initial="enter"
			animate="center"
			exit="exit"
			transition={{ duration: 0.4 }}
			style={{ position: "absolute", left: 0, right: 0, top: 0 }}>
			{children}
		</motion.div>
	);
}

const stepVariants: Variants = {
	enter: (dir: number) => ({ x: dir >= 0 ? "-100%" : "100%", opacity: 0 }),
	center: { x: "0%", opacity: 1 },
	exit: (dir: number) => ({ x: dir >= 0 ? "50%" : "-50%", opacity: 0 }),
};

interface StepProps {
	children: ReactNode;
	name: string;
}

export function Step({ children, name }: StepProps) {
	return <div className="px-8 py-4">{children}</div>;
}

interface StepIndicatorProps {
	step: number;
	stepName: string;
	currentStep: number;
	onClickStep: (clicked: number) => void;
	disableStepIndicators?: boolean;
}

function StepIndicator({
	step,
	stepName,
	currentStep,
	onClickStep,
	disableStepIndicators = false,
}: StepIndicatorProps) {
	const status =
		currentStep === step
			? "active"
			: currentStep < step
			? "inactive"
			: "complete";

	const handleClick = () => {
		if (step !== currentStep && !disableStepIndicators) {
			onClickStep(step);
		}
	};

	return (
		<motion.div
			// onClick={handleClick}
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
					<CheckIcon className="h-4 w-4 text-black" />
				) : status === "active" ? (
					<div className="h-3 w-3 rounded-full bg-white" />
				) : (
					<span className="text-sm">{step}</span>
				)}
			</motion.div>
			<div className="absolute -bottom-8 max-w-[100px] truncate font-semibold">
				{stepName}
			</div>
		</motion.div>
	);
}

interface StepConnectorProps {
	isComplete: boolean;
}

function StepConnector({ isComplete }: StepConnectorProps) {
	const lineVariants: Variants = {
		incomplete: { width: 0, backgroundColor: "transparent" },
		complete: { width: "100%", backgroundColor: "var(--primary-color)" },
	};

	return (
		<div className="relative mx-2 h-0.5 flex-1 overflow-hidden rounded bg-neutral-600">
			<motion.div
				className="absolute left-0 top-0 h-full"
				variants={lineVariants}
				initial={false}
				animate={isComplete ? "complete" : "incomplete"}
				transition={{ duration: 0.4 }}
			/>
		</div>
	);
}

interface CheckIconProps extends React.SVGProps<SVGSVGElement> {}

function CheckIcon(props: CheckIconProps) {
	return (
		<svg
			{...props}
			fill="none"
			stroke="currentColor"
			strokeWidth={5}
			viewBox="0 0 24 24">
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
	);
}

const FooterActions = React.memo(
	({
		isLastStep,
		currentStep,
		handleClose,
		handleBack,
		backButtonProps,
		backButtonText,
		handleNext,
		stepsArray,
		raffleFormSubmit,
		nextButtonProps,
		nextButtonText,
		footerClassName = "",
		isSubmitting,
		handleSubmitRaffle,
	}: React.PropsWithChildren<{
		isLastStep: boolean;
		currentStep: number;
		handleClose: () => void;
		handleBack: () => void;
		backButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
		backButtonText: string;
		handleNext: () => void;
		stepsArray: any[];
		raffleFormSubmit: RaffleSubmitForm;
		nextButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
		nextButtonText: string;
		footerClassName?: string;
		isSubmitting: boolean;
		handleSubmitRaffle: () => void;
	}>) => {
		const renderBackButton = () => {
			switch (currentStep) {
				case 1:
					return (
						<button
							type="button"
							onClick={handleClose}
							className="duration-350 rounded px-2 py-1 transition text-neutral-700 hover:bg-gray-400 min-w-[5rem] bg-gray-300"
							{...backButtonProps}
							style={{
								display: isLastStep ? "none" : undefined,
								...backButtonProps?.style,
							}}>
							Đóng
						</button>
					);
				default:
					return (
						<button
							onClick={handleBack}
							className="duration-350 rounded px-2 py-1 transition text-neutral-700 hover:bg-gray-400 min-w-[5rem] bg-gray-300"
							{...backButtonProps}
							disabled={isSubmitting}
							style={{
								display: isLastStep ? "none" : undefined,
								...backButtonProps?.style,
							}}>
							{backButtonText}
						</button>
					);
			}
		};

		const renderNextButton = () => {
			let nextDisabled = false;
			const isLastStep = currentStep === stepsArray.length;
			const isSubmit = currentStep === 3;
			const isSelectedProduct =
				raffleFormSubmit?.productSelections &&
				raffleFormSubmit.productSelections
					.map((item: any) => item.selected)
					.filter(Boolean).length > 0;
			const isSelectionStep = currentStep === 2;

			if (!isSelectedProduct && isSelectionStep) {
				nextDisabled = true;
			}

			if (isSubmit) {
				return (
					<button
						onClick={handleSubmitRaffle}
						className={`duration-350 flex items-center justify-center rounded-lg bg-[var(--primary-color)] py-1.5 px-3.5 font-medium tracking-tight text-white transition hover:bg-red-600 active:bg-red-700 ml-auto ${
							isSubmitting
								? "opacity-50 cursor-not-allowed pointer-events-none !bg-gray-400"
								: ""
						}`}
						{...nextButtonProps}
						disabled={
							isSubmitting ||
							raffleFormSubmit?.productSelections?.length === 0
						}>
						{isSubmitting ? (
							<CircularProgress size={22} />
						) : (
							"Hoàn tất đăng ký"
						)}
					</button>
				);
			}

			return (
				<button
					onClick={handleNext}
					className={`duration-350 flex items-center justify-center rounded-lg bg-[var(--primary-color)] py-1.5 px-3.5 font-medium tracking-tight text-white transition hover:bg-red-600 active:bg-red-700 ml-auto ${
						nextDisabled
							? "opacity-50 !bg-gray-400 cursor-not-allowed pointer-events-none"
							: ""
					}`}
					{...nextButtonProps}
					disabled={nextDisabled}>
					{isLastStep ? "Hoàn tất" : nextButtonText}
				</button>
			);
		};

		return (
			<div
				className={`p-4 block bottom-0 w-full bg-white border-t border-gray-200 ${footerClassName}`}>
				<div className="flex justify-between">
					{renderBackButton()}
					{renderNextButton()}
				</div>
			</div>
		);
	}
);
