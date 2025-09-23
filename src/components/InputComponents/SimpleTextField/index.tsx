import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";

const CustomTextField = styled(TextField)(({ theme }) => ({
	// "& .MuiInputBase-root": {
	// 	minHeight: 40,
	// },
}));

interface SimpleTextFieldProps {
	name: string;
	label?: string;
	placeholder?: string;
	className?: string;
	value?: string | number;
	onChange?: ({ name, value }: { name: string; value: string }) => void;
	max?: number;
	min?: number;
	note?: string;
	rows?: number;
	multiline?: boolean;
}

const SimpleTextField: React.FC<SimpleTextFieldProps> = ({
	name,
	label = "",
	placeholder = "",
	className = "",
	value = "",
	onChange,
	max,
	min,
	note,
	rows,
	multiline,
}) => {
	const [inputValue, setInputValue] = useState(value);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		let value = e.target.value;
		// Allow any value, including 0 or empty, during typing
		setInputValue(value);
		onChange && onChange({ name, value: value });
	};

	const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		let value = e.target.value;
		if (value === "" || value === "0") {
			// Allow empty or 0, do not force min
			setInputValue(value);
			onChange && onChange({ name, value: value });
			return;
		}
		let num = parseInt(value, 10);
		let newValue = value;
		if (max !== undefined && num > max) {
			newValue = max.toString();
		}
		if (min !== undefined && num < min) {
			newValue = min.toString();
		}
		if (newValue !== value) {
			setInputValue(newValue);
			onChange && onChange({ name, value: newValue });
		}
	};

	return (
		<div className="w-full relative">
			<CustomTextField
				size="medium"
				label={label}
				variant="outlined"
				value={inputValue}
				onChange={handleChange}
				onBlur={handleBlur}
				autoComplete="off"
				placeholder={placeholder}
				className={`${className} w-full shadow-none outline-none border-none focus:border-none focus:shadow-none`}
				InputLabelProps={{
					className:
						"!text-lg !bg-[#f7fafc] max-w-max leading-[1.25]",
				}}
				inputProps={{
					className: "!text-base bg-[#f7fafc]",
				}}
				name={name}
				multiline={multiline}
				rows={rows}
			/>
			{note && (
				<small className="text-sm text-gray-600 ml-1">{note}</small>
			)}
		</div>
	);
};

export default SimpleTextField;
