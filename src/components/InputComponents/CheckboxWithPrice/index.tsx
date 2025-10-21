import { EnumUnitType } from "@/interface/interface";
import { formatCurrency } from "@/utils/FormatNumber";

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
	positionPrice?: "right" | "bottom";
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
		positionPrice = "right",
	} = props;

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange && onChange({ name: name || "", value: e.target.checked });
	};

	return (
		<div
			className={`grid grid-cols-5 gap-2 items-start w-full transition-all ${
				containerClassName ?? ""
			} `}>
			<div
				className={`flex col-span-5 items-start gap-2 ${disabled ? "blur-sm !cursor-not-allowed" : "cursor-pointer"}`}>
				<input
					type="checkbox"
					id={name}
					name={name}
					checked={value}
					onChange={handleChange}
					disabled={disabled || isLoading}
					className={`accent-black !mt-[0.25rem] w-4 h-4 ${
						subLabel ? "mt-[0.125rem]" : ""
					}`}
					style={{ boxShadow: "none" }}
				/>
				<div className="flex flex-col">
					<label
						htmlFor={name}
						className={`text-sm text-gray-700 font-semibold flex gap-1  ${
							isLoading ? "opacity-60" : ""
						}`}>
						{label}
						{price ? (
							<div className="font-bold col-span-1 flex items-center justify-end text-red-400">
								(
								<span className="text-red-400 text-sm">
									+{formatCurrency(price)}
								</span>
								{unit === EnumUnitType.UNIT
									? `/${unitLabel}`
									: ""}
								)
							</div>
						) : null}
					</label>
					{subLabel ? (
						<span className="text-xs text-gray-600">
							{subLabel}
						</span>
					) : null}
				</div>
			</div>
			{/* {price && positionPrice === "right" ? (
				<div className="font-bold col-span-1 flex items-center justify-end text-red-400">
					<span className="text-red-400 text-sm">
						{formatCurrency(price)}
					</span>
					{unit === EnumUnitType.UNIT ? `/${unitLabel}` : ""}
				</div>
			) : null} */}
		</div>
	);
};

export default CheckboxWithPrice;
