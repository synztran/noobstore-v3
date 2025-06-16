/* eslint-disable no-shadow */
import React from "react";

const ContextProviderComposer: React.FC<{
	contextProviders: React.ReactNode[];
	children: any;
}> = ({ contextProviders, children }) => {
	return (
		<div>
			{contextProviders.reduceRight((acc, Comp) => {
				return React.cloneElement(Comp as React.ReactElement, {}, acc);
			}, children)}
		</div>
	);
};
export default ContextProviderComposer;
