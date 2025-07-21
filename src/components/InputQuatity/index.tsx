import { ERROR_MESSAGES } from "@/constants/Errors";
import { useAuth } from "@/context/Auth";
import { IAuthUser } from "@/interface/Context/auth";
import useCartQuery from "@/react-query/cart/api/useCartQueries";
import { appQueryKeys } from "@/react-query/root";
import { classNames } from "@/utils/AppConfig";
import debounce300 from "@/utils/debounce";
import NotifyUtils from "@/utils/NotifyUtils";
import { useCartAction } from "@/zustand/useCart";
import { useStoreProductDetailAction } from "@/zustand/useProductDetail";
import { Button, Input } from "@material-ui/core";
import { useQueryClient } from "@tanstack/react-query";
import { memo, useCallback, useEffect, useMemo, useState } from "react";

interface Props {
	triggerResetQuantity?: number;
	quantity?: number;
	productId?: string;
	className?: string;
	maxQuantity?: number;
	productOptionId?: string;
}

const InputQuantity = ({
	triggerResetQuantity,
	quantity,
	productId,
	className,
	maxQuantity,
	productOptionId,
}: Props) => {
	const { updateQuantity } = useStoreProductDetailAction();
	const [currentQuantity, setCurrentQuantity] = useState(quantity || 1);
	const { updateProductCartQuantity } = useCartAction();
	const { data: cart } = useCartQuery();

	const queryClient = useQueryClient();
	const { user } = useAuth() as unknown as { user: IAuthUser };

	const isDisabledPlus = useMemo(() => {
		if (maxQuantity && currentQuantity >= maxQuantity) return true;
		return false;
	}, [maxQuantity, currentQuantity]);

	const handleDecreaseQuantity = async (e: React.MouseEvent<HTMLElement>) => {
		e.stopPropagation();
		if (currentQuantity <= 1) return;
		setCurrentQuantity(currentQuantity - 1);
		updateQuantity(currentQuantity - 1);
	};

	const handleDecreaseQuantityCart = async () => {
		if (currentQuantity <= 1) return;
		if (productId) {
			const respUpdateQuantity = await updateProductCartQuantity({
				productId,
				quantity: (quantity as number) - 1,
				cartId: user?.cartId,
				productOptionId: productOptionId || "",
			});
			if (respUpdateQuantity?.status === "OK") {
				setCurrentQuantity(currentQuantity - 1);
				queryClient.invalidateQueries(appQueryKeys.cart.cartData);
				NotifyUtils.success("Cập nhật số lượng thành công");
			} else {
				NotifyUtils.error("Có lỗi xảy ra. Vui lòng thử lại");
			}
		}
	};

	const handleIncreaseQuantity = async (e: React.MouseEvent<HTMLElement>) => {
		e.stopPropagation();
		setCurrentQuantity(currentQuantity + 1);
		updateQuantity(currentQuantity + 1);
	};

	const handleIncreaseQuantityCart = useCallback(async () => {
		if (productId) {
			const respUpdateQuantity = await updateProductCartQuantity({
				productId,
				quantity: (quantity as number) + 1,
				cartId: user?.cartId,
				productOptionId: productOptionId || "",
			});
			if (respUpdateQuantity?.status === "OK") {
				setCurrentQuantity(quantity as number);
				queryClient.invalidateQueries(appQueryKeys.cart.cartData);
				NotifyUtils.success("Cập nhật số lượng thành công");
			} else {
				const mappingErrorMessage =
					ERROR_MESSAGES[respUpdateQuantity?.errorCode as string];
				NotifyUtils.error(
					mappingErrorMessage || respUpdateQuantity?.message
				);
			}
		}
	}, [quantity, productId]);

	const debouncedIncreaseQuantityCart = useCallback(
		debounce300(handleIncreaseQuantityCart, 300),
		[handleIncreaseQuantityCart]
	);
	const debounceDecreaseQuantityCart = useCallback(
		debounce300(handleDecreaseQuantityCart, 300),
		[handleDecreaseQuantityCart]
	);

	const handleOnChange = async (quantity: number) => {
		if (quantity <= 0) return;
		if (!quantity) return;
		setCurrentQuantity(quantity);
		updateQuantity(quantity);

		if (productId) {
			const respUpdateQuantity = await updateProductCartQuantity({
				productId,
				quantity: quantity,
				cartId: user?.cartId,
				productOptionId: productOptionId || "",
			});
			if (respUpdateQuantity?.status === "OK") {
				setCurrentQuantity(quantity as number);
				queryClient.invalidateQueries(appQueryKeys.cart.cartData);
				NotifyUtils.success("Cập nhật số lượng thành công");
			} else {
				const mappingErrorMessage =
					ERROR_MESSAGES[respUpdateQuantity?.errorCode as string];
				NotifyUtils.error(
					mappingErrorMessage || respUpdateQuantity?.message
				);
			}
		}
	};

	useEffect(() => {
		setCurrentQuantity(1);
		updateQuantity(1);
	}, [triggerResetQuantity]);

	useEffect(() => {
		if (quantity) setCurrentQuantity(quantity);
	}, [quantity, cart]);

	return (
		<div
			className={classNames(
				"flex align-middle items-centers border border-gray-400 rounded-md max-w-max",
				className ?? ""
			)}>
			<MinusButton
				handleDecreaseQuantity={(e) => {
					productId
						? debounceDecreaseQuantityCart()
						: handleDecreaseQuantity(e);
				}}
				isDisabled={currentQuantity === 1}
			/>
			<ProductQuantity
				quantity={currentQuantity}
				handleOnChange={handleOnChange}
			/>
			<AddMoreButton
				handleIncreaseQuantity={(e) => {
					productId
						? debouncedIncreaseQuantityCart()
						: handleIncreaseQuantity(e);
				}}
				isDisabled={currentQuantity >= 99 || isDisabledPlus}
			/>
		</div>
	);
};

