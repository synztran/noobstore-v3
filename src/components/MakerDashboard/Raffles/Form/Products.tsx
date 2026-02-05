import UploadImage from "@/components/InputComponents/UploadImage";
import { Button } from "@/components/ReUIComponent/Button";
import { IconButton, TextField } from "@mui/material";
import { FieldArray } from "formik";
import { DeleteIcon, Plus } from "lucide-react";
import { ISectionProps } from "./interface";

export const ProductsSection: React.FC<ISectionProps> = ({
	values,
	errors,
	touched,
	handleChange,
	handleBlur,
	setFieldValue,
}) => (
	<div className="space-y-6">
		<div className="flex justify-between items-center mb-4">
			<div className="text-xl font-semibold">Sản phẩm & giải thưởng</div>
		</div>

		<FieldArray name="productOptions">
			{({ push, remove }) => (
				<div className="space-y-4">
					{values.productOptions.map((product, index) => (
						<div
							key={index}
							className="border rounded-lg p-4 bg-gray-50">
							<div className="flex justify-between items-start mb-4">
								<div className="text-base font-medium">
									Sản phẩm {index + 1}
								</div>
								{values.productOptions.length > 1 && (
									<Button
										variant="ghost"
										onClick={() => remove(index)}>
										<DeleteIcon />
									</Button>
								)}
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<TextField
									fullWidth
									label="Tên sản phẩm *"
									name={`productOptions.${index}.label`}
									value={product.label}
									onChange={handleChange}
									onBlur={handleBlur}
									error={
										touched.productOptions?.[index]
											?.label &&
										Boolean(
											(errors.productOptions as any)?.[
												index
											]?.label,
										)
									}
									helperText={
										touched.productOptions?.[index]
											?.label &&
										(errors.productOptions as any)?.[index]
											?.label
									}
								/>

								<TextField
									fullWidth
									type="number"
									label="Giá (VNĐ) *"
									name={`productOptions.${index}.price`}
									value={product.price}
									onChange={handleChange}
									onBlur={handleBlur}
									error={
										touched.productOptions?.[index]
											?.price &&
										Boolean(
											(errors.productOptions as any)?.[
												index
											]?.price,
										)
									}
									helperText={
										touched.productOptions?.[index]
											?.price &&
										(errors.productOptions as any)?.[index]
											?.price
									}
								/>

								<TextField
									fullWidth
									type="number"
									label="Số lượng"
									name={`productOptions.${index}.raffleQuantity`}
									value={product.raffleQuantity || ""}
									onChange={handleChange}
									onBlur={handleBlur}
									placeholder="Để trống nếu không giới hạn"
								/>

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
														files?.[0]?.publicUrl ||
														"",
													alt: `Product ${index + 1}`,
												},
											);
										}
									}}
								/>
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
							<div key={index} className="flex gap-2">
								<TextField
									fullWidth
									placeholder={`Đặc điểm ${index + 1}`}
									value={feature}
									onChange={(e) =>
										setFieldValue(
											`features.${index}`,
											e.target.value,
										)
									}
								/>
								<IconButton
									onClick={() => remove(index)}
									color="error">
									<DeleteIcon />
								</IconButton>
							</div>
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
