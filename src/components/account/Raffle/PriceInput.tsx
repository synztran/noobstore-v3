import React, { memo, useEffect } from "react";

interface IProps {
	price?: string;
	handleUpdatePrice: (value: string) => void;
	handleClear?: () => void;
}

const VndPriceInput: React.FC<IProps> = ({
	price,
	handleUpdatePrice,
	handleClear,
}) => {
	console.log("price", price);
	// const [value, setValue] = useState<string>(price ?? "0"); // Initial value without decimals

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		let input = e.target.value.replace(/[^0-9]/g, ""); // Only allow digits

		// Remove leading zeros unless the value is "0"
		if (input.length > 1) {
			input = input.replace(/^0+/, "");
		}

		// If empty after filtering, set to "0"
		if (input === "") {
			handleUpdatePrice("0");
			return;
		}

		if (input.length > 9) return;

		handleUpdatePrice(input);
	};

	useEffect(() => {
		handleUpdatePrice(price ?? "0");
	}, [price]);

	// Format display with thousand separators (optional, but nice for VND)
	const formattedValue = Number(price).toLocaleString("vi-VN");

	return (
		<div className="flex px-2 relative justify-center">
			<input
				type="text"
				inputMode="numeric"
				value={formattedValue}
				onChange={handleChange}
				className="text-4xl font-bold text-black bg-transparent border-none outline-none px-1 min-w-[1.4ch] text-right"
				style={{
					width: `${formattedValue.length * 1.1}ch`,
					textIndent: "red",
				}} // Dynamic width
			/>
			<div className=" text-4xl font-bold text-black">₫</div>
			{price && price !== "0" ? (
				<button
					onClick={handleClear}
					className="absolute right-0 top-1/2 -translate-y-1/2 transition-colors px-2 py-1 rounded-md bg-red-400 text-white text-sm"
					type="button"
					aria-label="Clear">
					Xóa
				</button>
			) : null}
		</div>
	);
};

export default memo(VndPriceInput);
