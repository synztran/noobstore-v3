import { EnumUnitType } from "@/interface/interface";
import { formatCurrency } from "@/utils/FormatNumber";
import { CircularProgress } from "@material-ui/core";

interface IProps {
	value: boolean;
	label: string;
	subLabel?: string;
	price?: number;
	onChange?: ({ name, value }: { name: string; value: boolean }) => void;
	children?: React.ReactNode;
	name?: string;
	containerClassName?: string;
	disabled?: boolean;
	isLoading?: boolean;
	unit?: EnumUnitType;
	unitLabel?: string;
}

const CheckboxWithPrice = (props: IProps) => {
	const {
		value,
		label,
		subLabel,
		price,
		children,
		onChange,
		name,
		containerClassName,
		disabled,
		isLoading,
		unit,
		unitLabel,
	} = props;

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange && onChange({ name: name || "", value: e.target.checked });
	};

	return (
		<div
			className={`grid grid-cols-5 gap-2 items-start w-full ${
				containerClassName ?? ""
			}`}>
			<div className={`flex col-span-4 items-start gap-2`}>
				<input
					type="checkbox"
					id={name}
					name={name}
					checked={value}
					onChange={handleChange}
					disabled={disabled || isLoading}
					className={`accent-black !my-[0.175rem] w-4 h-4 cursor-pointer ${
						subLabel ? "mt-[0.125rem]" : ""
					}`}
					style={{
						boxShadow: "none",
					}}
				/>
				<div className="flex flex-col">
					<label
						htmlFor={name}
						className={`text-base text-gray-700 cursor-pointer font-semibold ${
							isLoading ? "opacity-60" : ""
						}`}>
						{label}
					</label>
					{subLabel ? (
						<span className="text-sm text-gray-600">
							{subLabel}
						</span>
					) : null}
				</div>
			</div>
			{price ? (
				<div className="text-lg font-bold col-span-1 flex items-center justify-end">
					{formatCurrency(price)}
					{unit === EnumUnitType.UNIT ? `/${unitLabel}` : ""}
				</div>
			) : null}
		</div>
	);
};

export default CheckboxWithPrice;
