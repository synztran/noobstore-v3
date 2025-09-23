import React, { useState } from "react";
import { TextField, Button, Chip } from "@mui/material";
import { CheckCircle, XCircle } from "lucide-react";
import { SUGGESTED_DISCOUNT_CODES } from "@/constants";
import useServices, { useServiceAction } from "@/zustand/useServices";

interface IProps {}

const DiscountBlock: React.FC<IProps> = () => {
	const { discountCodes } = useServices();
	const { updateDiscount } = useServiceAction();
	const [input, setInput] = useState("");
	const [applied, setApplied] = useState<string[]>(discountCodes || []);
	const [localError, setLocalError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	const hasSuggested =
		Array.isArray(SUGGESTED_DISCOUNT_CODES) &&
		SUGGESTED_DISCOUNT_CODES.length > 0;

	const handleApply = () => {
		const code = input.trim();
		if (!code) {
			setLocalError("Vui lòng nhập mã giảm giá");
			setSuccess(false);
			return;
		}
		if (hasSuggested) {
			const found = SUGGESTED_DISCOUNT_CODES.find(
				(s) => s.code.toLowerCase() === code.toLowerCase()
			);
			if (found) {
				setApplied([code.toUpperCase()]);
				setLocalError(null);
				setSuccess(true);
				updateDiscount([code.toUpperCase()]);
			} else {
				setLocalError("Mã giảm giá không hợp lệ hoặc đã hết hạn");
				setSuccess(false);
			}
		} else {
			// No suggestion list, accept any code
			setApplied([code.toUpperCase()]);
			setLocalError(null);
			setSuccess(true);
			updateDiscount([code.toUpperCase()]);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInput(e.target.value);
		setLocalError(null);
		setSuccess(false);
	};

	const handleSelectSuggested = (code: string) => {
		setInput(code);
		setLocalError(null);
		setSuccess(false);
	};

	const handleRemove = () => {
		setApplied([]);
		setInput("");
		setSuccess(false);
		setLocalError(null);
		updateDiscount([]);
	};

	return (
		<div className="flex flex-col gap-2">
			<label className="font-semibold text-base">Mã giảm giá</label>
			<div className="flex gap-2 items-center">
				<TextField
					size="small"
					variant="outlined"
					placeholder="Nhập mã giảm giá"
					value={input}
					onChange={handleInputChange}
					disabled={applied.length > 0}
					className="flex-1 h-[40px]"
					InputProps={{
						className: "!min-h-[40px]",
					}}
				/>
				<Button
					variant={applied.length > 0 ? "outlined" : "contained"}
					onClick={applied.length > 0 ? handleRemove : handleApply}
					disabled={applied.length > 0 ? false : !input.trim()}
					className="h-full rounded-md bg-red-400 hover:bg-red-500 text-white"
					startIcon={
						applied.length > 0 ? (
							<XCircle size={18} className="stroke-white" />
						) : (
							<CheckCircle size={18} className="stroke-white" />
						)
					}>
					{applied.length > 0 ? "Xóa" : "Áp dụng"}
				</Button>
			</div>
			{localError ? (
				<div className="text-red-600 text-sm">{localError}</div>
			) : null}
			{success && applied.length > 0 && (
				<div className="flex flex-col gap-1">
					<div className="text-green-700 text-sm flex items-center gap-1">
						<CheckCircle size={16} className="stroke-green-700" />{" "}
						Đã áp dụng mã <b>{applied.join(", ")}</b>
					</div>
				</div>
			)}
			{!applied.length && hasSuggested && (
				<div className="flex flex-wrap gap-2 mt-4">
					{SUGGESTED_DISCOUNT_CODES.map((s) => (
						<Chip
							key={s.code}
							label={
								<span>
									<b>{s.code}</b>
									{s.description ? ` - ${s.description}` : ""}
								</span>
							}
							variant="outlined"
							color="primary"
							onClick={() => handleSelectSuggested(s.code)}
							style={{ cursor: "pointer" }}
						/>
					))}
				</div>
			)}
		</div>
	);
};

export default DiscountBlock;
