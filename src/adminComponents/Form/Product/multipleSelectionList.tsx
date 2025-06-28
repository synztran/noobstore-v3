import { IProductOption } from "@/interface/interface";
import { classNames } from "@/utils/AppConfig";
import { formatCurrency } from "@/utils/FormatNumber";
import CheckIcon from "@mui/icons-material/Check";
import { Box, CircularProgress, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { X } from "lucide-react";
import React, { memo, useRef, useState } from "react";

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
	disabled?: boolean;
}

const InputWrapper = styled("div")(({ theme }) => ({
	width: "100%",
	border: "1px solid #d9d9d9",
	backgroundColor: "#fff",
	borderRadius: "4px",
	padding: "1px",
	display: "flex",
	flexWrap: "wrap",
	position: "relative",
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
		width: "100%",
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
		alignItems: "center",
		cursor: "pointer",
		"& span": {
			flexGrow: 1,
		},
		"& svg": {
			color: "transparent",
		},
	},
	"& li.selected": {
		backgroundColor: "#fafafa",
		fontWeight: 600,
		...theme.applyStyles("dark", {
			backgroundColor: "#2b2b2b",
		}),
		"& svg": {
			color: "#1890ff",
		},
	},
	"& li.focused": {
		backgroundColor: "#e6f7ff",
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
	disabled = false,
}) => {
	const [inputValue, setInputValue] = useState("");
	const [isOpen, setIsOpen] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const selectedOptions = options.filter(
		(option) => values?.includes(option.id)
	);
	const filteredOptions = options.filter(
		(option) =>
			option.name.toLowerCase().includes(inputValue.toLowerCase()) &&
			!values.includes(option.id)
	);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
		setIsOpen(true);
	};

	const handleSelectOption = (option: TOptions) => {
		const newValues = [...values, option.id];
		setFieldValue && setFieldValue(name, newValues);
		setInputValue("");
		setIsOpen(false);
		if (inputRef.current) inputRef.current.focus();
	};

	const handleRemoveOption = (id: string) => {
		const newValues = (values || []).filter((v) => v !== id);
		setFieldValue && setFieldValue(name, newValues);
	};

	const handleInputFocus = () => {
		setIsOpen(true);
	};

	const handleInputBlur = (e: React.FocusEvent<HTMLDivElement>) => {
		if (!e.currentTarget.contains(e.relatedTarget as Node)) {
			setTimeout(() => setIsOpen(false), 150);
		}
	};

	const handleCopyToClipboard = (option: IProductOption) => {
		navigator.clipboard.writeText(option.id || "");
	};

	return (
		<Box
			disabled={disabled}
			component="fieldset"
			className={`w-full border border-gray-[rgba(0, 0, 0, 0.23)] rounded-sm px-2 py-2 relative ${className}`}>
			<Typography component="legend" className="text-[12px]">
				Tùy chọn option loại sản phẩm
			</Typography>
			<div tabIndex={-1} onBlur={handleInputBlur} className="relative">
				<InputWrapper
					className={classNames(isOpen ? "focused" : "", "w-full")}>
					{fetching ? (
						<div className="flex items-center justify-center h-full">
							<CircularProgress />
						</div>
					) : (
						<>
							{selectedOptions
								.filter(
									(option) => typeof option.id === "string"
								)
								.map((option) => (
									<StyledTag key={option.id}>
										<span
											className="cursor-pointer"
											onClick={() =>
												handleCopyToClipboard(option)
											}>
											{option.name} - {option.id} (+
											{formatCurrency(
												option.salePrice ||
													option.price ||
													0
											)}
											)
										</span>
										<X
											onClick={() => {
												if (option.id)
													handleRemoveOption(
														option.id
													);
											}}
										/>
									</StyledTag>
								))}
							<input
								type="text"
								ref={inputRef}
								value={inputValue}
								onChange={handleInputChange}
								onFocus={handleInputFocus}
								placeholder={
									disabled
										? "Bạn chưa chọn danh mục sản phẩm"
										: "Tìm kiếm option"
								}
								className="w-full outline-none"
							/>
						</>
					)}
				</InputWrapper>
			</div>
			{isOpen && filteredOptions.length > 0 && (
				<Listbox className="!z-2 relative w-full mt-2">
					{filteredOptions.map((option) => (
						<li
							key={option.id}
							onMouseDown={() => handleSelectOption(option)}
							className="flex items-center hover:bg-gray-100 cursor-pointer">
							<span>
								{option.name} - {option.id} (+
								{formatCurrency(
									option.salePrice || option.price || 0
								)}
								)
							</span>
							<CheckIcon fontSize="small" />
						</li>
					))}
				</Listbox>
			)}
			<span className="text-[11px] italic text-gray-600">
				ấn vào option để copy id
			</span>
		</Box>
	);
};

export default memo(MultipleSelectionList);
