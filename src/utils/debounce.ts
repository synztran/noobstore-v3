import { useEffect, useState } from "react";

// Generic debounce function in TypeScript
type Procedure = (...args: any[]) => void;

const debounce = <F extends Procedure>(func: F, wait: number) => {
	let timeout: ReturnType<typeof setTimeout> | undefined;

	return function executedFunction(
		this: ThisParameterType<F>,
		...args: Parameters<F>
	) {
		const later = () => {
			if (timeout) clearTimeout(timeout);
			func.apply(this, args);
		};

		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
};

export const debounceFunc = (time: number) =>
	debounce((cb: () => void) => cb(), time);
export const debounceFunc100 = debounceFunc(100);
export const debounceFunc200 = debounceFunc(200);
export const debounceFunc300 = debounceFunc(300);
export const debounceFunc400 = debounceFunc(400);
export const debounceFunc500 = debounceFunc(500);
export const debounceFunc1000 = debounceFunc(1000);
// export const debounceFunc1500 = debounceFunc(1500); // deprecated 22Feb2023 - Dinh Tran

const DEFAULT_DELAY = 300;

export function useDebounce<T>(value: T, delay: number = DEFAULT_DELAY): T {
	const [debouncedValue, setDebouncedValue] = useState<T>(value);

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);
		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]);

	return debouncedValue;
}

export default debounce;
