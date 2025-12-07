import React from "react";

export type StepValue =
	| "secretKey"
	| "information"
	| "productSelection"
	| "shippingInfo"
	| "submit";

export interface StepElementProps {
	stepValue: StepValue;
	name: string;
	children?: React.ReactNode;
}
