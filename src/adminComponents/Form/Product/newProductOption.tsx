import TextEditor from "@/adminComponents/Texteditor";
import ProductsClient from "@/client/ProductsClient";
import UploadImage from "@/components/InputComponents/UploadImage";
import { productPartOptions } from "@/constants";
import { HTTP_STATUS } from "@/constants/Enums/https";
import {
	EnumProductOptStatus,
	EnumProductType,
	EnumSaleStatus,
	IProductOption,
} from "@/interface/interface";
import useProductOptionsQuery from "@/react-query/products/api/useProductOptionsQueries";
import { formatCurrency, formatNumber } from "@/utils/FormatNumber";
import NotifyUtils from "@/utils/NotifyUtils";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Switch,
	TextField,
} from "@mui/material";
import { useFormik } from "formik";
import React from "react";
import * as yup from "yup";
import SelectionList from "./selectionList";

interface IProps {
	open: boolean;
	onClose: () => void;
}

const NewProductOption: React.FC<IProps> = (props) => {
	const { open, onClose } = props;
	const { refetch } = useProductOptionsQuery({});
	const validationSchema = yup.object({
		name: yup.string().required("Product name is required"),
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
		description: yup.string().required("Description is required"),
		// thumbnail: yup.string().required("Thumbnail is required"),
		quantity: yup.number().required("Quantity is required"),
		productPart: yup.string().required("Product part is required"),
	});

	const formik = useFormik({
		initialValues: {
			name: "",
			isActive: false,
			price: 0,
			salePrice: 0,
			thumbnail: "",
			description: "",
			quantity: 0,
			productPart: EnumProductType.ETC,
			status: EnumProductOptStatus.INSTOCK,
		} as IProductOption,
		validationSchema,
		onSubmit: async (values) => {
			handleSubmit(values);
		},
	});

	const handleOnChange = (name: string, value: string) => {
		formik.setFieldValue(name, value);
	};

	const syncImageToFormik = (file: { publicUrl: string; size: number }) => {
		formik.setFieldValue("thumbnail", file.publicUrl);
	};

	const handleSubmit = async (values: IProductOption) => {
		const signal = new AbortController().signal;
		const resp = await ProductsClient.postNewProductOption({
			body: {
				...values,
				thumbnail: values.thumbnail ?? "",
			},
			signal,
		});
		if (resp.status === HTTP_STATUS.Ok) {
			NotifyUtils.success("Tạo mới thành công");
			formik.resetForm();
			onClose();
			await refetch();
		} else {
			NotifyUtils.error("Có lỗi xảy ra trong quá trình tạo mới");
		}
	};

	return (
		<Dialog
			open={open}
			onClose={onClose}
			fullWidth
			PaperProps={{
				className: "!max-w-[60vw]",
			}}>
			<DialogTitle className="!text-2xl">
				Tạo mới Product Option
			</DialogTitle>
			<form onSubmit={formik.handleSubmit}>
				<DialogContent className="!py-0">
					<TextField
						fullWidth
						margin="normal"
						id="name"
						name="name"
						label="Tên sản phẩm"
						value={formik.values.name}
						onChange={formik.handleChange}
						error={
							formik.touched.name && Boolean(formik.errors.name)
						}
						helperText={formik.touched.name && formik.errors.name}
					/>
					<SelectionList
						options={productPartOptions}
						name="productPart"
						value={formik.values.productPart || ""}
						placeholder="Lựa chọn loại sản phẩm"
						onChange={handleOnChange}
						className="mt-2"
					/>
					<div className="flex gap-4">
						<div className="flex flex-col mt-4 border border-gray-400 max-w-max px-2 relative min-w-[15vw] w-full h-[56px] rounded-[4px]">
							<label className="absolute -top-3 left-2 bg-white px-2 text-xs text-[rgba(0,0,0,0.6)]">
								Trạng thái hiện thị
							</label>
							<div className="flex gap-2 items-center mt-2">
								<Switch
									id="isActive"
									name="isActive"
									checked={formik.values.isActive}
									onChange={formik.handleChange}
									value={
										formik.values.isActive
											? EnumSaleStatus.INSTOCK
											: EnumSaleStatus.OUTSTOCK
									}
								/>
								<label htmlFor="isActive" className="">
									{formik.values.isActive ? "Bật" : "Tắt"}
								</label>
							</div>
						</div>
						<div className="relative w-full">
							<TextField
								fullWidth
								margin="normal"
								id="quantity"
								name="quantity"
								label="Số lượng tồn"
								type="number"
								value={formik.values.quantity}
								onChange={formik.handleChange}
								error={
									formik.touched.quantity &&
									Boolean(formik.errors.quantity)
								}
								helperText={
									formik.touched.quantity &&
									formik.errors.quantity
								}
							/>
							<span className="absolute -bottom-4 left-1 text-green-600">
								{formatNumber(formik.values.quantity || 0)}
							</span>
						</div>
					</div>
					<div className="flex items-center gap-4 mt-2">
						<div className="relative w-full">
							<TextField
								fullWidth
								margin="normal"
								id="price"
								name="price"
								label="Giá"
								type="number"
								value={formik.values.price}
								onChange={formik.handleChange}
								error={
									formik.touched.price &&
									Boolean(formik.errors.price)
								}
								helperText={
									formik.touched.price && formik.errors.price
								}
							/>
							<span className="absolute -bottom-4 left-1 text-green-600">
								{formatCurrency(formik.values.price || 0)}
							</span>
						</div>
						<div className="relative w-full">
							<TextField
								fullWidth
								margin="normal"
								id="salePrice"
								name="salePrice"
								label="Giá khuyến mãi"
								type="number"
								value={formik.values.salePrice}
								onChange={formik.handleChange}
								error={
									formik.touched.salePrice &&
									Boolean(formik.errors.salePrice)
								}
								helperText={
									formik.touched.salePrice &&
									formik.errors.salePrice
								}
							/>
							{!formik.errors.salePrice ? (
								<span className="absolute -bottom-4 left-1 text-green-600">
									{formatCurrency(
										formik.values.salePrice || 0
									)}
								</span>
							) : null}
						</div>
					</div>
					<TextEditor
						label="Nội dung chi tiết"
						value={formik.values.description || ""}
						onChange={(value) =>
							formik.setFieldValue("description", value)
						}
						placeholder="Nội dung chi tiết"
						className="mt-4"
						maxContent={500}
					/>
					<UploadImage
						label="Ảnh sản phẩm đại diện"
						handleSyncData={syncImageToFormik}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={onClose} color="secondary">
						Cancel
					</Button>
					<Button type="submit" color="primary">
						Create
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
};

export default NewProductOption;
