import { ERROR_MESSAGES } from "@/constants/Errors";
import { useAuth } from "@/context/Auth";
import { IStep } from "@/hook/useRaffleStepper";
import { IResponse } from "@/interface/Client/interface";
import {
	IBEResponseRaffleInfo,
	IRequestRaffleJoin,
} from "@/interface/Client/Raffle";
import { IAuthUser } from "@/interface/Context/auth";
import { useRaffleJoinMutation } from "@/react-query/raffles/api/useRaffleJoinMutation";
import NotifyUtils from "@/utils/NotifyUtils";
import useRaffle from "@/zustand/useRaffle";
import { CircularProgress } from "@mui/material";
import { Button } from "@/components/ReUIComponent/Button";
import React, { useState } from "react";

interface IButtonProps {
	attributes?: React.ButtonHTMLAttributes<HTMLButtonElement>;
	style?: React.CSSProperties;
	text?: string;
}

interface IProps {
	// step state
	steps: IStep[];
	currentStep: IStep;
	isLastStep: boolean;
	handleBack: () => void;
	handleNext: () => void;
	// data
	raffleData: IBEResponseRaffleInfo;
	handleClose: () => void;
	// comp attr
	backButtonProps?: IButtonProps;
	nextButtonProps?: IButtonProps;
	footerProperties?: {
		classNames?: string;
	};
	// condition
}

