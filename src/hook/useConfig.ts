import { useEffect, useState } from "react";

interface IProps {
	pathName?: string;
}

export const useCalcBodyHeight = ({ pathName = "" }: IProps) => {
	const [bodyHeight, setBodyHeight] = useState<number>(0);
	const appiedFixedLayout = ["/chat"].includes(pathName || "");

	useEffect(() => {
		const calculateHeight = () => {
			const headerHeight =
				document.querySelector("header")?.clientHeight || 0;
			const footerHeight =
				document.querySelector("footer")?.clientHeight || 0;
			const padding = 16 * 2;
			const windowHeight = (100 * window.innerHeight) / 100;
			const calculatedHeight =
				windowHeight - headerHeight - footerHeight - padding;
			setBodyHeight(calculatedHeight);
		};

		// Calculate initial height
		calculateHeight();

		// Recalculate on window resize
		window.addEventListener("resize", calculateHeight);

		// Cleanup
		return () => {
			window.removeEventListener("resize", calculateHeight);
		};
	}, []);

	return { bodyHeight, appiedFixedLayout };
};
