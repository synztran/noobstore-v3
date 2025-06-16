import { ICart, ICartProduct } from "@/interface/Client/Cart";
import useCartQuery from "@/react-query/cart/api/useCartQueries";
import { useRemoveItemMutation } from "@/react-query/cart/api/useRemoveItemMutation";
import { formatCurrency } from "@/utils/FormatNumber";
import NotifyUtils from "@/utils/NotifyUtils";
import {
	Box,
	Button,
	CircularProgress,
	Divider,
	IconButton,
	Modal,
	Typography,
} from "@material-ui/core";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import InputQuantity from "../InputQuatity";
import { NEW_MISSING_IMAGE } from "@/constants/Images";
import { borderRadius } from "@material-ui/system";

interface Props {
	open: boolean;
	handleClose: () => void;
}

const modalStyle = {
	position: "absolute" as "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: "min(550px, 55vw)",
	bgcolor: "background.paper",
	boxShadow: 24,
	minHeight: "80vh",
	maxHeight: "90vh",
	display: "flex",
	flexDirection: "column",
	borderRadius: "0.5rem",
};

const ModalCartItem = ({ open, handleClose }: Props) => {
	const { data: cart } = useCartQuery();
	const router = useRouter();
	const handleRemoveProduct = useRemoveItemMutation();
	const [isRemoving, setRemoving] = useState(false);

	const handleRemoveItemCart = async (
		productId: string,
		productName: string
	) => {
		if (!cart?.cartId) return NotifyUtils.error("Giỏ hàng không tồn tại");
		setRemoving(true);
		handleRemoveProduct.mutate({
			payload: { cartId: cart?.cartId as string, productId, productName },
		});
		setRemoving(false);
	};

	const handleCheckout = () => {
		router.push("/checkout");
	};

	return (
		<Modal
			open={open}
			onClose={handleClose}
			aria-labelledby="modal-modal-title"
			aria-describedby="modal-modal-description">
			<Box sx={modalStyle}>
				<Box
					position="relative"
					display="flex"
					alignItems="center"
					justifyContent="space-between"
					padding="16px">
					<Typography
						id="modal-modal-title"
						variant="h6"
						component="h2">
						Giỏ hàng
					</Typography>
					<IconButton className="p-0.5" onClick={handleClose}>
						<CloseIcon />
					</IconButton>
				</Box>
				<Divider />
				<div
					className={`${
						cart?.products?.length === 0
							? "justify-center align-middle"
							: ""
					} px-4 py-2 flex flex-col gap-4 w-full min-h-full max-h-full flex-1 overflow-y-auto`}>
					{cart?.products?.length ? (
						cart?.products.map(
							(item: ICartProduct, index: number) => (
								<CartItem
									item={item}
									index={index}
									cart={cart}
									handleRemoveItemCart={handleRemoveItemCart}
									isRemoving={isRemoving}
									key={index}
								/>
							)
						)
					) : (
						<Box>
							<Typography variant="body1" className="text-center">
								Giỏ hàng trống
							</Typography>
						</Box>
					)}
				</div>
				{/* borderTop="1px solid #e9e9e9" */}
				<div className="w-full p-2 border-t border-gray-200">
					<span className="text-sm text-gray-600">
						<strong className="text-base">Phí và Giảm giá</strong>{" "}
						sẽ được tính toán ở bước tiếp theo
					</span>
					<br />
					<span className="text-sm  text-gray-600">
						Đơn hàng từ{" "}
						<strong className="text-base">
							{formatCurrency(3000000)}
						</strong>{" "}
						sẽ được miễn phí vận chuyện nội thành{" "}
						<strong className="text-base">Hồ Chí Mình</strong> từ
						shop
					</span>
				</div>
				<Button
					fullWidth
					className="p-4 bg-red-400 font-bold hover:bg-red-500 rounded-tr-none rounded-tl-none top-0.5"
					onClick={handleCheckout}>
					<span className="text-white">
						{" "}
						Thanh toán {formatCurrency(cart?.totalPrice || 0)}
					</span>
				</Button>
			</Box>
		</Modal>
	);
};

export default ModalCartItem;

const CartItem = ({
	item,
	isRemoving,
	handleRemoveItemCart,
	index,
	cart,
}: {
	item: ICartProduct;
	isRemoving: boolean;
	handleRemoveItemCart: (productId: string, productName: string) => void;
	index: number;
	cart: ICart;
}) => {
	return (
		<>
			<div
				key={item?.productId}
				className="grid grid-cols-12 gap-4 min-h-[115px]">
				{/* <Link href={item?.slug ? `/product/${item.slug}` : ""}> */}
				<div className="relative col-span-3 min-w-[120px] min-h-[115px]">
					<Image
						src={item?.thumbnail || NEW_MISSING_IMAGE}
						alt="product"
						className="hover:scale-105 transition-all duration-200 ease-in-out rounded-10"
						fill
						sizes="100vw"
						style={{
							objectFit: "cover",
						}}
					/>
				</div>
				{/* </Link> */}
				<div className="col-span-5 flex flex-col justify-between">
					{/* <Link href={item?.slug ? `/product/${item.slug}` : ""}> */}
					<Typography className="text-lg text-ellipsis overflow-hidden text-blue-500">
						{item.categoryName || ""}
					</Typography>
					{/* </Link> */}
					<Typography
						className="text-sm"
						style={{ color: "#656461" }}>
						<span className="text-base">{item.productName}:</span>{" "}
						<strong>
							{item.productOptions
								.map((option) => option.name)
								.join(", ")}
						</strong>
					</Typography>
					<Typography className="text-sm">
						{formatCurrency(
							item?.price +
								item?.productOptions.reduce(
									(acc, option) => acc + (option.price || 0),
									0
								)
						)}
					</Typography>
					<InputQuantity
						quantity={item?.quantity}
						productId={item?.productId}
						productOptionId={item?.productOptions?.[0]?.id || "123"}
					/>
				</div>
				<div className="col-span-4 relative w-full flex">
					<div className="absolute top-0 right-0">
						{isRemoving ? (
							<CircularProgress size={12} color="primary" />
						) : (
							<IconButton
								className="p-0.5"
								onClick={() =>
									handleRemoveItemCart(
										item.productId,
										item.productName
									)
								}>
								<DeleteOutlineOutlinedIcon className="text-red-400" />
							</IconButton>
						)}
					</div>
					<div className="ml-auto mt-auto text-sm flex flex-col">
						<span className="ml-auto">Tạm tính</span>
						<strong className="text-lg text-right">
							{formatCurrency(item?.totalPrice)}
						</strong>
					</div>
				</div>
			</div>
			{index !== cart.products.length - 1 ? (
				<Divider className="" />
			) : null}
		</>
	);
};
