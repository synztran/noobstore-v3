import React from "react";
import Image from "next/image";
import { formatCurrency } from "@/utils/FormatNumber";
import { FavoriteBorder } from "@mui/icons-material";
import RatingComponent from "@/components/productCard/rating";
import { ICategory } from "@/interface/interface";
import { useRouter } from "next/router";
import { NEW_MISSING_IMAGE } from "@/constants/Images";
import Link from "next/link";
import ProductTag from "../productTags";

interface IProps {
	category: ICategory;
}

const CategoryCardV3: React.FC<IProps> = ({ category }) => {
	const router = useRouter();
	const {
		thumbnail,
		categoryName,
		slug,
		minPrice,
		description,
		salePrice,
		maxPrice,
		isActive,
		categoryId,
		brand,
		rating,
		tags,
		author,
	} = category || {};

	if (!category) return null;

	return (
		<Link
			href={`product/${slug}`}
			key={categoryId}
			className="bg-gray-200 rounded-xl p-2 flex flex-col relative group hover:shadow-md hover:shadow-gray-300 transition min-h-[520px] cursor-pointer gap-1 overflow-hidden">
			<div className="flex flex-col">
				<div className="flex items-center justify-between">
					<span className="text-base text-gray-600 font-bold">
						{author || brand || "NoobStore"}
					</span>
					<button className="rounded-full">
						<FavoriteBorder
							fontSize="small"
							className="text-gray-400"
						/>
					</button>
				</div>
				<span className="text-lg font-semibold text-black">
					{categoryName}
				</span>
				<RatingComponent
					star={rating?.star || 0}
					reviewer={rating?.rateMessages.length || 0}
				/>
				<div className="flex flex-wrap gap-1 mt-2">
					<ProductTag tags={tags || []} />
				</div>
			</div>

			<div className="flex justify-center items-center flex-1 relative">
				<Image
					src={thumbnail.path || NEW_MISSING_IMAGE}
					alt={categoryName}
					fill
					objectFit="cover"
					className="hover:scale-[1.02] transition-all duration-300 rounded-md"
				/>
			</div>
			<div
				dangerouslySetInnerHTML={{ __html: description || "" }}
				className="text-base text-black line-clamp-2 min-h-[42px]"
			/>
			<div className="flex">
				{salePrice ? (
					<div className="flex items-baseline gap-1">
						<span className="text-xl font-bold text-black">
							{formatCurrency(salePrice || minPrice)}
						</span>
						{salePrice ? (
							<span className="text-sm line-through">
								{formatCurrency(minPrice || 0)}
							</span>
						) : null}
					</div>
				) : (
					<span className="text-xl font-bold text-black mt-auto">
						{formatCurrency(minPrice || salePrice || 0)}
						{maxPrice ? (
							<span className="text-xl font-bold text-black mt-auto">
								{" "}
								~ {formatCurrency(maxPrice)}
							</span>
						) : null}
					</span>
				)}
			</div>
			<div className="w-full">
				<button
					onClick={() => router.push(`/product/${slug}`)}
					className="rounded-lg bg-red-400 max-w-max px-3 py-1 hover:scale-105 transition-all duration-200 shadow-md flex items-center gap-1 ml-auto">
					<strong className="text-sm text-white">Mua ngay</strong>
				</button>
			</div>
		</Link>
	);
};

export default CategoryCardV3;
