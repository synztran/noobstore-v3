import InputQuantity from "@/components/InputQuatity";
import { ICart } from "@/interface/Client/Cart";
import useCartQuery from "@/react-query/cart/api/useCartQueries";
import { appQueryKeys } from "@/react-query/root";
import { classNames } from "@/utils/AppConfig";
import { formatCurrency } from "@/utils/FormatNumber";
import { useCartAction } from "@/zustand/useCart";
import {
	Box,
	Button,
	CircularProgress,
	Grid,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from "@material-ui/core";
import CheckIcon from "@mui/icons-material/Check";
import SubdirectoryArrowLeftIcon from "@mui/icons-material/SubdirectoryArrowLeft";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { Base } from "templates/Base";
import styles from "./styles.module.css";
import { IOrderProduct } from "@/interface/Client/Order";
import { NEW_MISSING_IMAGE } from "@/constants/Images";

export async function getServerSideProps(ctx: any) {
	return {
		props: {}, // will be passed to the page component as props
	};
}

const CartPage = (props: unknown) => {
	const router = useRouter();
	const { data: cart, isPending } = useCartQuery();
	const { products } = cart || {};
	return (
		<Base>
			<div className="mx-w-full p-6 sm:py-6 lg:px-8 relative z-1">
				{/* <Breadcumb
					mainRoot={BreadcumbTitle["cart"]}
				/> */}
				{isPending ? (
					<div className="flex justify-center items-center h-96 text-red-">
						<CircularProgress size={40} color="primary" />
					</div>
				) : (
					<article className={classNames(`mt-4 h-full gap-4`)}>
						{products ? (
							<div>
								<div className="text-2xl">Giỏ hàng</div>
								<TableCart {...cart} />
							</div>
						) : (
							<div className="text-center">
								<div className="text-lg">
									Không có sản phẩm nào trong giỏ hàng
								</div>
								<Button
									onClick={() => router.push("/shop")}
									className="bg-red-500 px-24 py-4 mt-4 rounded-none hover:bg-red-500 hover:opacity-80">
									<span className="text-white">
										Tiếp tục mua hàng
									</span>
								</Button>
							</div>
						)}
						{products ? (
							<Grid
								container
								spacing={2}
								style={{ marginTop: 20 }}>
								<EstimateShipping />
								<SummaryCart {...cart} />
							</Grid>
						) : null}
					</article>
				)}
			</div>
		</Base>
	);
};

export default CartPage;

interface Column {
	id: "price" | "quantity" | "total" | "density";
	label: string;
	minWidth?: number;
	align?: "right" | "center" | "left";
	format?: (value: number) => string;
}

const TableCart = (data: ICart) => {
	const router = useRouter();
	const [isRemoving, setRemoving] = useState(false);
	const { removeItemCart } = useCartAction();
	const queryClient = useQueryClient();

	const columns: readonly Column[] = [
		{ id: "price", label: "\u00a0Giá", minWidth: 100, align: "right" },
		{
			id: "quantity",
			label: "Số lượng",
			minWidth: 170,
			align: "center",
			format: (value: number) => value.toLocaleString("en-US"),
		},
		{
			id: "total",
			label: "Tổng tiền",
			minWidth: 170,
			align: "right",
			format: (value: number) => value.toLocaleString("en-US"),
		},
	];

	const handleDelete = (productId: string) => {
		setRemoving(true);
		removeItemCart({
			cartId: data?.cartId,
			productId,
		});
		// cartQuery.refetch()
		queryClient.invalidateQueries(appQueryKeys.cart.cartData);
		setRemoving(false);
	};

	return (
		<Paper style={{ width: "100%", overflow: "hidden", boxShadow: "none" }}>
			<TableContainer>
				<Table
					stickyHeader
					aria-label="sticky table"
					style={{ backgroundColor: "#f7fafc" }}>
					<TableHead>
						<TableRow>
							<TableCell style={{ backgroundColor: "#f7fafc" }}>
								<Button onClick={() => router.push("/shop")}>
									<SubdirectoryArrowLeftIcon />
									&nbsp;&nbsp;
									<span className="text-black font-bold text-sm">
										Tiếp tục mua hàng
									</span>
								</Button>
							</TableCell>
							{columns.map((column) => (
								<TableCell
									key={column.id}
									align={column.align}
									style={{
										minWidth: column.minWidth,
										backgroundColor: "#f7fafc",
									}}
									className="font-bold text-black text-md">
									{column.label}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{data?.products.map((product: IOrderProduct) => {
							return (
								<TableRow
									hover
									role="checkbox"
									tabIndex={-1}
									key={product.productId}
									classes={{
										root: "hover:!bg-transparent",
									}}>
									<TableCell
										key={product.productId}
										align="left">
										<Box display="flex" gridGap={8}>
											<Box
												position="relative"
												width={90}
												height={90}>
												<Image
													src={
														product?.thumbnail ||
														NEW_MISSING_IMAGE
													}
													alt="product image"
													className="object-cover"
													fill
													sizes="100vw"
												/>
											</Box>
											<Box
												display="flex"
												flexDirection="column"
												gridGap={4}>
												<span className="text-sm font-bold">
													{product?.categoryName}
												</span>
												<span
													style={{
														color: "#656461",
														fontSize: 12,
													}}>
													{product?.productName} -{" "}
													{product?.productOptions?.map(
														(option) => option.name
													)}
												</span>
												<Button
													style={{
														backgroundColor:
															"#e9e9e9",
														maxWidth: "max-content",
														padding: 0,
														lineHeight: 2,
													}}
													onClick={() =>
														handleDelete(
															product?.productId
														)
													}>
													{isRemoving ? (
														<CircularProgress
															size={12}
															color="primary"
														/>
													) : (
														<span
															style={{
																textTransform:
																	"uppercase",
																fontWeight: 700,
																fontSize: 14,
																letterSpacing: 1,
															}}>
															Xoá
														</span>
													)}
												</Button>
											</Box>
										</Box>
									</TableCell>
									<TableCell
										key={product.productId}
										align="right">
										<span
											className="text-sm"
											style={{ color: "#656461" }}>
											{formatCurrency(
												product?.price ||
													0 +
														product?.productOptions?.reduce(
															(acc, option) =>
																acc +
																(option.price ||
																	0),
															0
														)
											)}
										</span>
									</TableCell>
									<TableCell
										key={product.productId}
										align="center">
										<div className="flex justify-center align-middle">
											<InputQuantity
												quantity={product?.quantity}
												productId={product?.productId}
												className="!mt-0"
											/>
										</div>
									</TableCell>
									<TableCell
										key={product.productId}
										align="right">
										<span
											className="text-sm"
											style={{ color: "#656461" }}>
											{formatCurrency(
												product?.totalPrice || 0
											)}
										</span>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</TableContainer>
		</Paper>
	);
};

const SplitBlock = () => {
	return (
		<Grid container spacing={2} style={{ marginTop: 20 }}>
			<Grid item md={6}></Grid>
			{/* <SummaryCart /> */}
		</Grid>
	);
};

const EstimateShipping = () => {
	return (
		<Grid item md={6}>
			{/*  */}
		</Grid>
	);
};

const SummaryCart = (cart: ICart) => {
	const router = useRouter();
	return (
		<Grid item md={6} className="text-right">
			<Box
				display="flex"
				gridGap={6}
				justifyContent="flex-end"
				alignItems="center">
				{cart?.totalPrice > 2000000 ? (
					<span className="text-xs" style={{ color: "#242320" }}>
						Chúc mừng! Đơn hàng của bạn đủ điều kiện được miễn phí
						vận chuyển nội địa
					</span>
				) : (
					<span className="text-xs">
						Bạn cần mua thêm{" "}
						<strong
							className="text-xs"
							style={{ color: "rgb(248 113 113)" }}>
							{formatCurrency(2000000 - cart?.totalPrice)}
						</strong>{" "}
						để được miễn phí vận chuyển (chỉ áp dụng cho đơn hàng
						nội thành HCM)
					</span>
				)}
				{cart?.totalPrice > 2000000 ? (
					<CheckIcon
						style={{ width: 20, height: 20, fill: "green" }}
					/>
				) : (
					<Box sx={{ position: "relative" }}>
						<CircularProgress
							size={20}
							variant="determinate"
							value={
								(cart?.totalPrice / 2000000) * 100 > 100
									? 100
									: (cart?.totalPrice / 2000000) * 100
							}
							thickness={4}
							style={{ transform: "scaleX(-1) rotate(-90deg)" }}
							className="inline-block relative z-1"
							classes={{
								circle: styles.mainProgress,
							}}
						/>
						<CircularProgress
							size={20}
							variant="determinate"
							value={100}
							thickness={4}
							classes={{ circle: styles.tempProgress }}
							className="absolute z-0 left-0"
						/>
					</Box>
				)}
			</Box>
			<Box>
				<span
					className="uppercase tracking-widest text-sm font-semibold"
					style={{ color: "#242320" }}>
					Tạm tính
				</span>
				&nbsp;&nbsp;
				<span
					className="text-lg font-bold"
					style={{ color: "#242320" }}>
					{formatCurrency(cart?.totalPrice)}
				</span>
			</Box>
			<div className="text-sm text-right" style={{ color: "#656461" }}>
				Vận chuyển và thuế được tính ở bước thanh toán
			</div>
			<Button
				className="bg-red-500 px-24 py-4 mt-4 rounded-none hover:bg-red-500 hover:opacity-80"
				onClick={() => router.push("/checkout")}>
				<span className="text-white">Thanh toán</span>
			</Button>
		</Grid>
	);
};
