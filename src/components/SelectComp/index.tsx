import { Button, Input } from "@material-ui/core";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import { Check, ChevronsUpDown, Plus, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const CustomTextField = styled(TextField)(({ theme }) => ({
	"& .MuiInputBase-root": {
		minHeight: 40,
	},
}));

export interface IOptionSelection {
	value: string;
	label: string;
	index: number;
}

interface IProps {
	name: string;
	options: IOptionSelection[];
	onSelect: ({
		name,
		option,
	}: {
		name: string;
		option: IOptionSelection | null;
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
}: IProps) => {
	const [isOpen, setOpen] = useState(false);
	const [search, setSearch] = useState("");
	const [isAdding, setAdding] = useState(false);
	const [newOption, setNewOption] = useState<string>("");
	const wrapperRef = useRef<HTMLDivElement | null>(null);

	const filteredOptions = options.filter((option) =>
		option.label.toLowerCase().includes(search.toLowerCase())
	);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				wrapperRef.current &&
				!wrapperRef.current.contains(event.target as Node)
			) {
				setOpen(false);
				setAdding(false);
				// setSearch("");
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	useEffect(() => {
		const found = options.find((option) => option.value === value);
		console.log("found,", found);
		if (found) {
			setSearch(found.label);
		}
	}, [value]);

	const handleSelect = (name: string, option: IOptionSelection) => {
		onSelect({ name, option });
		setSearch(option.label);
		setOpen(false);
	};

	const handleAddNew = () => {
		if (newOption.trim()) {
			const formatNewOption = {
				value: newOption.trim(),
				label: newOption,
				index: options.length + 1,
			};
			onAddNew?.({ name, newOption: formatNewOption });
			setSearch(newOption.trim());
			setNewOption("");
			setAdding(false);
			setOpen(false);
		}
	};

	return (
		<div className="w-full relative" ref={wrapperRef}>
			<div className="relative">
				<CustomTextField
					size="small"
					label={label}
					variant="outlined"
					value={search}
					onChange={(e) => {
						setSearch(e.target.value);
						setOpen(true);
					}}
					autoComplete="off"
					onFocus={() => setOpen(true)}
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

				<button
					className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
					onClick={() => setOpen(!isOpen)}>
					<ChevronsUpDown size={16} />
				</button>
			</div>

			{isOpen && (
				<div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
					{filteredOptions.length > 0 ? (
						<ul className="py-1">
							{filteredOptions.map((option, index) => (
								<li
									key={index}
									className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
									onClick={() => handleSelect(name, option)}>
									<span>{option.label}</span>
									{search === option.label && (
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
											onClick={handleAddNew}
											disabled={!newOption.trim()}
											className="w-full capitalize">
											<Check size={16} className="mr-2" />
											Thêm
										</Button>
										<Button
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
									onClick={() => {
										if (isAddOn) {
											setAdding(true);
											setNewOption(search);
										}
									}}>
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

// Demo Component
const SearchableSelectDemo = () => {
	const [options, setOptions] = useState([
		{ value: "apple", label: "Apple", index: 0 },
	]);

	const [selectedOption, setSelectedOption] =
		useState<IOptionSelection | null>(null);

	const handleSelect = (option: IOptionSelection) => {
		setSelectedOption(option);
	};

	const handleAddNew = (newOption: IOptionSelection) => {
		setOptions([...options, newOption]);
	};

	return (
		<div className="w-full max-w-md mx-auto space-y-4">
			{/* <SearchableSelect
				label="temp"
				options={options}
				onSelect={handleSelect}
				onAddNew={handleAddNew}
				placeholder="Search fruits..."
			/> */}

			{/* {selectedOption && (
				<div className="p-4 bg-gray-50 rounded-lg">
					<p className="text-sm text-gray-600">Selected fruit:</p>
					<p className="font-medium">{selectedOption.label}</p>
				</div>
			)}
			<div className="p-4 bg-gray-50 rounded-lg">
				<p className="text-sm text-gray-600 mb-2">Available options:</p>
				<div className="flex flex-wrap gap-2">
					{options.map((option, index) => (
						<span
							key={index}
							className="px-2 py-1 bg-white border rounded-md text-sm">
							{option.label}
						</span>
					))}
				</div>
			</div> */}
		</div>
	);
};
