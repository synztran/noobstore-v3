import { formatCurrency } from "@/utils/FormatNumber";
import Checkbox from "@mui/material/Checkbox";

interface IProps {
	value: boolean;
	label: string;
	subLabel?: string;
	price: number;
	onChange?: ({ name, value }: { name: string; value: boolean }) => void;
	children?: React.ReactNode;
	name: string;
	containerClassName?: string;
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
	} = props;
	return (
		<div className={`flex flex-col gap-2 items-start w-full`}>
			<div
				className={`flex gap-2 items-center w-full ${
					containerClassName ?? ""
				}`}>
				<div
					className={`flex ${
						subLabel ? "items-start" : "items-center"
					} gap-2`}>
					<Checkbox
						checked={value}
						onChange={(e) => {
							onChange &&
								onChange({ name, value: e.target.checked });
						}}
						className={`!p-0 ${subLabel ? "!mt-[0.125rem]" : ""} `}
						size="small"
					/>
					<div className="flex flex-col">
						<label htmlFor={name} className="text-sm text-gray-700">
							{label}
						</label>
						{subLabel ? (
							<span className="text-xs text-gray-500">
								{subLabel}
							</span>
						) : null}
					</div>
				</div>
				<div className="text-base font-bold">
					{formatCurrency(price)}
				</div>
			</div>
			{value ? children : null}
		</div>
	);
};

export default CheckboxWithPrice;
