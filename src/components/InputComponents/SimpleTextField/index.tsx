import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";

const CustomTextField = styled(TextField)(({ theme }) => ({
	"& .MuiInputBase-root": {
		minHeight: 40,
	},
}));

interface SimpleTextFieldProps {
	name: string;
	label?: string;
	placeholder?: string;
	className?: string;
	value?: string;
	onChange?: ({ name, value }: { name: string; value: string }) => void;
}

const SimpleTextField: React.FC<SimpleTextFieldProps> = ({
	name,
	label = "",
	placeholder = "",
	className = "",
	value = "",
	onChange,
}) => {
	const [inputValue, setInputValue] = useState(value);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
		onChange && onChange({ name, value: e.target.value });
	};

	return (
		<div className="w-full relative">
			<CustomTextField
				size="small"
				label={label}
				variant="outlined"
				value={inputValue}
				onChange={handleChange}
				autoComplete="off"
				placeholder={placeholder}
				className={`${className} w-full shadow-none outline-none border-none focus:border-none focus:shadow-none`}
				InputLabelProps={{
					className: "!text-sm !bg-[#f7fafc] max-w-max",
				}}
				inputProps={{
					className: "!text-sm bg-[#f7fafc]",
				}}
				name={name}
			/>
		</div>
	);
};

export default SimpleTextField;
