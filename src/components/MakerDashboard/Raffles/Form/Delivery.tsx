import { Button } from "@/components/ReUIComponent/Button";
import { IconButton, TextField } from "@mui/material";
import { FieldArray } from "formik";
import { DeleteIcon, Plus } from "lucide-react";
import { ISectionProps } from "./interface";

const DeliverySection: React.FC<ISectionProps> = ({
	values,
	errors,
	touched,
	handleChange,
	handleBlur,
	setFieldValue,
}) => (
	<div className="space-y-6">
		<div className="text-xl font-semibold mb-4">Phương thức vận chuyển</div>

		<FieldArray name="deliveryMethods">
			{({ push, remove }) => (
				<div className="space-y-4">
					{values.deliveryMethods.map((method, index) => (
						<div
							key={index}
							className="border rounded-lg p-4 bg-gray-50">
							<div className="flex justify-between items-start mb-4">
								<div className="text-base font-medium">
									Phương thức {index + 1}
								</div>
								{values.deliveryMethods.length > 1 && (
									<IconButton
										onClick={() => remove(index)}
										size="small"
										color="error">
										<DeleteIcon />
									</IconButton>
								)}
							</div>

							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<TextField
									fullWidth
									label="Tên phương thức *"
									name={`deliveryMethods.${index}.name`}
									value={method.name}
									onChange={handleChange}
									onBlur={handleBlur}
									error={
										touched.deliveryMethods?.[index]
											?.name &&
										Boolean(
											(errors.deliveryMethods as any)?.[
												index
											]?.name,
										)
									}
									helperText={
										touched.deliveryMethods?.[index]
											?.name &&
										(errors.deliveryMethods as any)?.[index]
											?.name
									}
									placeholder="VD: Giao hàng nhanh"
								/>

								<TextField
									fullWidth
									type="number"
									label="Phí vận chuyển (VNĐ) *"
									name={`deliveryMethods.${index}.price`}
									value={method.price}
									onChange={handleChange}
									onBlur={handleBlur}
									error={
										touched.deliveryMethods?.[index]
											?.price &&
										Boolean(
											(errors.deliveryMethods as any)?.[
												index
											]?.price,
										)
									}
									helperText={
										touched.deliveryMethods?.[index]
											?.price &&
										(errors.deliveryMethods as any)?.[index]
											?.price
									}
								/>

								<TextField
									fullWidth
									label="Thời gian dự kiến *"
									name={`deliveryMethods.${index}.estimatedDays`}
									value={method.estimatedDays}
									onChange={handleChange}
									onBlur={handleBlur}
									error={
										touched.deliveryMethods?.[index]
											?.estimatedDays &&
										Boolean(
											(errors.deliveryMethods as any)?.[
												index
											]?.estimatedDays,
										)
									}
									helperText={
										touched.deliveryMethods?.[index]
											?.estimatedDays &&
										(errors.deliveryMethods as any)?.[index]
											?.estimatedDays
									}
									placeholder="VD: 2-3 ngày"
								/>
							</div>
						</div>
					))}

					<Button
						type="button"
						variant="outline"
						onClick={() =>
							push({ name: "", price: 0, estimatedDays: "" })
						}
						className="w-full">
						<Plus className="mr-2" /> Thêm phương thức vận chuyển
					</Button>
				</div>
			)}
		</FieldArray>
	</div>
);

export default DeliverySection;
