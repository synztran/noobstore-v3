import { Label } from "@/components/ReUIComponent/Label";
import { Switch } from "@/components/ReUIComponent/Switch";
import { TextField } from "@mui/material";
import { ISectionProps } from "./interface";

const RaffleSettingsSection: React.FC<ISectionProps> = ({
	values,
	errors,
	touched,
	handleChange,
	handleBlur,
	setFieldValue,
}) => (
	<div className="space-y-6">
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
			<TextField
				fullWidth
				type="number"
				label="Giá vé (VNĐ) *"
				name="entryPrice"
				value={values.entryPrice}
				onChange={handleChange}
				onBlur={handleBlur}
				error={touched.entryPrice && Boolean(errors.entryPrice)}
				helperText={touched.entryPrice && errors.entryPrice}
			/>

			<TextField
				fullWidth
				type="number"
				label="Tổng số vé *"
				name="totalEntriesMax"
				value={values.totalEntriesMax}
				onChange={handleChange}
				onBlur={handleBlur}
				error={
					touched.totalEntriesMax && Boolean(errors.totalEntriesMax)
				}
				helperText={touched.totalEntriesMax && errors.totalEntriesMax}
			/>

			<TextField
				fullWidth
				type="number"
				label="Số vé tối đa/người *"
				name="maxEntriesPerPerson"
				value={values.maxEntriesPerPerson}
				onChange={handleChange}
				onBlur={handleBlur}
				error={
					touched.maxEntriesPerPerson &&
					Boolean(errors.maxEntriesPerPerson)
				}
				helperText={
					touched.maxEntriesPerPerson && errors.maxEntriesPerPerson
				}
			/>

			<TextField
				fullWidth
				type="number"
				label="Số giải thắng tối đa *"
				name="maxWinPerEntries"
				value={values.maxWinPerEntries}
				onChange={handleChange}
				onBlur={handleBlur}
				error={
					touched.maxWinPerEntries && Boolean(errors.maxWinPerEntries)
				}
				helperText={touched.maxWinPerEntries && errors.maxWinPerEntries}
			/>

			<TextField
				fullWidth
				type="number"
				label="Số người thắng tối đa *"
				name="maxWinners"
				value={values.maxWinners}
				onChange={handleChange}
				onBlur={handleBlur}
				error={touched.maxWinners && Boolean(errors.maxWinners)}
				helperText={touched.maxWinners && errors.maxWinners}
			/>
		</div>

		<div className="border-t pt-6 mt-6">
			<div className="text-lg font-medium mb-4">Thời gian</div>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<TextField
					fullWidth
					type="datetime-local"
					label="Ngày bắt đầu *"
					name="startAt"
					value={values.startAt}
					onChange={handleChange}
					onBlur={handleBlur}
					error={touched.startAt && Boolean(errors.startAt)}
					helperText={touched.startAt && errors.startAt}
					InputLabelProps={{ shrink: true }}
				/>

				<TextField
					fullWidth
					type="datetime-local"
					label="Ngày kết thúc *"
					name="endAt"
					value={values.endAt}
					onChange={handleChange}
					onBlur={handleBlur}
					error={touched.endAt && Boolean(errors.endAt)}
					helperText={touched.endAt && errors.endAt}
					InputLabelProps={{ shrink: true }}
				/>

				<TextField
					fullWidth
					type="datetime-local"
					label="Ngày giao hàng dự kiến"
					name="expectedDeliveryAt"
					value={values.expectedDeliveryAt}
					onChange={handleChange}
					onBlur={handleBlur}
					error={
						touched.expectedDeliveryAt &&
						Boolean(errors.expectedDeliveryAt)
					}
					helperText={
						touched.expectedDeliveryAt && errors.expectedDeliveryAt
					}
					InputLabelProps={{ shrink: true }}
				/>
			</div>
		</div>

		<div className="border-t pt-6 mt-6">
			<div className="flex items-center gap-2">
				<Switch
					id="isHaveSecretKey"
					checked={values.isHaveSecretKey}
					onCheckedChange={(value) =>
						setFieldValue("isHaveSecretKey", value)
					}
				/>
				<Label htmlFor="isHaveSecretKey">
					Yêu cầu mã bí mật để tham gia
				</Label>
			</div>

			{values.isHaveSecretKey && (
				<TextField
					fullWidth
					className="mt-4"
					label="Mã bí mật *"
					name="secretKey"
					value={values.secretKey}
					onChange={handleChange}
					onBlur={handleBlur}
					error={touched.secretKey && Boolean(errors.secretKey)}
					helperText={touched.secretKey && errors.secretKey}
					placeholder="Nhập mã bí mật"
				/>
			)}
		</div>
	</div>
);

export default RaffleSettingsSection;
