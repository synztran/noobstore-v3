import { NEW_MISSING_IMAGE } from "@/constants/Images";
import { ICategory } from "@/interface/interface";
import { formatCurrency } from "@/utils/FormatNumber";
import NextImage from "next/image";
import Link from "next/link";
import { memo } from "react";
import ProductTag from "../productTags";
import { BookmarkAddOutlined } from "@mui/icons-material";
import RatingComponent from "../productCard/rating";
import { useRouter } from "next/router";

interface Props {
	category: ICategory;
	isWithoutProducts?: boolean;
}

const CategoryCard = ({ category }: Props) => {
	const router = useRouter();
	const {
		thumbnail,
		categoryName,
		slug,
		// status,
		minPrice,
		// maxPrice,
		description,
		salePrice,
		// salePricePercent,
		isActive,
		categoryId,
		brand,
		rating,
		tags,
		author,
	} = category || {};

	if (!isActive) return null;

	return (
		<Link
			href={`/product/${slug}`}
			key={categoryId}
			className="relative bg-white shadow-sm rounded-xl p-4 flex flex-col cursor-pointer hover:shadow-lg transition-all duration-300">
			<div className="grid grid-rows-[1fr_1fr] gap-2">
				<div className="relative aspect-[3/2] rounded-lg border border-gray-200 shadow-gray-200 overflow-hidden">
					<NextImage
						src={thumbnail?.path || NEW_MISSING_IMAGE}
						alt={categoryName}
						fill
						className="object-cover w-full h-full hover:scale-105 transition-all duration-300"
					/>
					<button className="absolute right-1 top-1 hover:scale-105 transition-all duration-200 text-lg bg-blend-saturation">
						<BookmarkAddOutlined className="fill-black w-6 h-6" />
					</button>
					<div className="absolute bottom-1 left-1 bg-gray-200 text-black max-w-max px-1 rounded-md">
						<span>{brand || author || "NoobStore"}</span>
					</div>
				</div>
				<div className="grid-rows-1 flex flex-col backdrop-blur-md mt-auto gap-1.5">
					<div className="flex flex-col min-h-[40px]">
						<span className="text-base font-bold text-black leading-tight line-clamp-2">
							{categoryName}
						</span>
					</div>
					<RatingComponent star={rating?.star || 0} />
					<ProductTag tags={tags || []} />
					<div
						className="line-clamp-2 text-sm min-h-[44px]"
						dangerouslySetInnerHTML={{ __html: description }}
					/>

					<div className="flex gap-2 mt-2 relative"></div>
					<div className="flex items-center justify-between">
						<div className="flex items-baseline gap-1">
							<span className="text-xl font-bold text-black">
								{formatCurrency(salePrice || minPrice)}
							</span>
							{salePrice ? (
								<span className="text-xs line-through">
									{formatCurrency(minPrice || 0)}
								</span>
							) : null}
						</div>
						<button
							onClick={() => router.push(`/product/${slug}`)}
							className="rounded-lg bg-[#ec97b2] max-w-max px-3 py-1 hover:scale-105 transition-all duration-200 shadow-md flex items-center gap-1">
							<strong className="text-sm text-white">
								Mua ngay
							</strong>
						</button>
					</div>
				</div>
			</div>
		</Link>
	);
};

export default memo(CategoryCard);
