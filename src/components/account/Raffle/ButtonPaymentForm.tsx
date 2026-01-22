import { Button } from "@/components/ReUIComponent";
import { memo } from "react";

interface ButtonSubmitPaymentProps {
	isLoading?: boolean;
	handleClick: () => void;
	isDisabled?: boolean;
}

interface ButtonCancelOrderProps {
	isLoading?: boolean;
	handleClick: () => void;
	isDisabled?: boolean;
}

export const ButtonSubmitPayment = memo(
	({
		isLoading = false,
		handleClick,
		isDisabled = false,
	}: ButtonSubmitPaymentProps) => {
		return (
			<Button
				size={"sm"}
				type="button"
				variant="primary"
				onClick={handleClick}
				disabled={isDisabled || isLoading}>
				Xác nhận thanh toán
			</Button>
		);
	},
);

export const ButtonCancelOrder = memo(
	({
		isLoading = false,
		handleClick,
		isDisabled = false,
	}: ButtonCancelOrderProps) => {
		return (
			<Button
				size={"sm"}
				type="button"
				variant={"destructive"}
				onClick={handleClick}
				disabled={isDisabled || isLoading}>
				Hủy đơn hàng
			</Button>
		);
	},
);
