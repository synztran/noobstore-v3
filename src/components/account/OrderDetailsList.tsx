import { NEW_MISSING_IMAGE } from "@/constants/Images";
import { IBEResponseRaffleProductSelection } from "@/interface/Client/Raffle";
import { formatCurrency } from "@/utils/FormatNumber";
import Image from "next/image";
import React from "react";

interface IProps {
	winProduct: IBEResponseRaffleProductSelection[];
}

const iconMap: Record<string, React.ReactNode> = {
	scissors: (
		<svg
			width="32"
			height="32"
			fill="none"
			viewBox="0 0 24 24"
			className="text-gray-300">
			<path
				d="M9.5 9.5L4 4m0 0l5.5 5.5M4 4l5.5 5.5M14.5 14.5L20 20m0 0l-5.5-5.5M20 20l-5.5-5.5"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	),
	percent: (
		<svg
			width="32"
			height="32"
			fill="none"
			viewBox="0 0 24 24"
			className="text-gray-300">
			<path
				d="M19 5L5 19M7 7h.01M17 17h.01"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	),
	user: (
		<svg
			width="32"
			height="32"
			fill="none"
			viewBox="0 0 24 24"
			className="text-gray-300">
			<circle
				cx="12"
				cy="7"
				r="4"
				stroke="currentColor"
				strokeWidth="2"
			/>
			<path
				d="M5.5 21a7.5 7.5 0 0 1 13 0"
				stroke="currentColor"
				strokeWidth="2"
			/>
		</svg>
	),
	image: (
		<div className="w-8 h-8 bg-gray-200 rounded overflow-hidden flex items-center justify-center">
			<span className="text-gray-400">IMG</span>
		</div>
	),
};

const OrderDetailsList: React.FC<IProps> = ({ winProduct }) => {
	if (!winProduct || winProduct.length === 0) return null;

	// const tempProduct = Array(10).fill(winProduct).flat();
	return (
		<div className="bg-white rounded-xl border border-gray-200 shadow p-4 w-full mx-auto h-full space-y-4">
			<div className="text-lg text-gray-500 font-bold">
				Đơn hàng bao gồm
			</div>
			<div className="flex flex-col gap-2 h-full min-h-0 overflow-y-auto pb-10 pl-1 py-0.5">
				{winProduct?.map((item, idx) => (
					<div key={idx} className="flex items-center gap-2">
						<div className="min-w-14 w-14 h-14 relative cursor-pointer">
							{item.thumbnail ? (
								<Image
									src={
										item.thumbnail.path || NEW_MISSING_IMAGE
									}
									alt={item.thumbnail.alt || "Item Image"}
									className="hover:scale-105 transition-all duration-300 rounded-md"
									fill
									objectFit="cover"
									draggable={false}
								/>
							) : null}
						</div>
						<div className="flex-1">
							<div className="font-semibold text-gray-600 leading-tight">
								{item.name}
							</div>
							<div className={`text-sm text-gray-400`}>
								{formatCurrency(item.price)}
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default OrderDetailsList;
