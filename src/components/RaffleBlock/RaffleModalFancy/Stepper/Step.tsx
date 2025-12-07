import { memo, ReactNode } from "react";

export interface StepProps {
	children: ReactNode;
	name: string;
	stepValue:
		| "secretKey"
		| "information"
		| "productSelection"
		| "shippingInfo"
		| "submit";
}

const Step = memo(({ children, name, stepValue }: StepProps) => {
	const isPlaceCenter = ["secretKey", "deliveryInfo"].includes(stepValue);
	return (
		<div
			className={`px-8 py-4 min-h-[65vh] ${isPlaceCenter ? "place-content-center" : ""}`}
			data-step-value={stepValue}>
			{children}
		</div>
	);
});

export default Step;
