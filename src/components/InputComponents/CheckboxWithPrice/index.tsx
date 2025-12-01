import { EnumUnitType } from "@/interface/interface";
import { formatCurrency } from "@/utils/FormatNumber";
import { IStabilizerPack, IStabilizerWire } from "@/zustand/useServices";
import { useMemo } from "react";

interface IProps {
	value: boolean;
	label: string;
	subLabel?: string;
	price?: number; // unit price
	onChange?: ({ name, value }: { name: string; value: boolean }) => void;
	name?: string;
	containerClassName?: string;
	disabled?: boolean;
	isLoading?: boolean;
	unit?: EnumUnitType;
	unitLabel?: string;
	positionPrice?: "right" | "bottom";
	multipleUnitPrice?: boolean;
	unitPrices?: Record<string, number>;
	wires?: IStabilizerWire[];
	packs?: IStabilizerPack[];
	totalPrice?: number; // total price = unit price * quantity
}

const CheckboxWithPrice = (props: IProps) => {
	const {
		value,
		label,
		subLabel,
		price = 0,
		onChange,
		name,
		containerClassName,
		disabled,
		isLoading,
		unit,
		unitLabel,
		positionPrice = "right",
		multipleUnitPrice = false,
		unitPrices,
		wires = [],
		packs = [],
		totalPrice = 0,
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
						className={`text-sm text-gray-700 font-semibold flex gap-1 cursor-pointer items-center ${
							isLoading ? "opacity-60" : ""
						}`}>
						{label}
						<div className="font-bold col-span-1 flex items-center justify-end text-red-400">
							(
							<span className="text-red-400 text-sm">
								+{formatCurrency(price)}
							</span>
							{unit === EnumUnitType.UNIT ? `/${unitLabel}` : ""})
							{totalPrice ? (
								<span className="text-sm text-red-400 ml-1">
									~ {formatCurrency(totalPrice)}
								</span>
							) : null}
						</div>
					</label>
					{subLabel ? (
						<label
							htmlFor={name}
							className="text-xs text-gray-600 cursor-pointer">
							{subLabel}
						</label>
					) : null}
					{/* {unitPrices && multipleUnitPrice ? (
						<div className="flex flex-col justify-start text-red-400 text-sm mt-1">
							<div className="flex items-center gap-2">
								<span className="capitalize">{unitLabel}</span>
								<span className="text-red-400">
									(+{formatCurrency(price || 0)})
								</span>
							</div>
							{displayUnitPrice(unitPrices)}
						</div>
					) : null} */}
				</div>
			</div>
		</div>
	);
};

export default CheckboxWithPrice;

const displayUnitPrice = (unitPrices: Record<string, number>) => {
	if (!unitPrices) return null;
	const priceGroups = new Map<number, Set<string>>();

	Object.entries(unitPrices ?? {}).forEach(([key, value]) => {
		const price = Number(value) || 0;
		const group = priceGroups.get(price) ?? new Set<string>();
		group.add(key);
		priceGroups.set(price, group);
	});

	if (!priceGroups.size) return null;

	const formatted = Array.from(priceGroups.entries()).map(([price, keys]) => {
		const keyLabel = Array.from(keys).join("/");
		return `${keyLabel} <span class="text-red-400">(+${formatCurrency(price)})</span>`;
	});

	return (
		<div
			className="text-red-black text-sm"
			dangerouslySetInnerHTML={{ __html: formatted.join("<br/>") }}
		/>
	);
};
