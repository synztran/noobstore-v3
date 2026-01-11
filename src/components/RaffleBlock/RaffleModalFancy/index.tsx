import { IStep, useRaffleStepper } from "@/hook/useRaffleStepper";
import React, { HTMLAttributes, ReactNode } from "react";
import RaffleBadge from "../RaffleBadge";
// import FooterActions from "./Stepper/FooterActions";
import StepperRaffleFooter from "@/components/RaffleBlock/RaffleModalFancy/StepperFooter";
import { useAuth } from "@/context/Auth";
import { IAuthUser } from "@/interface/Context/auth";
import useRaffleDetailQueries from "@/react-query/raffles/api/useRaffleDetailQueries";
import StepConnector from "./Stepper/StepConnector";
import StepContentWrapper from "./Stepper/StepContentWrapper";
import StepIndicator from "./Stepper/StepIndicator";
import type { StepValue } from "./Stepper/types";
import NotifyUtils from "@/utils/NotifyUtils";
import { IBEResponseRaffleInfo } from "@/interface/Client/Raffle";

interface IProps extends HTMLAttributes<HTMLDivElement> {
  raffleId: string;
  raffleData?: IBEResponseRaffleInfo;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  onStepChange: (step: IStep) => void;
  onFinalStepCompleted?: () => void;
  stepCircleContainerClassName?: string;
  stepContainerClassName?: string;
  disableStepIndicators?: boolean;
  renderStepIndicator?: (props: {
    step: number;
    stepName: string;
    currentStep: {
      stepValue: StepValue;
      name: string;
    };
    onStepClick: (clicked: IStep) => void;
  }) => ReactNode;
}

interface StepComponentProps {
  user?: IAuthUser | null;
  raffleData?: IBEResponseRaffleInfo;
  isLastStep?: boolean;
  isCompleted?: boolean;
  currentStep?: IStep;
  steps?: IStep[];
  handleNext?: () => void;
  handleBack?: () => void;
  updateStep?: (step: IStep) => void;
  setDirection?: (direction: number) => void;
  setCurrentStep?: (step: IStep) => void;
}

const Stepper = ({
  raffleId,
  raffleData,
  open,
  onClose,
  children,
  onStepChange,
  onFinalStepCompleted = () => {},
  stepCircleContainerClassName = "",
  stepContainerClassName = "",
  disableStepIndicators = false,
  renderStepIndicator,
  ...rest
}: IProps) => {
  console.log("raffleData", raffleData);
  const { user } = useAuth() as { user: IAuthUser | null };
  const { data: raffleDataById } = useRaffleDetailQueries({
    params: { raffleId },
    enabled: raffleData == undefined && open,
  });

  console.log("raffleData", raffleData);

  const {
    steps,
    currentStep,
    direction,
    setCurrentStep,
    setDirection,
    updateStep,
    handleBack,
    handleNext,
    totalSteps,
    isLastStep,
    isCompleted,
  } = useRaffleStepper({
    user,
    raffleId,
    raffleData: raffleData ?? (raffleDataById || null),
    open,
    onClose,
    onFinalStepCompleted,
    onStepChange,
    children,
  });

  console.log("open", open, raffleData, currentStep);

  if (!open) return null;
  if (!raffleData) return null;
  if (!currentStep) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-[rgba(0,0,0,0.4)] backdrop-blur-lg"
        aria-hidden="true"
      />
      <div
        className="flex min-h-[60vh] flex-1 flex-col items-center justify-center p-4 relative max-h-full overflow-hidden"
        {...rest}
      >
        <div
          className={`mx-auto w-full max-h-full rounded-xl shadow-xl bg-white overflow-hidden relative border border-gray-200 ${stepCircleContainerClassName}`}
          style={{
            maxWidth: "min(65vw, 750px)",
          }}
        >
          <div className="flex items-center gap-2 p-4">
            <RaffleBadge type={raffleData.raffleType} />
            <div className="text-[22px] font-semibold">
              {raffleData?.title || ""}
            </div>
          </div>
          <div
            className={`${stepContainerClassName} flex w-full items-center px-12 pt-4 pb-10`}
          >
            {steps.map((step, index) => {
              const stepNumber = index + 1;
              const stepName = step.props.name;
              const isNotLastStep = index < totalSteps - 1;
              const currentStepIndex = steps.findIndex(
                (s) => s.props.stepValue === currentStep.props.stepValue
              );
              return (
                <React.Fragment key={stepNumber}>
                  {renderStepIndicator ? (
                    renderStepIndicator({
                      step: stepNumber,
                      stepName: stepName,
                      currentStep: {
                        stepValue:
                          currentStep?.props.stepValue || "information",
                        name: currentStep?.props.name || "",
                      },
                      onStepClick: (clicked: IStep) => {
                        setDirection(
                          clicked.props.stepValue >
                            (currentStep?.props.stepValue || "information")
                            ? 1
                            : -1
                        );
                        updateStep(clicked);
                      },
                    })
                  ) : (
                    <StepIndicator
                      step={step}
                      currentStep={currentStep}
                      index={stepNumber}
                      steps={steps}
                    />
                  )}
                  {isNotLastStep && (
                    <StepConnector isComplete={index < currentStepIndex} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
          <hr className="w-full h-1 border-t-2 border-gray-400" />
          <StepContentWrapper
            isCompleted={isCompleted}
            currentStep={currentStep}
            direction={direction}
            className={`min-h-[65vh] h-full`}
          >
            {React.Children.map(currentStep.children, (child) => {
              return React.isValidElement(child)
                ? React.cloneElement(
                    child as React.ReactElement<StepComponentProps>,
                    {
                      user,
                      raffleData,
                      // isSubmitting,
                      isLastStep,
                      isCompleted,
                      currentStep,
                      steps,
                      handleNext,
                      handleBack,
                      updateStep,
                      setDirection,
                      setCurrentStep,
                    }
                  )
                : child;
            })}
          </StepContentWrapper>
          <StepperRaffleFooter
            steps={steps}
            currentStep={currentStep}
            isLastStep={isLastStep}
            handleBack={handleBack}
            handleNext={handleNext}
            raffleData={raffleData}
            handleClose={onClose}
          />
        </div>
      </div>
    </div>
  );
};

export default Stepper;
