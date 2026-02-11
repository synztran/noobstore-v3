import UploadImage from "@/components/InputComponents/UploadImage";
import { Button } from "@/components/ReUIComponent/Button";
import { Input } from "@/components/ReUIComponent/Input";
import { Label } from "@/components/ReUIComponent/Label";
import { TextField } from "@mui/material";
import { FieldArray } from "formik";
import { Plus, Trash2 } from "lucide-react";
import { ISectionProps } from "./interface";
import { useDebouncedField } from "./useDebouncedField";

// Debounced Product Field Component
const DebouncedProductField: React.FC<{
	index: number;
	product: any;
	touched: any;
	errors: any;
	handleBlur: any;
	setFieldValue: any;
}> = ({ index, product, touched, errors, handleBlur, setFieldValue }) => {
	const labelField = useDebouncedField(
		`productOptions.${index}.label`,
		product.label,
		setFieldValue,
	);

	const hasError =
		touched.productOptions?.[index]?.label &&
		Boolean((errors.productOptions as any)?.[index]?.label);
	const errorMessage =
		touched.productOptions?.[index]?.label &&
		(errors.productOptions as any)?.[index]?.label;

	return (
		<div className="w-full">
			<Label required>Tên</Label>
			<Input
				name={`productOptions.${index}.label`}
				value={labelField.value}
				onChange={labelField.onChange}
				onBlur={handleBlur}
				placeholder="Nhập tên sản phẩm"
				errorMessage={errorMessage}
			/>
		</div>
	);
};

// Debounced Feature Field Component
const DebouncedFeatureField: React.FC<{
	index: number;
	feature: string;
	setFieldValue: any;
	remove: (index: number) => void;
}> = ({ index, feature, setFieldValue, remove }) => {
	const featureField = useDebouncedField(
		`features.${index}`,
		feature,
		setFieldValue,
	);

	return (
		<div className="w-full">
			<div className="flex gap-2">
				<TextField
					fullWidth
					placeholder={`Đặc điểm ${index + 1}`}
					value={featureField.value}
					onChange={featureField.onChange}
				/>
				<Button size="icon" onClick={() => remove(index)}>
					<Trash2 className="text-red-400" size={16} />
				</Button>
			</div>
		</div>
	);
};

export const ProductsSection: React.FC<ISectionProps> = ({
	values,
	errors,
	touched,
	handleChange,
	handleBlur,
	setFieldValue,
}) => (
	<div className="space-y-6">
		<FieldArray name="productOptions">
			{({ push, remove }) => (
				<div className="space-y-4">
					{values.productOptions.map((product, index) => (
						<div
							key={index}
							className="border rounded-lg p-4 bg-gray-50">
							<div className="flex justify-between items-center mb-4">
								<div className="text-base font-medium">
									Sản phẩm {index + 1}
								</div>
								{values.productOptions.length > 1 && (
									<Button
										size="icon"
										onClick={() => remove(index)}>
										<Trash2
											className="text-red-600"
											size={16}
										/>
									</Button>
								)}
							</div>

							<div className="grid grid-cols-6 gap-4">
								<div className="col-span-3">
									<UploadImage
										label="Ảnh sản phẩm"
										subLabel="Ảnh hiển thị cho sản phẩm trong raffle"
										allowMultiple={false}
										max={1}
										isRequired={false}
										acceptedFileTypes={[
											".jpg",
											".jpeg",
											".png",
											".webp",
										]}
										thumbnailUploaded={
											product.thumbnail
												? [product.thumbnail.path]
												: []
										}
										handleSyncData={(files) => {
											if (files && files.length > 0) {
												setFieldValue(
													`productOptions.${index}.thumbnail`,
													{
														path:
															files?.[0]
																?.publicUrl ||
															"",
														alt: `Product ${index + 1}`,
													},
												);
											}
										}}
									/>
								</div>
								<div className="col-span-3 space-y-3">
									<DebouncedProductField
										index={index}
										product={product}
										touched={touched}
										errors={errors}
										handleBlur={handleBlur}
										setFieldValue={setFieldValue}
									/>

									<div>
										<Label required>Giá bán</Label>
										<Input
											type="number"
											name={`productOptions.${index}.price`}
											value={product.price}
											onChange={handleChange}
											onBlur={handleBlur}
											errorMessage={
												touched.productOptions?.[index]
													?.price &&
												(
													errors.productOptions as any
												)?.[index]?.price
											}
										/>
									</div>

									<div>
										<Label>Số lượng</Label>
										<Input
                      type="number"
											name={`productOptions.${index}.raffleQuantity`}
											value={product.raffleQuantity || ""}
											onChange={handleChange}
											onBlur={handleBlur}
											errorMessage={
												touched.productOptions?.[index]
													?.raffleQuantity
													? (
															errors.productOptions as any
														)?.[index]
															?.raffleQuantity
													: "Để trống nếu không giới hạn"
											}
										/>
									</div>
								</div>
							</div>
						</div>
					))}

					<Button
						type="button"
						variant="outline"
						onClick={() =>
							push({ label: "", price: 0, raffleQuantity: null })
						}
						className="w-full">
						<Plus className="mr-2" /> Thêm sản phẩm
					</Button>
				</div>
			)}
		</FieldArray>

		<div className="border-t pt-6 mt-6">
			<div className="text-lg font-medium mb-4">Đặc điểm nổi bật</div>
			<FieldArray name="features">
				{({ push, remove }) => (
					<div className="space-y-2">
						{values.features.map((feature, index) => (
							<DebouncedFeatureField
								key={index}
								index={index}
								feature={feature}
								setFieldValue={setFieldValue}
								remove={remove}
							/>
						))}
						<Button
							type="button"
							variant="outline"
							onClick={() => push("")}
							className="w-full">
							<Plus className="mr-2" /> Thêm đặc điểm
						</Button>
					</div>
				)}
			</FieldArray>
		</div>
	</div>
);
