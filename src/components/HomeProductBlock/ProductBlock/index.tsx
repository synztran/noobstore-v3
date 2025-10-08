import React from "react";
import Image from "next/image";
import { ProductItem } from "..";
import { formatCurrency } from "@/utils/FormatNumber";
import { FavoriteBorder } from "@mui/icons-material";
import RatingComponent from "@/components/productCard/rating";

interface ProductBlockProps {
	isFirst: boolean;
	product: ProductItem;
}

const ProductBlock: React.FC<ProductBlockProps> = ({
	isFirst = false,
	product,
}) => {
	if (isFirst) {
		return (
			<div className="p-0.5 rounded-xl px-2 py-4 flex flex-col relative group hover:shadow-md hover:shadow-gray-300 transition min-h-[380px] cursor-pointer overflow-hidden">
				<div className="flex flex-col gap-1 z-1">
					<div className="flex items-center justify-between">
						<span className="text-sm text-gray-300 font-bold">
							{product.brand}
						</span>
					</div>
					<div className="text-base font-semibold text-white leading-tight">
						{product.name}
					</div>
					<RatingComponent
						star={product.rating.stars}
						reviewer={product.rating.reviews || 0}
					/>
				</div>

				{/* Product Image */}
				<Image
					src={product.image}
					alt={product.name}
					fill
					className="object-cover"
				/>
				<div className="text-lg font-bold text-white mt-auto">
					{formatCurrency(product.price)}
				</div>
			</div>
		);
	}

	return (
		<div className="bg-gray-200 rounded-xl p-2 flex flex-col relative group hover:shadow-md hover:shadow-gray-300 transition min-h-[380px] cursor-pointer">
			<div className="flex flex-col">
				<div className="flex items-center justify-between">
					<span className="text-sm text-gray-500 font-bold">
						{product.brand}
					</span>
					<button className="rounded-full">
						<FavoriteBorder
							fontSize="small"
							className="text-gray-400"
						/>
					</button>
				</div>
				<span className="text-base font-semibold text-black leading-tight">
					{product.name}
				</span>
				<RatingComponent
					star={product.rating.stars}
					reviewer={product.rating.reviews || 0}
				/>
				<div className="flex flex-wrap gap-1 mt-2">
					{product.tags?.map((tag, idx) => (
						<span
							key={idx}
							className="px-2 py-0.5 rounded-sm text-sm font-bold flex items-center"
							style={{
								lineHeight: 1,
								color: "#000",
								border: "1px solid #000",
								...(tag.styles || {}),
							}}>
							{tag.label}
						</span>
					))}
				</div>
			</div>

			<div className="flex justify-center items-center flex-1 relative">
				<Image
					src={product.image}
					alt={product.name}
					fill
					objectFit="contain"
				/>
			</div>
			<div className="flex flex-col">
				{product.quantity && (
					<span className="text-sm text-gray-600">
						{product.quantity} stocks
					</span>
				)}
				<span className="text-lg font-bold text-black mt-auto">
					{formatCurrency(product.price)}
				</span>
			</div>
		</div>
	);
};

export default ProductBlock;
