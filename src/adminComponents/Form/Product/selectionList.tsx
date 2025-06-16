import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import React from "react";

interface SelectProps {
	options: { value: string; label: string; disabled?: boolean }[];
	name: string;
	value: string;
	onChange: (name: string, value: string) => void;
	placeholder?: string;
	className?: string;
}

const SelectionList: React.FC<SelectProps> = ({
	options,
	value,
	onChange,
	placeholder,
	className,
	name,
}) => {
	const [open, setOpen] = React.useState(false);
	const [loading, setLoading] = React.useState(false);
	const [selectOptions, setSelectOptions] = React.useState<
		{
			value: string;
			label: string;
			disabled?: boolean;
		}[]
	>(options);
	const handleOpen = async () => {
		setOpen(true);
		setLoading(true);
		const filterOptions = options?.map((item) => ({
			value: item.value,
			label: item.label,
			disabled: item.disabled ?? false,
		}));
		setSelectOptions(filterOptions || []);
		setLoading(false);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<Autocomplete
			open={open}
			options={options}
			onOpen={handleOpen}
			onClose={handleClose}
			getOptionLabel={(option) => {
				return option.label;
			}}
			loading={loading}
			value={
				selectOptions.find((option) => option?.value === value) || null
			}
			onChange={(_, newValue) => onChange(name, newValue?.value || "")}
			className={className}
			noOptionsText={`Không có danh mục theo từ khóa này`}
			renderInput={(params) => (
				<TextField
					{...params}
					label={placeholder || "Select"}
					variant="outlined"
					InputProps={{
						...params.InputProps,
						endAdornment: (
							<React.Fragment>
								{loading ? (
									<CircularProgress
										color="inherit"
										size={20}
									/>
								) : null}
								{params.InputProps.endAdornment}
							</React.Fragment>
						),
					}}
				/>
			)}
			isOptionEqualToValue={(option, value) =>
				option.value === value.value
			}
		/>
	);
};

export default SelectionList;
