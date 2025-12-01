import { formatCurrency } from "@/utils/FormatNumber";
import { Button, CircularProgress, Input } from "@material-ui/core";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import { Check, ChevronsUpDown, Plus, X } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

const CustomTextField = styled(TextField)(({ theme }) => ({
	// "& .MuiInputBase-root": {
	// 	minHeight: 40,
	// },
}));

export interface IOptionSelection {
	value: string;
	label: string;
	id: number;
	price?: number;
	description?: string;
}

interface IProps {
	name: string;
	options: IOptionSelection[];
	onSelect: ({
		name,
		option,
		parentName,
	}: {
		name: string;
		option: IOptionSelection | null;
		parentName?: string;
	}) => void;
	onAddNew?: ({
		name,
		newOption,
	}: {
		name: string;
		newOption: IOptionSelection;
	}) => void;
	placeholder?: string;
	className?: string;
	label: string;
	isAddOn?: boolean;
	value?: string | null;
	isLoading?: boolean;
	hidePrice?: boolean;
	note?: string;
	errorMessage?: string;
	parentName?: string;
}

// SearchableSelect Component
const SearchableSelect: React.FC<IProps> = ({
	options = [],
	onSelect,
	onAddNew,
	placeholder = "Search or add new...",
	className = "",
	label = "",
	name = "",
	isAddOn = false,
	value = null,
	isLoading = false,
	hidePrice = false,
	note = "",
	errorMessage = "",
	parentName = "",
}: IProps) => {
	const [isOpen, setOpen] = useState(false);
	const [search, setSearch] = useState("");
	const [isAdding, setAdding] = useState(false);
	const [newOption, setNewOption] = useState<string>("");
	const wrapperRef = useRef<HTMLDivElement | null>(null);

	// Track the value at the time of onBlur
	const valueRef = useRef<string | null>(value);

	const ignoreBlurRef = useRef(false);

	const filteredOptions = options.filter((option) => {
		if (search === "") {
			return option.label.toLowerCase().includes(search.toLowerCase());
		}
		// Remove price info from label for search matching
		const labelWithoutPrice = search.replace(
			/\s*\(\s*\+\s*[\d.,]+đ\s*\)\s*$/i,
			""
		);

		return option.label
			.toLocaleLowerCase()
			.includes(labelWithoutPrice.toLowerCase());
	});

	// Helper to get the display string for the current value
	const getDisplayValue = useCallback(
		(val: string | null) => {
			const found = options.find((option) => option.value === val);
			if (found) {
				if (found.price && !hidePrice) {
					return (
						found.label + ` (+${formatCurrency(found.price || 0)})`
					);
				} else {
					return found.label;
				}
			}
			return "";
		},
		[options, hidePrice, search]
	);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				wrapperRef.current &&
				!wrapperRef.current.contains(event.target as Node)
			) {
				setOpen(false);
				setAdding(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	// Fix: When value or options change, update search to reflect the selected value
	useEffect(() => {
		setSearch(getDisplayValue(value));
		valueRef.current = value; // keep valueRef in sync with value
	}, [value, options]);

	const handleSelect = (
		name: string,
		option: IOptionSelection,
		parentName: string
	) => {
		ignoreBlurRef.current = true; // Prevent blur logic
		onSelect({ name, option, parentName });
		// Update valueRef to the selected value immediately
		valueRef.current = option.value;
		setOpen(false);
		setAdding(false);
		setTimeout(() => {
			ignoreBlurRef.current = false;
		}, 0);
	};

	const handleAddNew = () => {
		if (newOption.trim()) {
			ignoreBlurRef.current = true; // Prevent blur logic
			const formatNewOption = {
				value: newOption.trim(),
				label: newOption,
				id: options.length + 1,
			};
			onAddNew?.({ name, newOption: formatNewOption });
			setNewOption("");
			setAdding(false);
			setOpen(false);
			setTimeout(() => {
				ignoreBlurRef.current = false;
			}, 0);
		}
	};

	// Handle onBlur: if not selecting a new option, reset to current value
	const handleBlur = useCallback(
		(e: React.FocusEvent<HTMLInputElement>) => {
			const currentValue = valueRef.current;
			setTimeout(() => {
				if (ignoreBlurRef.current) return;
				if (!wrapperRef.current?.contains(document.activeElement)) {
					setSearch(getDisplayValue(currentValue));
					setOpen(false);
					setAdding(false);
				}
			}, 100);
		},
		[getDisplayValue]
	);

	const handleClearSearch = () => {
		setSearch("");
		onSelect({ name: "", option: null, parentName: "" });
		setOpen(true);
	};

	return (
		<div className="w-full relative" ref={wrapperRef}>
			<div className="relative">
				<CustomTextField
					size="medium"
					label={label}
					variant="outlined"
					value={search}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
						setSearch(e.target.value);
						setOpen(true);
					}}
					autoComplete="off"
					onFocus={() => setOpen(true)}
					// onBlur={handleBlur}
					placeholder={placeholder}
					className={`${className} w-full shadow-none outline-none border-none focus:border-none focus:shadow-none ${
						errorMessage ? "!border-2 !border-red-600" : ""
					}`}
					InputLabelProps={{
						className:
							"!text-lg max-w-max leading-[1.25] !bg-transparent",
					}}
					inputProps={{ className: "!text-base" }}
					name={name}
					disabled={isLoading}
				/>
				{value ? (
					<button
						onMouseDown={(e) => {
							e.preventDefault();
						}}
						onClick={() => {
							handleClearSearch();
							const input =
								wrapperRef.current?.querySelector("input");
							if (input instanceof HTMLElement) {
								input.focus();
							}
						}}
						className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 hover:scale-105 transition-all duration-150 hover:bg-gray-200 rounded-full p-1">
						<X
							size={16}
							className="text-gray-400 hover:text-gray-600"
						/>
					</button>
				) : null}

				<button
					className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
					onClick={() => setOpen(!isOpen)}
					disabled={isLoading}
					type="button">
					<ChevronsUpDown size={16} />
				</button>
				{isLoading && (
					<div className="absolute right-8 top-1/2 -translate-y-1/2">
						<CircularProgress size={18} thickness={5} />
					</div>
				)}
			</div>
			{errorMessage ? (
				<small className="text-red-500">{errorMessage}</small>
			) : null}
			{note ? (
				<small className="text-sm text-gray-500 ml-2">{note}</small>
			) : null}
			{isOpen && (
				<div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
					{isLoading ? (
						<div className="flex items-center justify-center py-6">
							<CircularProgress size={28} thickness={5} />
						</div>
					) : filteredOptions.length > 0 ? (
						<ul className="py-1">
							{filteredOptions.map((option, index) => (
								<li
									key={index}
									className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
									onMouseDown={(e) => e.preventDefault()} // Prevent blur before click
									onClick={() =>
										handleSelect(name, option, parentName)
									}>
									<div className="flex gap-2 items-center">
										{option.label}
										{option?.price && !hidePrice ? (
											<span className="text-blue-600">
												(+{formatCurrency(option.price)}
												)
											</span>
										) : null}
									</div>
									{value === option.value && !hidePrice && (
										<Check
											size={16}
											className="text-green-500"
										/>
									)}
								</li>
							))}
						</ul>
					) : (
						<div className="p-2">
							{isAdding ? (
								<div className="space-y-2">
									<Input
										autoFocus
										value={newOption}
										onChange={(e) =>
											setNewOption(e.target.value)
										}
										placeholder="Nhập vào tên phím mới..."
										className="w-full focus:border-gray-400 focus:border-b-2"
									/>
									<div className="flex gap-2">
										<Button
											onMouseDown={(e) =>
												e.preventDefault()
											} // Prevent blur before click
											onClick={handleAddNew}
											disabled={!newOption.trim()}
											className="w-full capitalize">
											<Check size={16} className="mr-2" />
											Thêm
										</Button>
										<Button
											onMouseDown={(e) =>
												e.preventDefault()
											} // Prevent blur before click
											onClick={() => {
												setAdding(false);
												setNewOption("");
											}}
											className="w-full capitalize">
											<X size={16} className="mr-2" />
											Hủy
										</Button>
									</div>
								</div>
							) : (
								<Button
									className={`w-full justify-start text-gray-600 capitalize`}
									onMouseDown={(e) => e.preventDefault()} // Prevent blur before click
									onClick={() => {
										if (isAddOn) {
											setAdding(true);
											setNewOption(search);
										}
									}}
									disabled={isLoading}>
									{isAddOn ? (
										<>
											<Plus size={16} className="mr-2" />
											Thêm "{search}"
										</>
									) : (
										<span>
											Không tìm thấy kết quả với "{search}
											"
										</span>
									)}
								</Button>
							)}
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default SearchableSelect;
