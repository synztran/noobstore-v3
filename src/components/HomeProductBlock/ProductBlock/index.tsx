import React from "react";
import Image from "next/image";
import { ProductItem } from "..";
import { formatCurrency } from "@/utils/FormatNumber";
import { Star } from "lucide-react";
import { FavoriteBorder } from "@mui/icons-material";

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
			<div key={product.id} className="p-0.5">
				<div className="rounded-xl px-2 py-4 flex flex-col relative group hover:shadow-md hover:shadow-gray-300 transition min-h-[380px] cursor-pointer overflow-hidden">
					<div className="flex flex-col gap-1 z-1">
						<div className="flex items-center justify-between">
							<span className="text-xs text-gray-300 font-bold">
								{product.brand}
							</span>
						</div>
						<span className="text-sm font-semibold text-white leading-tight">
							{product.name}
						</span>
						{product.rating && (
							<div className="flex items-center">
								{[...Array(5)].map((_, i) => (
									<span
										key={i}
										className={
											i < Math.round(product.rating.stars)
												? "text-black"
												: "text-gray-300"
										}>
										<Star className="fill-yellow-400 w-4 h-4" />
									</span>
								))}
								<span
									className="text-xs text-white font-medium ml-1"
									style={{ lineHeight: 1 }}>
									{product.rating.reviews}
								</span>
							</div>
						)}
					</div>

					{/* Product Image */}
					<Image
						src={product.image}
						alt={product.name}
						layout="fill"
						objectFit="cover"
					/>
					<div className="flex flex-col mt-auto z-1">
						<span className="text-lg font-bold text-white mt-auto">
							{formatCurrency(product.price)}
						</span>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div key={product.id} className="p-0.5">
			<div className="bg-gray-200 rounded-xl p-2 flex flex-col relative group hover:shadow-md hover:shadow-gray-300 transition min-h-[380px] cursor-pointer">
				<div className="flex flex-col">
					<div className="flex items-center justify-between">
						<span className="text-xs text-gray-500 font-bold">
							{product.brand}
						</span>
						<button className="rounded-full">
							<FavoriteBorder
								fontSize="small"
								className="text-gray-400"
							/>
						</button>
					</div>
					<span className="text-sm font-semibold text-black leading-tight">
						{product.name}
					</span>
					{product.rating && (
						<div className="flex items-center">
							{[...Array(5)].map((_, i) => (
								<span
									key={i}
									className={
										i < Math.round(product.rating.stars)
											? "text-black"
											: "text-gray-300"
									}>
									<Star className="fill-yellow-400 w-4 h-4" />
								</span>
							))}
							<span
								className="text-xs text-black font-bold ml-1"
								style={{ lineHeight: 1 }}>
								{product.rating.reviews}
							</span>
						</div>
					)}
					<div className="flex flex-wrap gap-1 mt-2">
						{product.tags?.map((tag, idx) => (
							<div
								key={idx}
								className="px-2 py-0.5 rounded-sm text-xs font-bold flex items-center"
								style={{
									lineHeight: 1,
									color: "#000",
									border: "1px solid #000",
									...tag.styles,
								}}>
								{tag.label}
							</div>
						))}
					</div>
				</div>

				{/* Product Image */}
				<div className="flex justify-center items-center flex-1 relative">
					<Image
						src={product.image}
						alt={product.name}
						layout="fill"
						objectFit="contain"
					/>
				</div>
				<div className="flex flex-col">
					{product.quantity && (
						<span className="text-xs text-gray-600">
							{product.quantity} stocks
						</span>
					)}
					<span className="text-lg font-bold text-black mt-auto">
						{formatCurrency(product.price)}
					</span>
				</div>
			</div>
		</div>
	);
};
export default ProductBlock;
