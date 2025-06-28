import TextEditor from "@/adminComponents/Texteditor";
import UploadImage from "@/components/InputComponents/UploadImage";
import { productPartOptions } from "@/constants";
import { formatCurrency } from "@/utils/FormatNumber";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Switch,
	TextField,
} from "@mui/material";
import React from "react";
import MultipleSelectionList, { TOptions } from "./multipleSelectionList";
import CategorySelection from "./selectCategory";
import SelectionList from "./selectionList";
import useProductOptionsQuery from "@/react-query/products/api/useProductOptionsQueries";

interface IProps {
	formik: any;
	open: boolean;
	onClose: () => void;
	isEdit?: boolean;
}

const NewProduct: React.FC<IProps> = (props) => {
	const { formik, open, onClose, isEdit = false } = props;
	const { data: productOptions, isPending } = useProductOptionsQuery({
		productPart: formik.values.productPart,
	});
	const handleOnChange = (name: string, value: string) => {
		formik.setFieldValue(name, value);
	};

	const syncImageToFormik = (file: { publicUrl: string; size: number }) => {
		formik.setFieldValue("thumbnail", {
			path: file.publicUrl,
			size: file.size,
		});
	};

	return (
		<Dialog
			open={open}
			onClose={onClose}
			fullWidth
			PaperProps={{
				className: "!max-w-[min(80vw,900px)]",
			}}>
			<DialogTitle className="!text-2xl">
				{isEdit ? "Chỉnh sửa" : "Tạo mới"} Sản phẩm
			</DialogTitle>
			<form onSubmit={formik.handleSubmit}>
				<DialogContent className="!py-0">
					<CategorySelection
						onChange={handleOnChange}
						name="categoryId"
						placeholder="Chọn danh mục sản phẩm"
						value={formik.values.categoryId}
						className="mt-4"
						isUpdate={isEdit}
					/>
					<TextField
						fullWidth
						margin="normal"
						id="productName"
						name="productName"
						label="Tên sản phẩm"
						value={formik.values.productName}
						onChange={formik.handleChange}
						error={
							formik.touched.productName &&
							Boolean(formik.errors.productName)
						}
						helperText={
							formik.touched.productName &&
							formik.errors.productName
						}
					/>
					<div className="grid grid-cols-3 items-start gap-2 mt-2">
						<SelectionList
							options={productPartOptions}
							name="productPart"
							value={formik.values.productPart}
							placeholder="Lựa chọn loại sản phẩm"
							onChange={handleOnChange}
							className="col-span-1"
						/>
						<div className="col-span-1 flex flex-col border px-2 relative w-full h-[56px] rounded-[4px]">
							<label className="absolute -top-3 left-2 bg-white px-2 text-xs text-[rgba(0,0,0,0.6)]">
								Nhiều lựa chọn
							</label>
							<div className="flex gap-2 items-center mt-2">
								<Switch
									id="isMultiple"
									name="isMultiple"
									checked={formik.values.isMultiple}
									onChange={formik.handleChange}
								/>
								<label htmlFor="isMultiple" className="">
									{formik.values.isMultiple ? "Có" : "Không"}
								</label>
							</div>
						</div>
						<div className="col-span-1 flex flex-col border px-2 relative w-full h-[56px] rounded-[4px]">
							<label className="absolute -top-3 left-2 bg-white px-2 text-xs text-[rgba(0,0,0,0.6)]">
								Bắt buộc
							</label>
							<div className="flex gap-2 items-center mt-2">
								<Switch
									id="isRequired"
									name="isRequired"
									checked={formik.values.isRequired}
									onChange={formik.handleChange}
								/>
								<label htmlFor="isRequired" className="">
									{formik.values.isRequired ? "Có" : "Không"}
								</label>
							</div>
						</div>
					</div>

					<MultipleSelectionList
						className="relative mt-2"
						name="optionGroups.optionIds"
						setFieldValue={formik.setFieldValue}
						values={formik.values.optionGroups?.optionIds || []}
						options={
							(productOptions?.map((option) => ({
								id: option.id,
								name: option.name,
								salePrice: option.salePrice,
								price: option.price,
							})) as TOptions[]) || []
						}
						fetching={isPending}
						disabled={!formik.values.categoryId}
					/>

					<div className="grid grid-cols-3 gap-2">
						<div className="col-span-1 flex flex-col mt-4 border max-w-max px-2 relative min-w-[15vw] w-full h-[56px] rounded-[4px]">
							<label className="absolute -top-3 left-2 bg-white px-2 text-xs text-[rgba(0,0,0,0.6)]">
								Trạng thái hiện thị
							</label>
							<div className="flex gap-2 items-center mt-2">
								<Switch
									id="isActive"
									name="isActive"
									checked={formik.values.isActive}
									onChange={formik.handleChange}
								/>
								<label htmlFor="isActive" className="">
									{formik.values.isActive ? "Bật" : "Tắt"}
								</label>
							</div>
						</div>
						<div className="flex items-center gap-2 col-span-2">
							<div className="relative w-full">
								<TextField
									fullWidth
									margin="normal"
									id="price"
									name="price"
									label="Giá gốc"
									type="number"
									value={formik.values.price}
									onChange={formik.handleChange}
									error={
										formik.touched.price &&
										Boolean(formik.errors.price)
									}
									helperText={
										formik.touched.price &&
										formik.errors.price
									}
								/>
								<span className="absolute -bottom-4 left-1 text-green-600">
									{formatCurrency(formik.values.price)}
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
								<span className="absolute -bottom-4 left-1 text-green-600">
									{formatCurrency(
										formik.values.salePrice || 0
									)}
								</span>
							</div>
						</div>
					</div>
					<TextEditor
						label="Nội dung chi tiết"
						value={formik.values.description ?? ""}
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
						thumbnailUploaded={[formik.values.thumbnail?.path]}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={onClose} color="secondary">
						Cancel
					</Button>
					<Button type="submit" color="primary">
						{isEdit ? "Cập nhật" : "Tạo mới"}
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
};

export default NewProduct;
