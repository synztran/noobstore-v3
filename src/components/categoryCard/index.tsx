import { NEW_MISSING_IMAGE } from "@/constants/Images";
import { ICategory } from "@/interface/interface";
import { formatCurrency } from "@/utils/FormatNumber";
import NextImage from "next/image";
import Link from "next/link";
import { memo } from "react";
import ProductTag from "../productTags";
import { FavoriteBorder } from "@mui/icons-material";
import { Star } from "lucide-react";
import { classNames } from "@/utils/AppConfig";
import SaleTag from "../SaleTag";

interface Props {
	category: ICategory;
	isWithoutProducts?: boolean;
}

const CategoryCard = ({ category }: Props) => {
	const {
		thumbnail,
		categoryName,
		slug,
		// status,
		minPrice,
		maxPrice,
		description,
		// salePrice,
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
		<div key={categoryId} className="p-0.5 relative">
			<SaleTag salePricePercent={salePricePercent} />
			<Link
				href={`/product/${slug}`}
				className="bg-[#f7f6f3] shadow-sm rounded-xl p-2 flex flex-col relative group hover:shadow-md hover:shadow-gray-300 transition min-h-[420px] cursor-pointer">
				<div className="flex flex-col">
					<div className="flex items-center justify-between">
						<span className="text-base text-gray-600 font-bold">
							{brand || "NoobStore"}
						</span>
						<button className="rounded-full group">
							<FavoriteBorder className="text-gray-400 group-hover:scale-105 transition-all duration-300" />
						</button>
					</div>
					<span className="text-lg font-semibold text-black leading-tight">
						{categoryName}
					</span>
					<div className="flex flex-col gap-1 mt-1">
						{rating ? (
							<div className="flex items-center gap-1">
								<div className="flex items-center">
									{[...Array(5)].map((_, i) => {
										const full =
											i + 1 <= Math.floor(rating.star);
										const half =
											!full &&
											i < rating.star &&
											rating.star % 1 >= 0.5;
										return (
											<span
												key={i}
												className="relative w-4 h-4 inline-block">
												<Star
													className={classNames(
														"w-4 h-4",
														full
															? "fill-yellow-400"
															: half
															? "fill-yellow-400"
															: "fill-gray-300"
													)}
													style={
														half
															? {
																	clipPath:
																		"polygon(0 0, 50% 0, 50% 100%, 0 100%)",
															  }
															: undefined
													}
												/>
												{half && (
													<Star
														className="w-4 h-4 fill-gray-300 absolute top-0 left-0"
														style={{
															clipPath:
																"polygon(50% 0, 100% 0, 100% 100%, 50% 100%)",
														}}
													/>
												)}
											</span>
										);
									})}
								</div>
								<span
									className="text-sm text-gray-700"
									style={{
										lineHeight: 1,
									}}>
									{rating.rateMessages?.length} đánh giá
								</span>
							</div>
						) : null}
						<ProductTag tags={tags || []} />
					</div>
				</div>

				{/* Product Image */}
				<div className="flex justify-center items-center flex-1 relative">
					<NextImage
						src={thumbnail?.path || NEW_MISSING_IMAGE}
						alt={categoryName}
						fill
						className="object-contain"
					/>
				</div>
				<div
					className="line-clamp-2 text-base h-[42px]"
					dangerouslySetInnerHTML={{ __html: description }}
				/>
				<div className="flex flex-col mt-4">
					{/* {quantity && (
						<span className="text-xs text-gray-600">
							{product.quantity} stocks
						</span>
					)} */}
					<span className="text-lg font-extrabold text-[#ec97b2] mt-auto">
						{formatCurrency(minPrice)}{" "}
						{minPrice !== maxPrice &&
							maxPrice !== 0 &&
							`- ${formatCurrency(maxPrice)}`}
					</span>
				</div>
			</Link>
		</div>
	);
};

export default memo(CategoryCard);
