import React from "react";

interface DetailTooltipProps {
	detail: { [key: string]: string };
}

const DetailTooltip: React.FC<DetailTooltipProps> = ({ detail }) => {
	return (
		<div className="flex flex-col gap-1 min-w-[180px] rounded-md">
			{Object.entries(detail).map(([key, value]) => (
				<div key={key} className="flex justify-between text-xs">
					<span className="font-semibold text-white">{key}:</span>
					<span className="ml-2 text-zinc-300">{value}</span>
				</div>
			))}
		</div>
	);
};

export default DetailTooltip;
