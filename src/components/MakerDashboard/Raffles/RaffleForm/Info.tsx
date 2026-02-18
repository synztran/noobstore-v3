import { Label } from "@/components/ReUIComponent/Label";
import { Switch } from "@/components/ReUIComponent/Switch";
import { EnumRaffleType } from "@/interface/Client/Raffle";
import {
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	TextField,
} from "@mui/material";
import { ISectionProps } from "./interface";
import { useDebouncedField } from "./useDebouncedField";

const BasicInfoSection: React.FC<ISectionProps> = ({
	values,
	errors,
	touched,
	handleChange,
	handleBlur,
	setFieldValue,
}) => {
	const titleField = useDebouncedField("title", values.title, setFieldValue);
	const descriptionField = useDebouncedField(
		"description",
		values.description,
		setFieldValue,
	);

	return (
		<div className="flex flex-col gap-4">
			<TextField
				fullWidth
				label="Tiêu đề raffle *"
				name="title"
				value={titleField.value}
				onChange={titleField.onChange}
				onBlur={handleBlur}
				error={touched.title && Boolean(errors.title)}
				helperText={touched.title && errors.title}
				placeholder="Nhập tiêu đề thu hút cho raffle của bạn"
			/>

			<TextField
				fullWidth
				multiline
				rows={4}
				label="Mô tả"
				name="description"
				value={descriptionField.value}
				onChange={descriptionField.onChange}
				onBlur={handleBlur}
				error={touched.description && Boolean(errors.description)}
				helperText={touched.description && errors.description}
				placeholder="Mô tả chi tiết về raffle, sản phẩm và cách thức tham gia"
			/>

			<FormControl fullWidth>
				<InputLabel>Loại raffle *</InputLabel>
				<Select
					name="raffleType"
					value={values.raffleType}
					onChange={handleChange}
					label="Loại raffle *">
					<MenuItem value={EnumRaffleType.RAFFLE}>
						Raffle (Quay số)
					</MenuItem>
					<MenuItem value={EnumRaffleType.SALE}>
						Sale (Bán trực tiếp)
					</MenuItem>
				</Select>
			</FormControl>

			<div className="flex items-center gap-4">
				<div className="flex items-center gap-2">
					<Switch
						id="isPublic"
						checked={values.isPublic}
						onCheckedChange={(value) =>
							setFieldValue("isPublic", value)
						}
					/>
					<Label htmlFor="isPublic">Công khai</Label>
				</div>
				<div className="flex items-center gap-2">
					<Switch
						id="featured"
						checked={values.featured}
						onCheckedChange={(value) =>
							setFieldValue("featured", value)
						}
					/>
					<Label htmlFor="featured">Nổi bật</Label>
				</div>
				<div className="flex items-center gap-2">
					<Switch
						id="requiresPayment"
						checked={values.requiresPayment}
						onCheckedChange={(value) =>
							setFieldValue("requiresPayment", value)
						}
					/>
					<Label htmlFor="requiresPayment">Yêu cầu thanh toán</Label>
				</div>
			</div>
		</div>
	);
};

export default BasicInfoSection;
