import { IProductOption } from "@/interface/interface";
import { classNames } from "@/utils/AppConfig";
import { formatCurrency } from "@/utils/FormatNumber";
import CheckIcon from "@mui/icons-material/Check";
import { Box, CircularProgress, Typography } from "@mui/material";
import { autocompleteClasses } from "@mui/material/Autocomplete";
import { styled } from "@mui/material/styles";
import useAutocomplete from "@mui/material/useAutocomplete";
import { X } from "lucide-react";
import React, { memo, useState } from "react";

export interface TOptions {
	id: string;
	name: string;
	salePrice: number;
	price: number;
}

interface IProps {
	values?: string[];
	className?: string;
	name?: string;
	setFieldValue?: (field: string, value: string[]) => void;
	options: TOptions[];
	fetching?: boolean;
}

const InputWrapper = styled("div")(({ theme }) => ({
	width: "300px",
	border: "1px solid #d9d9d9",
	backgroundColor: "#fff",
	borderRadius: "4px",
	padding: "1px",
	display: "flex",
	flexWrap: "wrap",
	...theme.applyStyles("dark", {
		borderColor: "#434343",
		backgroundColor: "#141414",
	}),
	"&:hover": {
		borderColor: "#40a9ff",
		...theme.applyStyles("dark", {
			borderColor: "#177ddc",
		}),
	},
	"&.focused": {
		borderColor: "#40a9ff",
		boxShadow: "0 0 0 2px rgb(24 144 255 / 0.2)",
		...theme.applyStyles("dark", {
			borderColor: "#177ddc",
		}),
	},
	"& input": {
		backgroundColor: "#fff",
		color: "rgba(0,0,0,.85)",
		height: "30px",
		boxSizing: "border-box",
		padding: "4px 6px",
		width: "0",
		minWidth: "30px",
		flexGrow: 1,
		border: 0,
		margin: 0,
		outline: 0,
		...theme.applyStyles("dark", {
			color: "rgba(255,255,255,0.65)",
			backgroundColor: "#141414",
		}),
	},
}));

const StyledTag = styled("div")(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	height: 24,
	margin: 2,
	lineHeight: "22px",
	backgroundColor: "#fafafa",
	border: "1px solid #e8e8e8",
	borderRadius: 2,
	boxSizing: "content-box",
	padding: "0 4px 0 10px",
	outline: 0,
	overflow: "hidden",
	...theme.applyStyles("dark", {
		backgroundColor: "rgba(255,255,255,0.08)",
		borderColor: "#303030",
	}),
	"&:focus": {
		borderColor: "#40a9ff",
		backgroundColor: "#e6f7ff",
		...theme.applyStyles("dark", {
			backgroundColor: "#003b57",
			borderColor: "#177ddc",
		}),
	},
	"& span": {
		overflow: "hidden",
		whiteSpace: "nowrap",
		textOverflow: "ellipsis",
	},
	"& svg": {
		fontSize: 12,
		cursor: "pointer",
		padding: 4,
	},
}));

const Listbox = styled("ul")(({ theme }) => ({
	width: "100%",
	margin: "2px 0 0",
	padding: 0,
	position: "absolute",
	listStyle: "none",
	backgroundColor: "#fff",
	overflow: "auto",
	maxHeight: "250px",
	borderRadius: "4px",
	boxShadow: "0 2px 8px rgb(0 0 0 / 0.15)",
	zIndex: 1,
	...theme.applyStyles("dark", {
		backgroundColor: "#141414",
	}),
	"& li": {
		padding: "5px 12px",
		display: "flex",
		"& span": {
			flexGrow: 1,
		},
		"& svg": {
			color: "transparent",
		},
	},
	"& li[aria-selected='true']": {
		backgroundColor: "#fafafa",
		fontWeight: 600,
		...theme.applyStyles("dark", {
			backgroundColor: "#2b2b2b",
		}),
		"& svg": {
			color: "#1890ff",
		},
	},
	[`& li.${autocompleteClasses.focused}`]: {
		backgroundColor: "#e6f7ff",
		cursor: "pointer",
		...theme.applyStyles("dark", {
			backgroundColor: "#003b57",
		}),
		"& svg": {
			color: "currentColor",
		},
	},
}));

const MultipleSelectionList: React.FC<IProps> = ({
	values = [],
	className = "",
	name = "",
	setFieldValue,
	options = [],
	fetching = false,
}) => {
	const {
		getRootProps,
		getInputProps,
		getTagProps,
		getListboxProps,
		getOptionProps,
		groupedOptions,
		value,
		focused,
		setAnchorEl,
	} = useAutocomplete({
		id: "customized-hook-demo",
		defaultValue: [],
		multiple: true,
		options: options || [],
		getOptionLabel: (option) => option.name || "",
		onChange: (_, newValue) => {
			const ids =
				newValue
					?.map((option) => option?.id)
					.filter((id): id is string => id !== undefined) || [];
			setFieldValue && setFieldValue(name, ids as string[]);
		},
		value: options?.filter((option) =>
			values.some((value) => value === option.id)
		),
	});

	const handleCopyToClipboard = (option: IProductOption) => {
		const optionData = `${option.id}`;
		navigator.clipboard
			.writeText(optionData)
			.then(() => {
				console.log("Option data copied to clipboard:", optionData);
			})
			.catch((err) => {
				console.error("Failed to copy option data to clipboard:", err);
			});
	};

	const handleRemoveOption = (index: string) => {
		const ids = values.filter((id): id is string => id !== index) || [];
		setFieldValue && setFieldValue(name, ids);
	};

	return (
		<Box
			component="fieldset"
			className={`w-full border border-gray-[rgba(0, 0, 0, 0.23)] rounded-sm px-2 py-2 ${className}`}>
			<Typography component="legend" className="text-[12px]">
				Tùy chọn option loại sản phẩm
			</Typography>
			<div {...getRootProps()}>
				<InputWrapper
					ref={setAnchorEl}
					className={classNames(focused ? "focused" : "", "w-full")}>
					{fetching ? (
						<div className="flex items-center justify-center h-full">
							<CircularProgress />
						</div>
					) : (
						<>
							{value.map((option, index) => (
								<StyledTag
									{...getTagProps({ index })}
									key={index}>
									<span
										className="cursor-pointer"
										onClick={() =>
											handleCopyToClipboard(option)
										}>
										{option.name} - {option?.id} (+
										{formatCurrency(
											option.salePrice ||
												option.price ||
												0
										)}
										)
									</span>
									<X
										onClick={(e) => {
											handleRemoveOption(String(index));
											getTagProps({ index }).onDelete(e);
										}}
									/>
								</StyledTag>
							))}
							<input {...getInputProps()} className="opacity-0" />
						</>
					)}
				</InputWrapper>
			</div>
			{groupedOptions?.length > 0 && (
				<Listbox {...getListboxProps()} className="z-10">
					{groupedOptions
						.filter(
							(option): option is TOptions => "name" in option
						)
						.map((option, index) => (
							<li
								{...getOptionProps({ option, index })}
								key={index}>
								<span>
									{option.name}
									&nbsp; - {option?.id}
									&nbsp; (
									{"+" +
										formatCurrency(
											option.salePrice ||
												option.price ||
												0
										)}
									)
								</span>
								<CheckIcon fontSize="small" />
							</li>
						))}
				</Listbox>
			)}
			<span className="text-[10px] italic text-gray-500">
				ấn vào option để copy id
			</span>
		</Box>
	);
};

export default memo(MultipleSelectionList);
