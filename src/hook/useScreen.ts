import { useState, useEffect } from "react";

/**
 * useProductBlockLimit
 * Returns the number of products to show per block based on current window width.
 *
 * @returns {number} limit - The number of products to show
 */
function useProductBlockLimit(): {
	limitHomeProductBlock: number;
} {
	const getLimit = () => {
		if (typeof window === "undefined") return 5;
		const width = window.innerWidth;
		if (width < 640) {
			return 1;
		} else if (width < 768) {
			return 2;
		} else if (width < 1024) {
			return 3;
		} else if (width < 1440) {
			return 4;
		} else {
			return 5;
		}
	};

	const [limit, setLimit] = useState<{
		homeProductBlock: number;
	}>({
		homeProductBlock: getLimit(),
	});

	useEffect(() => {
		function handleResize() {
			setLimit({
				homeProductBlock: getLimit(),
			});
		}
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
		// eslint-disable-next-line
	}, []);

	return {
		limitHomeProductBlock: limit.homeProductBlock,
	};
}

export default useProductBlockLimit;
