// import TextEditor from "@/adminComponents/Texteditor";
import ProductsClient from "@/client/ProductsClient";
import UploadImage from "@/components/InputComponents/UploadImage";
import {
	postProductAddonService,
	postProductTypeOptions,
	postSaleTypeOptions,
} from "@/constants";
import { useAuth } from "@/context/Auth";
import { EnumCategoryType, EnumPostPriceType } from "@/interface/interface";
import {
	checkUsedServiceAddonPrice,
	formatCurrency,
} from "@/utils/FormatNumber";
import NotifyUtils from "@/utils/NotifyUtils";
import { preventKeyInNumber } from "@/utils/ValidateUtils";
import {
	Box,
	Button,
	Checkbox,
	CircularProgress,
	Divider,
	Grid,
	MenuItem,
	Modal,
	Typography,
} from "@material-ui/core";
import {
	FormControl,
	FormControlLabel,
	InputLabel,
	Select,
	TextField,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useMemo } from "react";
import * as Yup from "yup";
import ProductOptions from "./productOptions";

interface IProps {
	open: boolean;
	handleClose: () => void;
}

const checkValidPrice = (value: string) => {
	if (value === "" || value === "0") return false;
	return true;
};

const ModalPostProduct: React.FC<IProps> = ({ open = false, handleClose }) => {
	const { user } = useAuth() as unknown as {
		user: {
			customerId: string;
			rating: number;
			totalSales: number;
			firstName: string;
			lastName: string;
			verified?: boolean;
		};
	};

	console.log("user", user);

	const formik = useFormik({
		initialValues: {
			productName: "",
			productInfo: "",
			productType: EnumCategoryType.KEYBOARD,
			priceType: EnumPostPriceType.ABSOLUTE,
			ogPrice: "",
			salePrice: "",
			policyChecked: false,
			images: [],
			addonServices: [],
			shortDescription: "",
		},
		validationSchema: Yup.object({
			productName: Yup.string().required("Tên sản phẩm là bắt buộc"),
			productInfo: Yup.string().required(
				"Thông tin sản phẩm là bắt buộc"
			),
			productType: Yup.string().required("Loại sản phẩm là bắt buộc"),
			priceType: Yup.string().required("Loại giá là bắt buộc"),
			ogPrice: Yup.number()
				.typeError("Giá bán phải là số")
				.required("Giá bán là bắt buộc"),
			salePrice: Yup.number()
				.typeError("Giá khuyến mãi phải là số")
				.test(
					"is-less-than-ogPrice",
					"Giá khuyến mãi không được lớn hơn giá bán",
					function (value) {
						return (
							value === undefined || value <= this.parent.ogPrice
						);
					}
				),
			policyChecked: Yup.boolean().oneOf(
				[true],
				"You must agree to the policy"
			),
			shortDescription: Yup.string()
				.max(80, "Mô tả ngắn không được quá 80 ký tự")
				.required("Mô tả ngắn là bắt buộc"),
		}),
		onSubmit: async (values, action) => {
			action.setSubmitting(true);
			const resp = await ProductsClient.postUsedProduct({
				data: {
					name: values?.productName,
					description: values?.productInfo,
					og_price: parseInt(values?.ogPrice, 10),
					sale_price: parseInt(values?.salePrice, 10),
					type: values?.productType,
					sale_type: values?.priceType,
					images: values?.images?.map(
						(image: { publicUrl: string; size: number }) => ({
							public_url: image.publicUrl,
							size: image.size,
						})
					),
					service_price: totalServiceAddonPrice || 0,
					service_add_on: values?.addonServices || [],
					total_price: totalPrice || 0,
					condition: "",
					owner: {
						customer_id: user?.customerId,
						rating: user?.rating || 0,
						total_sales: user?.totalSales || 0,
						full_name: user?.firstName + " " + user?.lastName,
						verified: user?.verified ?? false,
					},
					status: "",
					listings: [],
					short_description: values?.shortDescription,
				},
			});
			if (resp.status === "OK") {
				action.resetForm();
				handleClose();
				NotifyUtils.success("Đăng bán sản phẩm thành công");
			} else {
				NotifyUtils.error(
					"Đăng bán sản phẩm thất bại. Vui lòng liên hệ website để hỗ trợ"
				);
			}
			action.setSubmitting(false);
		},
	});

	const totalServiceAddonPrice = useMemo(() => {
		if (formik.values.addonServices.length === 0) return 0;
		return formik.values.addonServices
			.map((addon: { price: number }) => addon.price)
			.reduce((acc, cur) => acc + cur);
	}, [formik.values.addonServices]);

	const totalPrice = useMemo(() => {
		if (formik.values.salePrice !== "" && formik.values.salePrice !== "0") {
			return (
				parseInt(formik.values.salePrice, 10) + totalServiceAddonPrice
			);
		}
		if (formik.values.ogPrice !== "" && formik.values.ogPrice !== "0") {
			return parseInt(formik.values.ogPrice, 10) + totalServiceAddonPrice;
		}
		return 0;
	}, [formik.values]);

	const syncImageToFormik = (file: { publicUrl: string; size: number }) => {
		formik.setFieldValue("images", [...formik.values.images, ...[file]]);
	};

	const resetFormData = () => {
		formik.resetForm();
	};

	console.log(
		formik.errors,
		formik.getFieldMeta("addonService"),
		formik.isSubmitting
	);

	return (
		<div>
			<Modal open={open}>
				<Box
					className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[70vw] max-h-[90vh] bg-white shadow-lg px-8 pt-8 pb-4 rounded-lg ${
						formik.isSubmitting
							? "overflow-hidden"
							: "overflow-y-auto"
					}`}>
					<Typography
						variant="h6"
						component="h1"
						className="!mb-4 text-lg font-semibold">
						Đăng bán sản phẩm
					</Typography>
					<form
						onSubmit={formik.handleSubmit}
						className="relative flex flex-col gap-6">
						<TextField
							fullWidth
							label="Tên sản phẩm"
							variant="outlined"
							name="productName"
							value={formik.values.productName}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							error={
								formik.touched.productName &&
								Boolean(formik.errors.productName)
							}
							helperText={
								formik.touched.productName &&
								formik.errors.productName
							}
						/>
						<Grid container spacing={2}>
							<Grid item xs={6}>
								<FormControl fullWidth>
									<InputLabel>Loại sản phẩm</InputLabel>
									<Select
										name="productType"
										value={formik.values.productType}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										error={
											formik.touched.productType &&
											Boolean(formik.errors.productType)
										}>
										{postProductTypeOptions.map(
											(option) => (
												<MenuItem
													key={option.value}
													value={option.value}>
													{option.label}
												</MenuItem>
											)
										)}
									</Select>
									{formik.touched.productType &&
										formik.errors.productType && (
											<span className="text-red-600 text-xs mt-1 ml-4">
												{formik.errors.productType}
											</span>
										)}
								</FormControl>
							</Grid>
							<Grid item xs={6}>
								<FormControl fullWidth>
									<InputLabel>Loại giá mong muốn</InputLabel>
									<Select
										name="priceType"
										value={formik.values.priceType}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}>
										{postSaleTypeOptions.map((option) => (
											<MenuItem
												key={option.value}
												value={option.value}
												disabled={
													option?.disabled ?? false
												}>
												{option.label}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>
						</Grid>
						{formik.values.priceType ===
						EnumPostPriceType.ABSOLUTE ? (
							<Grid container spacing={2} className="">
								<Grid item xs={6}>
									<TextField
										fullWidth
										inputProps={{
											inputMode: "numeric",
										}}
										label="Giá bán"
										variant="outlined"
										name="ogPrice"
										value={formik.values.ogPrice}
										onKeyDown={preventKeyInNumber}
										onChange={(number) => {
											if (number.target.value === "e") {
												return;
											}
											formik.handleChange(number);
										}}
										onBlur={formik.handleBlur}
										error={
											formik.touched.ogPrice &&
											Boolean(formik.errors.ogPrice)
										}
										helperText={
											formik.touched.ogPrice &&
											formik.errors.ogPrice
										}
									/>
									{!formik.errors.ogPrice ? (
										<span className="text-gray-500 text-xs mt-1 ml-4">
											{formatCurrency(
												parseInt(
													String(
														formik.values.ogPrice
													),
													10
												) || 0
											)}
										</span>
									) : null}
								</Grid>
								<Grid item xs={6}>
									<TextField
										fullWidth
										label="Giá khuyến mãi"
										variant="outlined"
										name="salePrice"
										onKeyDown={preventKeyInNumber}
										value={formik.values.salePrice}
										onChange={(event) => {
											formik.setFieldValue(
												"salePrice",
												event.target.value
											);
										}}
										onBlur={formik.handleBlur}
										error={
											formik.touched.salePrice &&
											Boolean(formik.errors.salePrice)
										}
										helperText={
											formik.touched.salePrice &&
											formik.errors.salePrice
										}
										disabled={
											formik.values.ogPrice === "" ||
											formik.values.ogPrice === "0"
										}
									/>
									<span className="text-gray-500 text-xs mt-1 ml-4">
										{formatCurrency(
											parseInt(
												String(formik.values.salePrice),
												10
											) || 0
										)}
									</span>
								</Grid>
							</Grid>
						) : null}
						<ProductOptions formik={formik} />
						{/* <TextEditor
							id="ql-short-editor"
							value={formik.values.shortDescription}
							onChange={(value) =>
								formik.setFieldValue("shortDescription", value)
							}
							label="Thông tin ngắn về sản phẩm"
							placeholder="Thêm vào thông tin thú vị để dễ tiếp cận người mua hơn..."
							onBlur={() =>
								formik.setFieldTouched("shortDescription", true)
							}
							errorMessage={
								formik.touched.shortDescription
									? formik.errors.shortDescription
									: ""
							}
							maxContent={80}
						/>
						<TextEditor
							value={formik.values.productInfo}
							onChange={(value) =>
								formik.setFieldValue("productInfo", value)
							}
							label="Thông tin chi tiết sản phẩm"
							placeholder="Thêm vào thông tin thú vị để dễ tiếp cận người mua hơn..."
							onBlur={() =>
								formik.setFieldTouched("productInfo", true)
							}
							errorMessage={
								formik.touched.productInfo
									? formik.errors.productInfo
									: ""
							}
							maxContent={2000}
						/> */}
						<MoreAddonService formik={formik} />
						<UploadImage
							label="Ảnh chi tiết sản phẩm"
							acceptedFileTypes={["jpeg", "jpeg", "png"]}
							errorMessage={
								(formik.errors.images as string) || ""
							}
							files={formik.values.images}
							handleSyncData={syncImageToFormik}
						/>
						<Divider />
						<Box
							component={"fieldset"}
							className="border p-4 rounded-lg">
							<Typography
								component="legend"
								className="text-gray-500 text-base">
								Tổng tiền tạm tính
							</Typography>
							<div className="flex flex-col pl-4 gap-1">
								<div className="flex justify-between">
									<span className="text-gray-500 text-sm">
										Giá bán
									</span>
									<span
										className={`text-gray-500 text-sm ${
											formik.values.salePrice !== "" &&
											formik.values.salePrice !== "0"
												? "line-through"
												: ""
										}`}>
										{formatCurrency(
											parseInt(
												String(formik.values.ogPrice),
												10
											) || 0
										)}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-500 text-sm">
										Giá khuyến mãi
									</span>
									<span className="text-gray-500 text-sm">
										{formatCurrency(
											parseInt(
												String(formik.values.salePrice),
												10
											) || 0
										)}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-500 text-sm">
										Phí nền tảng
									</span>
									<span className="text-gray-500 text-sm">
										{/* {formatCurrency(0)} */}
										Bạn còn được{" "}
										<strong>3 lượt miễn phí</strong> ở tháng
										này
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-500 text-sm">
										Phí dịch vụ đính kèm
									</span>
									<span className="text-gray-500 text-sm">
										{formatCurrency(totalServiceAddonPrice)}
									</span>
								</div>
								<Divider />
								<div className="flex justify-between">
									<span className="text-gray-500 text-base font-bold">
										Tổng tiền
									</span>
									<span className="text-gray-500 text-base font-bold">
										{formatCurrency(
											totalPrice + totalServiceAddonPrice
										)}
									</span>
								</div>
							</div>
						</Box>
						<FormControlLabel
							className="flex justify-start"
							control={
								<Checkbox
									name="policyChecked"
									checked={formik.values.policyChecked}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
								/>
							}
							label={<PolicyAndCondition />}
						/>
						<div className="flex gap-4 justify-end py-4 sticky -bottom-4 right-0 bg-white z-10 border-t-2">
							<Button
								variant="outlined"
								onClick={() => {
									handleClose();
									resetFormData();
								}}
								className="text-gray-700 border border-gray-300">
								Đóng
							</Button>
							<Button
								variant="contained"
								type="submit"
								className="bg-blue-500 text-white">
								Đăng bán
							</Button>
						</div>
					</form>
					{formik.isSubmitting ? (
						<div className="absolute top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.4)] z-10 flex justify-center items-center">
							<CircularProgress />
						</div>
					) : null}
				</Box>
			</Modal>
		</div>
	);
};

export default ModalPostProduct;

const PolicyAndCondition = () => {
	return (
		<div className="flex flex-col gap-2">
			<p className="text-sm">
				Tôi đồng ý với{" "}
				<span className="text-blue-500 cursor-pointer">
					Điều khoản dịch vụ
				</span>{" "}
				và{" "}
				<span className="text-blue-500 cursor-pointer">
					Chính sách bảo mật
				</span>
			</p>
		</div>
	);
};

const MoreAddonService = ({ formik }: { formik: any }) => {
	return (
		<Box component={"fieldset"} className="border p-4 rounded-lg">
			<Typography component={"legend"} className="text-gray-500">
				Dịch vụ kèm theo
			</Typography>
			<div className="flex flex-col gap-4">
				{postProductAddonService.map((service) => (
					<div className="grid grid-cols-[32px_auto_120px] gap-2">
						<Checkbox
							className="w-8 h-8 !m-auto"
							name={service.value}
							checked={formik.values.addonServices
								?.map((addon: { value: string }) => addon.value)
								.includes(service.value)}
							onChange={(event) => {
								const isChecked = event.target.checked;
								const currentServices =
									formik.values.addonServices;
								const serviceAddonPrice =
									checkUsedServiceAddonPrice({
										isPercent: service.isPercent,
										productPrice:
											formik.values.salePrice ||
											formik.values.ogPrice,
										servicePrice: service.price,
										minServicePrice: service.minPrice || 0,
									});
								if (isChecked) {
									const formatValue = {
										value: service.value,
										price: serviceAddonPrice || 0,
									};
									formik.setFieldValue("addonServices", [
										...currentServices,
										formatValue,
									]);
								} else {
									formik.setFieldValue(
										"addonServices",
										currentServices.filter(
											(item: {
												value: string;
												price: number;
											}) => item.value !== service.value
										)
									);
								}
							}}
							onBlur={formik.handleBlur}
							disabled={
								!(
									checkValidPrice(formik.values.salePrice) ||
									checkValidPrice(formik.values.ogPrice)
								) && service.isPercent
							}
						/>
						<div className="flex gap-2">
							<Divider
								orientation="vertical"
								variant="middle"
								flexItem
								className="w-[1px] h-full mx-0"
							/>
							<div>
								<div className="text-sm font-bold">
									{service.name}
								</div>
								<div className="text-xs text-gray-500">
									{service.subName}
								</div>
							</div>
						</div>
						<div className="text-right my-auto text-sm">
							{service.isPercent ? (
								<span>
									{checkValidPrice(formik.values.salePrice) ||
									checkValidPrice(formik.values.ogPrice) ? (
										<span>
											{formatCurrency(
												Math.round(
													checkUsedServiceAddonPrice({
														isPercent:
															service.isPercent,
														productPrice:
															formik.values
																.salePrice ||
															formik.values
																.ogPrice,
														servicePrice:
															service.price,
														minServicePrice:
															service.minPrice ||
															0,
													})
												)
											)}
											{/* <br />({service.price}%) */}
										</span>
									) : (
										"Điền thông tin giá"
									)}
								</span>
							) : (
								<span>{formatCurrency(service.price)}</span>
							)}
						</div>
					</div>
				))}
			</div>
		</Box>
	);
};
