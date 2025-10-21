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
	onChange?: ({
		name,
		value,
		parentName,
	}: {
		name: string;
		value: string | number;
		parentName?: string;
	}) => void;
	onChangeWithoutNameValue?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	max?: number;
	min?: number;
	note?: string;
	rows?: number;
	multiline?: boolean;
	disabled?: boolean;
	type?: "text" | "number";
	parentName?: string;
	currentAmount?: number;
}

const SimpleTextField: React.FC<SimpleTextFieldProps> = ({
	name,
	label = "",
	placeholder = "",
	className = "",
	value = "",
	onChange,
	onChangeWithoutNameValue,
	max,
	min,
	note,
	rows,
	multiline,
	disabled = false,
	type = "text",
	parentName,
	currentAmount,
}) => {
	const [inputValue, setInputValue] = useState(value);

	const debounceRef = React.useRef<number | undefined>(undefined);
	const DEBOUNCE_DELAY = 1000;

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (type === "number") {
			const regex = /^-?\d*$/;
			if (!regex.test(e.target.value)) {
				return;
			}
		}
		const value = parseInt(e.target.value, 10) || 0;
		console.log("value", value);
		console.log("max", max);
		console.log("currentAmount", currentAmount);
		if (max && currentAmount && value > max - currentAmount) {
			const newValue = max - currentAmount >= 0 ? max - currentAmount : 0;
			console.log("newValue", newValue);
			setInputValue(newValue);
			return;
		}
		setInputValue(value);

		if (debounceRef.current) {
			clearTimeout(debounceRef.current);
		}

		debounceRef.current = window.setTimeout(() => {
			onChange &&
				onChange({
					name,
					value: type === "number" ? value : value,
					parentName,
				});
			onChangeWithoutNameValue && onChangeWithoutNameValue(e);
		}, DEBOUNCE_DELAY);
	};

	React.useEffect(() => {
		return () => {
			if (debounceRef.current) {
				clearTimeout(debounceRef.current);
			}
		};
	}, []);

	const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		let value = e.target.value;
		if (value === "" || value === "0") {
			// Allow empty or 0, do not force min
			setInputValue(value);
			onChange && onChange({ name, value: value, parentName });
			onChangeWithoutNameValue && onChangeWithoutNameValue(e);
			return;
		}
		let num = parseInt(value, 10);
		let newValue = value;
		console.log("newValue", newValue, max, currentAmount);
		if (max !== undefined && num > max && currentAmount) {
			newValue =
				max - currentAmount >= 0
					? (max - currentAmount).toString()
					: "0";
		}
		if (min !== undefined && num < min) {
			newValue = min.toString();
		}
		if (newValue !== value) {
			setInputValue(newValue);
			onChange && onChange({ name, value: newValue, parentName });
			onChangeWithoutNameValue && onChangeWithoutNameValue(e);
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
						"!text-lg max-w-max leading-[1.25] !bg-transparent",
				}}
				inputProps={{
					className: "!text-base bg-[#f7fafc]",
				}}
				name={name}
				multiline={multiline}
				rows={rows}
				disabled={disabled}
			/>
			{note && (
				<small className="text-sm text-gray-600 ml-1">{note}</small>
			)}
		</div>
	);
};

export default SimpleTextField;