const StepperRaffleFooter = ({
	// step state
	steps,
	currentStep,
	isLastStep,
	handleBack,
	handleNext,
	// data
	raffleData,
	handleClose,
	// comp att
	backButtonProps = {},
	nextButtonProps = {},
	footerProperties = {},
}: IProps) => {
	const { user } = useAuth() as { user: IAuthUser };
	const { raffleSubmitForm, isRaffleLoading, isScrollToBottom } = useRaffle();
	const postSubmitRaffle = useRaffleJoinMutation();
	const { mutateAsync, isPending: isSubmitting } = postSubmitRaffle;
	const [isRaffleEnded, setRaffleEnded] = useState(false);

	const handleSubmitRaffle = async () => {
		const payload: IRequestRaffleJoin = {
			customerId: user?.customerId || null,
			raffleId: raffleSubmitForm?.raffleId || "",
			raffleItemSelections:
				raffleSubmitForm?.productSelections?.filter(
					(option) => option.selected,
				) || [],
			secretKey: raffleSubmitForm?.secretKey || "",
			email: raffleSubmitForm?.email || user?.email || "",
			name:
				raffleSubmitForm?.name ||
				user?.firstName + " " + user?.lastName ||
				"",
			phone: raffleSubmitForm?.phone || user?.phoneNumber || "",
			shipping:
				raffleSubmitForm?.shipping as IRequestRaffleJoin["shipping"],
			note: raffleSubmitForm?.note || "",
		};

		const isAtLeastOneProductSelected =
			payload.raffleItemSelections &&
			payload.raffleItemSelections.length > 0 &&
			payload.raffleItemSelections.some((p) => p.selected);

		if (!isAtLeastOneProductSelected) {
			NotifyUtils.error(
				"Vui lòng chọn ít nhất một sản phẩm để tham gia raffle.",
			);
			handleBack();
			return;
		}

		const resp: IResponse<unknown> = await mutateAsync({
			payload,
		});

		if (resp.status === "OK") {
			handleNext();
		} else {
			NotifyUtils.error(
				ERROR_MESSAGES[resp.errorCode || ""] || resp.message,
			);
			if (resp.errorCode === "RAFFLE_ENDED") {
				setRaffleEnded(true);
			}
		}
	};

	const renderBackButton = () => {
		if (currentStep?.props.stepValue === steps[0]?.props.stepValue) {
			return (
				<Button
					variant="outline"
					type="button"
					onClick={handleClose}
					className="duration-350 rounded px-1 py-0.5 transition text-neutral-700 hover:bg-gray-400 min-w-[6rem] bg-gray-300 font-bold text-lg"
					disabled={isSubmitting || isRaffleLoading}
					// {...backButtonProps.attributes}
					style={{
						display: isLastStep ? "none" : undefined,
						...backButtonProps?.style,
					}}>
					Đóng
				</Button>
			);
		}

		return (
			<Button
				variant="outline"
				onClick={() => {
					if (isRaffleEnded) {
						handleClose();
					} else {
						handleBack();
					}
				}}
				className="duration-350 rounded px-1 py-0.5 transition text-neutral-700 hover:bg-gray-400 min-w-[6rem] bg-gray-300 font-bold text-lg"
				{...backButtonProps}
				disabled={isSubmitting || isRaffleLoading}
				style={{
					display: isLastStep ? "none" : undefined,
					...backButtonProps?.style,
				}}>
				{isRaffleEnded ? "Đóng" : backButtonProps.text || "Quay lại"}
			</Button>
		);
	};

	const renderNextButton = () => {
		let nextDisabled = false;
		const isSubmitStep = currentStep?.props.stepValue === "shippingInfo";
		const isSelectionStep =
			currentStep?.props.stepValue === "productSelection";
		const isSecretKeyStep = currentStep?.props.stepValue === "secretKey";
		const isInformationStep =
			currentStep?.props.stepValue === "information";
		const isSelectedProduct =
			raffleSubmitForm?.productSelections &&
			raffleSubmitForm.productSelections
				.map((item: any) => item.selected)
				.filter(Boolean).length > 0;

		if (isSelectionStep && !isSelectedProduct) {
			nextDisabled = true;
		}

		if (isRaffleLoading) nextDisabled = true;

		if (isInformationStep && !isScrollToBottom) {
			nextDisabled = true;
		}

		if (
			isSecretKeyStep &&
			raffleData?.isHaveSecretKey &&
			!raffleSubmitForm?.secretKey
		) {
			return null;
		}

		if (isRaffleEnded) {
			return null;
		}

		// Shipping validation for final submit
		const shippingMissing =
			!raffleSubmitForm?.shipping?.address ||
			!raffleSubmitForm?.shipping?.city ||
			!raffleSubmitForm?.shipping?.shippingMethod?.name;

		if (isSubmitStep) {
			return (
				<Button
					variant="default"
					onClick={handleSubmitRaffle.bind(null, raffleSubmitForm)}
					className={`duration-350 flex items-center justify-center rounded-lg bg-[var(--primary-color)] py-1.5 px-3.5 tracking-tight text-white transition hover:bg-red-600 active:bg-red-700 ml-auto text-lg font-bold ${
						isSubmitting
							? "opacity-50 cursor-not-allowed pointer-events-none bg-gray-400"
							: ""
					}`}
					{...nextButtonProps}
					disabled={
						isSubmitting ||
						raffleSubmitForm?.productSelections?.length === 0 ||
						shippingMissing
					}>
					{isSubmitting ? (
						<CircularProgress size={22} />
					) : (
						"Hoàn tất đăng ký"
					)}
				</Button>
			);
		}

		return (
			<Button
				variant="default"
				onClick={handleNext}
				className={`duration-350 flex items-center justify-center rounded-lg bg-[var(--primary-color)] py-1.5 px-3.5 font-bold tracking-tight text-white transition hover:bg-red-600 active:bg-red-700 ml-auto text-lg  ${
					nextDisabled
						? "opacity-50 bg-gray-400 cursor-not-allowed pointer-events-none"
						: ""
				}`}
				{...nextButtonProps}
				disabled={nextDisabled}>
				{isLastStep ? "Hoàn tất" : nextButtonProps.text || "Tiếp theo"}
			</Button>
		);
	};
	return (
		<div
			className={`p-4 block bottom-0 w-full bg-white border-t-2 border-gray-300 ${
				footerProperties.classNames || ""
			}`}>
			<div className="flex justify-between">
				{renderBackButton()}
				{renderNextButton()}
			</div>
		</div>
	);
};
export default React.memo(StepperRaffleFooter);