export default InputQuantity;

const MinusButton = ({
	handleDecreaseQuantity,
	isDisabled = false,
}: {
	handleDecreaseQuantity: (e: React.MouseEvent<HTMLElement>) => void;
	isDisabled: boolean;
}) => {
	return (
		<Button
			className="w-6 min-w-[2.5rem] !min-h-[40px] rounded-tr-none rounded-br-none"
			onClick={handleDecreaseQuantity}
			disabled={isDisabled}>
			-
		</Button>
	);
};

const ProductQuantity = memo(
	({
		quantity,
		handleOnChange,
	}: {
		quantity: number;
		handleOnChange: (quantity: number) => void;
	}) => {
		const [tempQuantity, setTempQuantity] = useState(quantity);

		useEffect(() => {
			setTempQuantity(quantity);
		}, [quantity]);

		const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			const value = e.target.value;
			if (value === "") {
				setTempQuantity(0);
				return;
			}
			const numValue = parseInt(value);
			if (!isNaN(numValue)) {
				setTempQuantity(numValue);
			}
		};

		const handleBlur = () => {
			if (tempQuantity === quantity) return;
			if (tempQuantity === 0) {
				setTempQuantity(1);
				if (tempQuantity !== quantity) {
					handleOnChange(1);
				}
			} else {
				handleOnChange(tempQuantity);
			}
		};

		return (
			<Input
				type="text"
				classes={{
					root: "w-12 bg-transparent !h-[40px]",
					input: "px-0 text-center bg-transparent",
					focused: "!border-gray-400",
				}}
				disableUnderline
				placeholder="0"
				value={tempQuantity}
				onChange={handleChange}
				onBlur={handleBlur}
			/>
		);
	}
);

const AddMoreButton = ({
	handleIncreaseQuantity,
	isDisabled = false,
}: {
	handleIncreaseQuantity: (e: React.MouseEvent<HTMLElement>) => void;
	isDisabled: boolean;
}) => {
	return (
		<Button
			className="w-8 !min-w-[2.5rem] !h-[40px] rounded-tl-none rounded-bl-none"
			onClick={handleIncreaseQuantity}
			disabled={isDisabled}>
			+
		</Button>
	);
};
