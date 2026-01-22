import { Button } from "@/components/ReUIComponent/Button";
import { useAuth } from "@/context/Auth";
import { IAuthUser } from "@/interface/Context/auth";
import { useCartQuantityMutation } from "@/react-query/cart/api/useCartQuantityMutation";
import useCartQuery from "@/react-query/cart/api/useCartQueries";
import { classNames } from "@/utils/AppConfig";
import debounce300 from "@/utils/debounce";
import NotifyUtils from "@/utils/NotifyUtils";
import { useStoreProductDetailAction } from "@/zustand/useProductDetail";
import { Input } from "@mui/material";
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
	const { data: cart } = useCartQuery();
	const { mutate: updateQuantityMutation, isPending } =
		useCartQuantityMutation();

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
			const newQuantity = currentQuantity - 1;
			setCurrentQuantity(newQuantity);
			updateQuantityMutation({
				productId,
				quantity: newQuantity,
				cartId: user?.cartId,
				productOptionId: productOptionId || "",
			});
		}
	};

	const handleIncreaseQuantity = async (e: React.MouseEvent<HTMLElement>) => {
		e.stopPropagation();
		setCurrentQuantity(currentQuantity + 1);
		updateQuantity(currentQuantity + 1);
	};

	const handleIncreaseQuantityCart = useCallback(async () => {
		if (productId) {
			const newQuantity = (quantity as number) + 1;
			setCurrentQuantity(newQuantity);
			updateQuantityMutation({
				productId,
				quantity: newQuantity,
				cartId: user?.cartId,
				productOptionId: productOptionId || "",
			});
		}
	}, [
		quantity,
		productId,
		user?.cartId,
		productOptionId,
		updateQuantityMutation,
	]);

	const debouncedIncreaseQuantityCart = useCallback(
		debounce300(handleIncreaseQuantityCart, 300),
		[handleIncreaseQuantityCart],
	);
	const debounceDecreaseQuantityCart = useCallback(
		debounce300(handleDecreaseQuantityCart, 300),
		[handleDecreaseQuantityCart],
	);

	const handleOnChange = async (
		quantity: number,
		notValidCallback?: () => void,
	) => {
		if (quantity <= 0) return;
		if (!quantity) return;
		if (maxQuantity && quantity > maxQuantity) {
			NotifyUtils.error(
				"Số lượng sản phẩm không được lớn hơn số lượng tồn kho",
			);
			if (notValidCallback) notValidCallback();
			return;
		}
		setCurrentQuantity(quantity);
		updateQuantity(quantity);

		if (productId) {
			updateQuantityMutation({
				productId,
				quantity: quantity,
				cartId: user?.cartId,
				productOptionId: productOptionId || "",
			});
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
				className ?? "",
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
			className="w-6 min-w-[2.5rem] !h-[40px] rounded-tr-none rounded-br-none"
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
		handleOnChange: (
			quantity: number,
			notValidCallback?: () => void,
		) => void;
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

		const rollbackQuantity = () => {
			setTempQuantity(quantity);
		};

		const handleBlur = () => {
			if (tempQuantity === quantity) return;
			if (tempQuantity === 0) {
				// TODO: have modal request delete product outof cart
				setTempQuantity(1);
				if (tempQuantity !== quantity) {
					handleOnChange(1);
				}
			} else {
				handleOnChange(tempQuantity, rollbackQuantity);
			}
		};

		return (
			<Input
				type="text"
				classes={{
					root: "w-12 bg-transparent !h-[40px] !min-h-[40px]",
					input: "px-0 text-center bg-transparent leading-none py-0",
					focused: "!border-gray-400",
				}}
				disableUnderline
				placeholder="0"
				value={tempQuantity}
				onChange={handleChange}
				onBlur={handleBlur}
				id="input-quantity"
				name="quantity"
				inputProps={{ min: 1, max: 99 }}
			/>
		);
	},
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
