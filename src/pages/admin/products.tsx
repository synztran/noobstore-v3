import NewProduct from "@/adminComponents/Form/Product/newProduct";
import ProductsClient from "@/client/ProductsClient";
import { HTTP_STATUS } from "@/constants/Enums/https";
import {
	EnumProductType,
	EnumSaleStatus,
	IProduct,
} from "@/interface/interface";
import Admin from "@/layoutAdmin/Admin";
import { useDeleteProductMutation } from "@/react-query/products/api/useDeleteProductMutation";
import useProductOptionsQuery from "@/react-query/products/api/useProductOptionsQueries";
import useProductsQuery from "@/react-query/products/api/useProductsQueries";
import NotifyUtils from "@/utils/NotifyUtils";
import {
	Button,
	IconButton,
	Paper,
	Switch,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from "@mui/material";
import { useFormik } from "formik";
import { Ban, Check, Edit } from "lucide-react";
import React, { useState } from "react";
import * as yup from "yup";

const tableColumns: {
	id: string;
	label: string;
	styles?: React.CSSProperties;
}[] = [
	{
		id: "categoryId",
		label: "#",
	},
	{
		id: "productName",
		label: "Tên sản phẩm",
	},
	{
		id: "optionProducts",
		label: "Sản phẩm con",
	},
	{
		id: "isActive",
		label: "Hiện thị - Trạng thái",
	},
	// {
	// 	id: "price",
	// 	label: "Giá - Tồn",
	// },
	{
		id: "actions",
		label: "Thao tác",
	},
];

const validationSchema = yup.object({
	productName: yup.string().required("Product name is required"),
	isActive: yup.boolean().required("Active status is required"),
	description: yup.string().required("description is required"),
	price: yup
		.number()
		.required("price is required")
		.min(0, "price must be greater than or equal to 0"),
	salePrice: yup
		.number()
		.typeError("Giá khuyến mãi phải là số")
		.test(
			"is-less-than-price",
			"Giá khuyến mãi không được lớn hơn giá bán",
			function (value) {
				return value === undefined || value <= this.parent.price;
			}
		),
	productPart: yup
		.string()
		.required("Product part is required")
		.oneOf(Object.values(EnumProductType), "Invalid product part"),
	thumbnail: yup.object({
		// path: yup.string().required("Thumbnail path is required"),
		// size: yup
		// 	.number()
		// 	.required("Thumbnail size is required")
		// 	.min(1, "Thumbnail size must be greater than 0"),
	}),
	quantity: yup.number().required("Quantity is required"),
});

export default function Products() {
	const [open, setOpen] = useState<boolean>(false);
	const [targetProduct, setTargetProduct] = useState<IProduct | null>(null);
	const { data: productList, isLoading, refetch } = useProductsQuery();
	const { data: productOptions } = useProductOptionsQuery({});

	const deleteProductMutation = useDeleteProductMutation();

	const formik = useFormik({
		initialValues: {
			productId: targetProduct?.productId ?? "",
			categoryId: targetProduct?.categoryId ?? "",
			productName: targetProduct?.productName ?? "",
			slug: targetProduct?.slug ?? "",
			productPart: targetProduct?.productPart ?? EnumProductType.ETC,
			isActive: targetProduct?.isActive ?? false,
			price: targetProduct?.price ?? 0,
			salePrice: targetProduct?.salePrice ?? 0,
			thumbnail: {
				path: targetProduct?.thumbnail?.path ?? "",
				size: targetProduct?.thumbnail?.size ?? 0,
			},
			images: targetProduct?.images ?? [],
			description: targetProduct?.description ?? "",
			productType: targetProduct?.productPart ?? "",
			optionGroups: {
				groupName: targetProduct?.optionGroups?.groupName ?? "",
				isRequired: targetProduct?.optionGroups?.isRequired ?? false,
				isMultiple: targetProduct?.optionGroups?.isMultiple ?? false,
				optionIds: targetProduct?.optionGroups?.optionIds ?? [],
			},
			weight: 0,
			quantity: 0,
			status: EnumSaleStatus.INSTOCK,
			replaceProductName: "",
			isMultiple: false,
			isRequired: false,
		} as IProduct,
		validationSchema,
		enableReinitialize: true,
		onSubmit: (values) => {
			if (targetProduct) {
				handleUpdateProduct(values);
			} else {
				handleCreateProduct(values);
			}
		},
	});

	console.log(formik.values);

	const handleCreateProduct = async (payload: IProduct) => {
		const signal = new AbortController().signal;
		const resp = await ProductsClient.postNewProduct({
			body: {
				...payload,
				optionGroups: {
					groupName: payload.productPart,
					isRequired: payload.isRequired ?? false,
					isMultiple: payload.isMultiple ?? false,
					optionIds: payload.optionGroups.optionIds,
				},
			},
			signal,
		});

		if (resp.status === HTTP_STATUS.Ok) {
			NotifyUtils.success("Tạo mới sản phẩm thành công");
			formik.resetForm();
			setOpen(false);
			if (targetProduct) {
				setTargetProduct(null);
			}
			await refetch();
		} else {
			NotifyUtils.error("Có lỗi xảy ra trong quá trình tạo mới");
		}
	};

	const handleUpdateProduct = async (payload: IProduct) => {
		const signal = new AbortController().signal;
		const resp = await ProductsClient.putUpdateProduct({
			body: payload,
			signal,
		});

		if (resp.status === HTTP_STATUS.Ok) {
			NotifyUtils.success("Cập nhật sản phẩm thành công");
			formik.resetForm();
			setOpen(false);
			setTargetProduct(null);
			await refetch();
		} else {
			NotifyUtils.error("Có lỗi xảy ra trong quá trình cập nhật");
		}
	};

	const handleDeleteProduct = (productId: string) => {
		deleteProductMutation.mutate({
			payload: {
				productId: productId,
			},
		});
	};

	const handleEditProduct = (product: IProduct) => {
		setTargetProduct(product);
		setOpen(true);
	};

	return (
		<>
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold mb-4 text-white">Products</h1>
				<Button variant="contained" onClick={() => setOpen(true)}>
					+ Add
				</Button>
			</div>
			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							{tableColumns.map((column) => (
								<TableCell
									key={column.id}
									style={column?.styles}>
									<div className="font-bold">
										{column.label}
									</div>
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{isLoading ? (
							<TableRow>
								<TableCell colSpan={3}>Loading...</TableCell>
							</TableRow>
						) : null}
						{productList?.map((product) => (
							<TableRow key={product.productId}>
								<TableCell>
									<div className="flex flex-col gap-2">
										<div>
											<span className="font-bold">
												ID:
											</span>{" "}
											{product.productId}
										</div>
										{product?.optionGroups?.groupName ? (
											<div>
												<span className="font-bold">
													Product part:
												</span>{" "}
												<span className="rounded-md bg-gray-600 text-white p-1">
													{
														product.optionGroups
															.groupName
													}
												</span>
											</div>
										) : null}

										<div className="flex items-center gap-2">
											<span className="font-bold">
												Required:
											</span>{" "}
											{product.optionGroups.isRequired ? (
												<Check className="text-green-500" />
											) : (
												<Ban className="text-red-500" />
											)}
										</div>
										<div className="flex items-center gap-2">
											<span className="font-bold">
												Multiple:
											</span>{" "}
											{product.optionGroups.isMultiple ? (
												<Check className="text-green-500" />
											) : (
												<Ban className="text-red-500" />
											)}
										</div>
									</div>
								</TableCell>
								<TableCell>
									<div className="flex flex-col gap-2">
										<span>{product.productName}</span>
										<span>
											{product.replaceProductName}
										</span>
									</div>
								</TableCell>
								<TableCell>
									<div className="flex flex-col gap-2">
										<ul>
											{product?.optionGroups.optionIds?.map(
												(item) => (
													<li key={item}>
														{
															productOptions?.find(
																(option) =>
																	option.id ===
																	item
															)?.name
														}
														&nbsp;- {item}
													</li>
												)
											)}
										</ul>
									</div>
								</TableCell>
								<TableCell>
									<div>
										<div className="flex gap-4 items-center">
											<span className="font-bold">
												Ẩn
											</span>
											<Switch
												checked={product.isActive}
												className="flex mx-auto"
											/>
											<span className="font-bold">
												Hiện
											</span>
										</div>
									</div>
									{/* <div className="flex justify-between items-center">
										<strong>Tồn: </strong>
										<span className="text-xl border border-gray-600 px-1 rounded-sm max-h-max">
											{product.quantity}
										</span>
									</div> */}
								</TableCell>
								<TableCell className="">
									<div className="flex gap-4">
										<IconButton
											onClick={() =>
												handleEditProduct(product)
											}>
											<Edit />
										</IconButton>
										{/* <Button
											className="p-0 min-w-5"
											onClick={() =>
												handleDeleteProduct(
													product?.productId as string
												)
											}>
											<Trash2 className="!w-5 !h-5 text-red-400" />
										</Button> */}
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<NewProduct
				formik={formik}
				open={open}
				onClose={() => setOpen(!open)}
				isEdit={!!targetProduct}
			/>
		</>
	);
}

Products.layout = Admin;
