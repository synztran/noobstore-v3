import { getData } from "@/client";
import CategoryClient from "@/client/CategoryClient";
import { HTTP_STATUS } from "@/constants/Enums/https";
import NotifyUtils from "@/utils/NotifyUtils";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import React, { useEffect } from "react";

interface SelectProps {
	options?: { value: string; label: string }[];
	name: string;
	value: string;
	onChange: (name: string, value: string) => void;
	placeholder?: string;
	className?: string;
	isUpdate?: boolean;
}

const CategorySelection: React.FC<SelectProps> = ({
	options,
	value,
	onChange,
	placeholder,
	className,
	name,
	isUpdate = false,
}) => {
	const [open, setOpen] = React.useState(false);
	const [loading, setLoading] = React.useState(false);
	const [categoryOptions, setCategoryOptions] = React.useState<
		{
			value: string;
			label: string;
			disabled?: boolean;
		}[]
	>([]);

	const fetchCategories = async () => {
		setLoading(true);
		const resp = await CategoryClient.getAllCategory({});
		if (resp.status !== HTTP_STATUS.Ok) {
			setLoading(false);
			setCategoryOptions([]);
			NotifyUtils.error("Lỗi khi lấy danh sách danh mục");
			return;
		}
		const filterOptions = resp?.data?.map((item) => ({
			value: item.categoryId,
			label: item.categoryName,
			disabled: !item.isActive,
		})) as {
			value: string;
			label: string;
			disabled?: boolean;
		}[];
		setCategoryOptions(filterOptions || []);
		setLoading(false);
	};

	const handleOpen = async () => {
		setOpen(true);
		await fetchCategories();
	};

	const handleClose = () => {
		setOpen(false);
	};

	useEffect(() => {
		if (isUpdate) {
			(async () => {
				await fetchCategories();
			})();
		}
	}, [isUpdate]);

	return (
		<Autocomplete
			open={open}
			options={categoryOptions}
			onOpen={handleOpen}
			onClose={handleClose}
			getOptionLabel={(option) => {
				return option.label;
			}}
			loading={loading}
			value={
				categoryOptions.find((option) => option?.value === value) ||
				null
			}
			onChange={(_, newValue) => onChange(name, newValue?.value || "")}
			className={className}
			noOptionsText={`Không có danh mục theo từ khóa này`}
			loadingText={`Đang tải danh mục...`}
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

export default CategorySelection;
