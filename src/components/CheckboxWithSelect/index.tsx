import React, { useState } from "react";

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

const CheckboxWithSelect: React.FC<IProps> = (props) => {
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
	const [selectedOption, setSelectedOption] = useState<string | null>(null);
	const [isChecked, setIsChecked] = useState<boolean>(false);

	const handleCheckboxChange = () => {
		setIsChecked(!isChecked);
	};

	const handleSelectChange = (
		event: React.ChangeEvent<HTMLSelectElement>
	) => {
		setSelectedOption(event.target.value);
	};

	return (
		<div>
			<label>
				<input
					type="checkbox"
					checked={isChecked}
					onChange={handleCheckboxChange}
				/>
				Enable Select
			</label>
			{isChecked && (
				<select
					value={selectedOption || ""}
					onChange={handleSelectChange}>
					<option value="" disabled>
						Select an option
					</option>
					{options.map((option, index) => (
						<option key={index} value={option}>
							{option}
						</option>
					))}
				</select>
			)}
		</div>
	);
};

export default CheckboxWithSelect;
