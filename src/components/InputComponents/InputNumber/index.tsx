import React, { useEffect, useRef, useState } from "react";

export interface InputNumberProps {
	value?: number | null;
	defaultValue?: number;
	min?: number;
	max?: number;
	step?: number;
	disabled?: boolean;
	allowClear?: boolean;
	required?: boolean;
	onChange?: (value: number | null) => void;
	className?: string;
	inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
	allowDecimal?: boolean;
	allowNegative?: boolean;
	debounceMs?: number;
}

const clamp = (val: number, min?: number, max?: number) => {
	if (min != null && val < min) return min;
	if (max != null && val > max) return max;
	return val;
};

const isPartial = (
	s: string,
	allowDecimal: boolean,
	allowNegative: boolean
) => {
	if (s === "") return true;
	if (allowNegative && (s === "-" || s === "+")) return true;
	if (allowDecimal) {
		if (allowNegative && (s === "-." || s === "+.")) return true;
		if (s === ".") return true;
	}
	return false;
};

export const InputNumber: React.FC<InputNumberProps> = ({
	value,
	defaultValue,
	min,
	max,
	step = 1,
	disabled,
	required,
	onChange,
	className,
	inputProps,
	allowDecimal = true,
	allowNegative = true,
	debounceMs = 500,
}) => {
	const isControlled = value !== undefined;

	const initialNumber =
		value ??
		(defaultValue !== undefined ? clamp(defaultValue, min, max) : null);

	const [raw, setRaw] = useState(
		initialNumber != null ? String(initialNumber) : ""
	);

	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const clearDebounce = () => {
		if (debounceRef.current) {
			clearTimeout(debounceRef.current);
			debounceRef.current = null;
		}
	};

	const parseToNumber = (s: string): number | null => {
		if (s.trim() === "") return null;
		const n = Number(s);
		if (Number.isNaN(n)) return null;
		return clamp(n, min, max);
	};

	const validCharRegex = allowDecimal
		? allowNegative
			? /^[0-9+\-.*eE]*$/
			: /^[0-9.*eE]*$/
		: allowNegative
			? /^[0-9+\-]*$/
			: /^[0-9]*$/;

	const scheduleEmit = (num: number | null) => {
		clearDebounce();
		debounceRef.current = setTimeout(() => {
			onChange?.(num);
		}, debounceMs);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const nextRaw = e.target.value;

		if (!validCharRegex.test(nextRaw)) return;

		setRaw(nextRaw);

		// If still a partial (user mid-typing), do nothing yet.
		if (isPartial(nextRaw, allowDecimal, allowNegative)) {
			clearDebounce();
			return;
		}

		// Empty string => emit null (debounced)
		if (nextRaw === "") {
			scheduleEmit(null);
			return;
		}

		// Must match strict numeric pattern
		const numericPattern = allowDecimal
			? allowNegative
				? /^[+\-]?\d*(\.\d*)?$/
				: /^\d*(\.\d*)?$/
			: allowNegative
				? /^[+\-]?\d*$/
				: /^\d*$/;

		if (!numericPattern.test(nextRaw)) return;

		const num = parseToNumber(nextRaw);
		scheduleEmit(num);
	};

	// Sync raw when controlled value changes externally
	useEffect(() => {
		if (isControlled) {
			const next =
				value == null ? "" : String(clamp(value as number, min, max));
			setRaw(next);
		}
	}, [value, min, max, isControlled]);

	useEffect(() => () => clearDebounce(), []);

	return (
		<div
			className={className}
			style={{
				display: "inline-flex",
				alignItems: "stretch",
				border: "1px solid #ccc",
				borderRadius: 4,
				overflow: "hidden",
				fontFamily: "sans-serif",
			}}>
			<input
				type="text"
				inputMode={allowDecimal ? "decimal" : "numeric"}
				value={raw}
				onChange={handleChange}
				disabled={disabled}
				required={required}
				style={{
					border: "none",
					outline: "none",
					padding: "4px 8px",
					width: 90,
					fontSize: 14,
				}}
				aria-invalid={
					required && (raw === "" || Number.isNaN(Number(raw)))
						? "true"
						: undefined
				}
				{...inputProps}
			/>
		</div>
	);
};

export default InputNumber;
