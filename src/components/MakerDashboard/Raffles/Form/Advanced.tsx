import { Button } from "@/components/ReUIComponent/Button";
import { Label } from "@/components/ReUIComponent/Label";
import { Switch } from "@/components/ReUIComponent/Switch";
import { IconButton, TextField } from "@mui/material";
import { FieldArray } from "formik";
import { DeleteIcon, Plus } from "lucide-react";
import { ISectionProps } from "./interface";

const AdvancedSection: React.FC<ISectionProps> = ({
	values,
	errors,
	touched,
	handleChange,
	handleBlur,
	setFieldValue,
}) => (
	<div className="flex flex-col gap-4 overflow-y-auto min-h-0">
		<div>
			<div className="text-lg font-medium mb-4">Hiển thị trang chủ</div>
			<div className="space-y-4">
				<div className="flex items-center gap-2">
					<Switch
						id="isHomepageMain"
						checked={values.isHomepageMain}
						onCheckedChange={(value) =>
							setFieldValue("isHomepageMain", value)
						}
					/>
					<Label htmlFor="isHomepageMain">
						Hiển thị trên trang chủ
					</Label>
				</div>

				<TextField
					fullWidth
					type="number"
					label="Độ ưu tiên"
					name="homepagePriority"
					value={values.homepagePriority}
					onChange={handleChange}
					onBlur={handleBlur}
					error={
						touched.homepagePriority &&
						Boolean(errors.homepagePriority)
					}
					helperText={
						touched.homepagePriority && errors.homepagePriority
							? errors.homepagePriority
							: "Số càng cao thì càng ưu tiên hiển thị (0-100)"
					}
				/>

				<TextField
					fullWidth
					type="number"
					label="Vị trí trong carousel"
					name="carouselPosition"
					value={values.carouselPosition || ""}
					onChange={handleChange}
					onBlur={handleBlur}
					placeholder="Để trống nếu không hiển thị trong carousel"
				/>
			</div>
		</div>

		<div className="flex items-center gap-2">
			<Switch
				id="isPaidSlot"
				checked={values.isPaidSlot}
				onCheckedChange={(value) => setFieldValue("isPaidSlot", value)}
			/>
			<Label htmlFor="isPaidSlot">Đây là slot trả phí</Label>
		</div>

		{values.isPaidSlot && (
			<TextField
				fullWidth
				className="mt-4"
				type="datetime-local"
				label="Hết hạn slot trả phí"
				name="paidSlotExpiresAt"
				value={values.paidSlotExpiresAt}
				onChange={handleChange}
				onBlur={handleBlur}
				InputLabelProps={{ shrink: true }}
			/>
		)}

		<div className="">
			<div className="text-lg font-medium mb-4">Tags</div>
			<FieldArray name="tags">
				{({ push, remove }) => (
					<div className="space-y-2">
						{values.tags?.map((tag, index) => (
							<div key={index} className="flex gap-2">
								<TextField
									fullWidth
									placeholder={`Tag ${index + 1}`}
									value={tag}
									onChange={(e) =>
										setFieldValue(
											`tags.${index}`,
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
							<Plus className="mr-2" /> Thêm tag
						</Button>
					</div>
				)}
			</FieldArray>
		</div>

		<div className="">
			<TextField
				fullWidth
				multiline
				rows={4}
				label="Quy định"
				name="rules"
				value={values.rules}
				onChange={handleChange}
				onBlur={handleBlur}
				placeholder="Nhập quy định tham gia raffle"
			/>
		</div>

		<div className="">
			<TextField
				fullWidth
				multiline
				rows={4}
				label="Điều khoản & điều kiện"
				name="termsAndConditions"
				value={values.termsAndConditions}
				onChange={handleChange}
				onBlur={handleBlur}
				placeholder="Nhập điều khoản và điều kiện"
			/>
		</div>
	</div>
);

export default AdvancedSection;
