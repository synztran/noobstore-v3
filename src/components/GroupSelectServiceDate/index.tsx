import { formatCurrency } from "@/utils/FormatNumber";
import useServices, { useServiceAction } from "@/zustand/useServices";
import {
	FormControl,
	FormControlLabel,
	Radio,
	RadioGroup,
} from "@material-ui/core";
import React from "react";

interface IProps {
	options?: {
		value: number;
		name: string;
		subName: string;
		price: number;
		dateTime: string;
		// isSelected: boolean;
		isActive: boolean;
	}[];
}

const defaultOptions = [
	{
		value: 1,
		name: "Gói dịch vụ cơ bản",
		subName: "Sub Option 1",
		price: 0,
		dateTime: "5-7 ngày",
		// isSelected: false,
		isActive: true,
	},
	{
		value: 2,
		name: "Gói dịch vụ đặc biệt",
		subName: "Sub Option 2",
		price: 200,
		dateTime: "1-3 ngày",
		// isSelected: false,
		isActive: true,
	},
];

const GroupSelectServiceDate = (props: IProps) => {
	// const [selecedOption, setSelectedOption] = React.useState(1);
	const { selectedOpt } = useServices();
	const { updateSelectedOpt } = useServiceAction();
	const { options } = props || {};
	return (
		<div className={`w-full relative`}>
			<FormControl
				className={`grid grid-cols-${defaultOptions?.length} gap-6`}>
				{defaultOptions.map((option, index) => (
					<RadioGroup
						key={index}
						aria-labelledby="demo-radio-buttons-group-label"
						defaultValue={defaultOptions?.[0]?.value}
						defaultChecked={option.value === selectedOpt?.value}
						name="radio-buttons-group">
						<Wrapper
							option={option}
							key={index}
							// onClick={() => updateSelectedOpt(option)}
						>
							<FormControlLabel
								checked={option.value === selectedOpt?.value}
								value={option.value}
								control={<Radio />}
								label=""
								classes={{
									root: "mr-0",
								}}
								onChange={() => {
									updateSelectedOpt(option);
								}}
							/>
						</Wrapper>
					</RadioGroup>
				))}
			</FormControl>
		</div>
	);
};

export default GroupSelectServiceDate;

const Wrapper = ({
	children,
	option,
	onClick,
}: {
	children: React.ReactNode;
	option: {
		value: number;
		name: string;
		subName: string;
		price: number;
		dateTime: string;
		isActive: boolean;
	};
	onClick?: () => void;
}) => {
	const { selectedOpt } = useServices();
	const { updateSelectedOpt } = useServiceAction();
	return (
		<div
			className={`w-full min-h-[160px] rounded-xl p-4 border-2 shadow-lg bg-gray-100 flex flex-col justify-between cursor-pointer hover:border-blue-500 hover:shadow-lg ${
				option.value === selectedOpt?.value ? "border-blue-700" : ""
			}`}
			onClick={() => updateSelectedOpt(option)}>
			<div className="flex justify-between items-center">
				<span className="text-lg font-bold">{option.name}</span>
				{children}
			</div>
			<div className="text-sm">{option.subName}</div>
			<div className="flex justify-between items-end mt-auto">
				<div className="flex flex-col">
					<span>Dự kiến</span>
					<span className="font-bold">{option.dateTime}</span>
				</div>
				<span className="font-bold text-2xl">
					{option.price > 0 ? formatCurrency(option.price) : ""}
				</span>
			</div>
		</div>
	);
};
