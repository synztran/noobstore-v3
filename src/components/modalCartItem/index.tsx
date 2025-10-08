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
import InputQuantity from "../InputQuatity";
import {
	GIF_SHOPPING_CART,
	NEW_MISSING_IMAGE,
	QUICK_ACCESS_KEYCAPS_ICON,
	QUICK_ACCESS_LUBRICANT_ICON,
	SERVICE_KEYBOARD_ICON,
	SERVICE_NEW_SWITCH_ICON,
} from "@/constants/Images";
import { useState } from "react";
import { MoveUpRight } from "lucide-react";

interface Props {
	open: boolean;
	handleClose: () => void;
}

const modalStyle = {
	position: "absolute" as "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: "min(600px, 55vw)",
	bgcolor: "background.paper",
	boxShadow: 24,
	minHeight: "80vh",
	maxHeight: "90vh",
	display: "flex",
	flexDirection: "column",
	borderRadius: "0.5rem",
};

const quickAccess = [
	{
		icon: SERVICE_KEYBOARD_ICON,
		title: "Bàn phím",
		url: "/products/keyboards",
	},
	{
		icon: SERVICE_NEW_SWITCH_ICON,
		title: "Switches",
		url: "/products/switches",
	},
	{
		icon: QUICK_ACCESS_KEYCAPS_ICON,
		title: "Keycaps",
		url: "/products/keycaps",
	},
	{
		icon: QUICK_ACCESS_LUBRICANT_ICON,
		title: "Dầu lube",
		url: "/products/lubricant",
	},
];

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
					} p-4 flex flex-col gap-4 w-full min-h-full max-h-full flex-1 overflow-y-auto`}>
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
						<div className="relative flex flex-col items-center justify-center gap-4">
							<Image
								src={GIF_SHOPPING_CART}
								alt="gif sc"
								width={150}
								height={50}
							/>
							<Typography variant="body1" className="text-center">
								Chưa có sản phẩm thêm vào giỏ!
								<br />
								<span className="text-sm text-gray-600">
									Đã đến lúc tìm và thêm sản phẩm vào giỏ hàng
									ngay
								</span>
							</Typography>
							<div className="flex flex-col gap-2 w-full max-w-[60%]">
								{quickAccess.map((item) => (
									<Link
										key={item.title}
										href={item.url}
										className="flex items-center justify-between gap-2 rounded-lg border border-gray-300 p-2 w-full hover:bg-gray-100 hover:scale-105 transition-all duration-200 ease-in-out">
										<div className="flex items-center gap-2">
											<Image
												src={item.icon}
												alt={item.title}
												width={40}
												height={40}
												className="bg-gray-400 rounded-full"
											/>
											<strong>{item.title}</strong>
										</div>
										<button className="border border-gray-300 rounded-full p-1">
											<MoveUpRight className="w-5 h-5" />
										</button>
									</Link>
								))}
							</div>
						</div>
					)}
				</div>
				{cart?.products?.length ? (
					<div className="w-full p-2 border-t border-gray-200">
						<span className="text-sm text-gray-600">
							<strong className="text-base">
								Phí và Giảm giá
							</strong>{" "}
							sẽ được tính toán ở bước tiếp theo
						</span>
						<br />
						<span className="text-sm  text-gray-600">
							Đơn hàng từ{" "}
							<strong className="text-base">
								{formatCurrency(3000000)}
							</strong>{" "}
							sẽ được miễn phí vận chuyện nội thành{" "}
							<strong className="text-base">Hồ Chí Mình</strong>{" "}
							từ shop
						</span>
					</div>
				) : null}
				{cart?.products?.length ? (
					<Button
						fullWidth
						className="p-4 bg-red-400 font-bold hover:bg-red-500 rounded-tr-none rounded-tl-none top-0.5"
						onClick={handleCheckout}>
						<span className="text-white">
							{" "}
							Thanh toán {formatCurrency(cart?.totalPrice || 0)}
						</span>
					</Button>
				) : null}
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
	if (!item?.productOptions?.length) return;
	return (
		<div key={item?.productId}>
			{item?.productOptions?.map((opt) => (
				<>
					<div
						key={opt.productOptionId}
						className="grid grid-cols-12 gap-4 min-h-[115px]">
						<div className="relative col-span-3 min-w-[120px] min-h-[115px] border border-gray-200 rounded-10">
							<Image
								src={opt?.thumbnail?.path || NEW_MISSING_IMAGE}
								alt={opt?.thumbnail?.alt || "product"}
								className="hover:scale-105 transition-all duration-200 ease-in-out rounded-10 object-cover"
								fill
								sizes="100vw"
							/>
						</div>
						<div className="col-span-5 flex flex-col justify-between">
							<Typography className="text-lg text-ellipsis overflow-hidden text-blue-500 font-bold">
								{item.categoryName || ""}
							</Typography>
							<Typography
								className="text-sm"
								style={{ color: "#656461" }}>
								{item.productName}:&nbsp;
								<strong>{opt.name || ""}</strong>
							</Typography>
							<Typography>
								{formatCurrency(
									item?.price +
										item?.productOptions.reduce(
											(acc, option) =>
												acc + (option.price || 0),
											0
										)
								)}
							</Typography>
							<InputQuantity
								quantity={item?.quantity}
								productId={item?.productId}
								productOptionId={
									item?.productOptions?.[0]
										?.productOptionId || ""
								}
							/>
						</div>
						<div className="col-span-4 relative w-full flex">
							<div className="absolute top-0 right-0">
								{isRemoving ? (
									<CircularProgress
										size={12}
										color="primary"
									/>
								) : (
									<IconButton
										className="p-0.5"
										onClick={() =>
											handleRemoveItemCart(
												item.productId,
												item.productName
											)
										}>
										<DeleteOutlineOutlinedIcon className="fill-red-400" />
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
			))}
		</div>
	);
};
