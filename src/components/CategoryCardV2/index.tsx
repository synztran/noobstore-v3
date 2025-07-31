import { CategoryStatus } from "@/constants";
import { NEW_MISSING_IMAGE } from "@/constants/Images";
import { ICategory } from "@/interface/interface";
import { formatCurrency } from "@/utils/FormatNumber";
import NextImage from "next/image";
import Link from "next/link";
import { memo } from "react";
import ProductTag from "../productTags";
import { BookmarkAddOutlined, FavoriteBorder } from "@mui/icons-material";
import { Bookmark, ShoppingBasket, Star } from "lucide-react";
import { classNames } from "@/utils/AppConfig";
import { error } from "console";
import SaleTag from "../SaleTag";
import { Divider } from "@mui/material";
import RatingComponent from "../productCard/rating";

interface Props {
	category: ICategory;
	isWithoutProducts?: boolean;
}

const CategoryCard = ({ category, isWithoutProducts = false }: Props) => {
	const {
		thumbnail,
		categoryName,
		slug,
		status,
		minPrice,
		maxPrice,
		description,
		salePrice,
		salePricePercent,
		isActive,
		categoryId,
		brand,
		rating,
		tags,
	} = category || {};

	console.log(category);

	if (!isActive) return null;

	return (
		<Link
			href={`/product/${slug}`}
			key={categoryId}
			className="relative bg-white shadow-sm rounded-xl p-4 flex flex-col cursor-pointer hover:shadow-lg transition-all duration-300">
			{/* <SaleTag salePricePercent={salePricePercent} /> */}
			<div className="grid grid-rows-2 gap-4">
				<div className="grid-rows-1 relative">
					<NextImage
						src={thumbnail?.path || NEW_MISSING_IMAGE}
						alt={categoryName}
						fill
						className="object-cover rounded-lg shadow-sm shadow-gray-200 hover:scale-105 transition-all duration-300"
					/>
				</div>
				<div className="grid-rows-1 flex flex-col backdrop-blur-md mt-auto">
					<div className="group">
						<div className="flex flex-col">
							<div className="flex items-center justify-between">
								<span className="text-lg text-gray-500 font-bold">
									{brand || "NoobStore"}
								</span>
							</div>
							<span className="text-xl font-bold text-black leading-tight line-clamp-1">
								{categoryName}
							</span>
						</div>
						<ProductTag tags={tags || []} />
						<div
							className="line-clamp-2 text-base min-h-[48px] mt-2"
							dangerouslySetInnerHTML={{ __html: description }}
						/>

						<div className="flex gap-2 mt-2 relative">
							<div className="flex flex-col items-center justify-between w-1/2">
								<span className="text-lg font-extrabold text-[#ec97b2]">
									{formatCurrency(minPrice)}
								</span>
								<span className="text-base">Giá từ</span>
							</div>
							<Divider
								orientation="vertical"
								flexItem
								className="w-0.5 h-2/3 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
							/>
							<div className="flex flex-col items-center justify-between w-1/2">
								<RatingComponent
									star={rating?.star || 0}
									isVertical
								/>
							</div>
						</div>
						<div className="flex items-center gap-2 mt-2">
							<button className="rounded-60 bg-[#f5f4f1] text-center text-black w-3/4 flex items-center justify-center gap-2 py-2 font-bold hover:scale-105 transition-all duration-200 text-lg">
								<ShoppingBasket className="w-6 h-6" />
								Mua Ngay
							</button>
							<button className="rounded-60 bg-gray-800 text-center w-1/4 flex items-center justify-center py-2 hover:scale-105 transition-all duration-200 text-lg">
								<BookmarkAddOutlined className="fill-white w-6 h-6" />
							</button>
						</div>
					</div>
				</div>
			</div>
		</Link>
	);
};

export default memo(CategoryCard);
