import { useEffect, useState } from "react";

/**
 * Custom hook for debounced Formik field updates
 * Reduces re-renders by only updating Formik after user stops typing
 */
export const useDebouncedField = (
	fieldName: string,
	initialValue: string | number,
	setFieldValue: (field: string, value: any) => void,
	delay: number = 500,
) => {
	const [localValue, setLocalValue] = useState(initialValue);

	// Update local state immediately when typing
	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		setLocalValue(e.target.value);
	};

	// Update Formik after user stops typing
	useEffect(() => {
		const timer = setTimeout(() => {
			if (localValue !== initialValue) {
				setFieldValue(fieldName, localValue);
			}
		}, delay);

		return () => clearTimeout(timer);
	}, [localValue, delay, fieldName, setFieldValue]);

	// Sync local value when external value changes (e.g., form reset)
	useEffect(() => {
		setLocalValue(initialValue);
	}, [initialValue]);

	return {
		value: localValue,
		onChange: handleChange,
	};
};
