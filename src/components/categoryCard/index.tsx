import { CategoryStatus } from "@/constants";
import { NEW_MISSING_IMAGE } from "@/constants/Images";
import { ICategory } from "@/interface/interface";
import { formatCurrency } from "@/utils/FormatNumber";
import NextImage from "next/legacy/image";
import Link from "next/link";
import { memo } from "react";
import ProductTag from "../productTags";

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
		description,
		salePrice,
		isActive,
	} = category || {};

	if (!isActive) return null;

	return (
		<div className="max-w-lg relative p-4 border border-solid border-gray-400 shadow-lg hover:shadow-xl xs:w-full h-full flex flex-col justify-between">
			<Link href={`/product/${slug}`}>
				<div className="w-full h-52 relative overflow-hidden">
					<NextImage
						src={thumbnail?.path || NEW_MISSING_IMAGE}
						alt="product image"
						className="hover:scale-105 transition-all duration-500 object-cover"
						sizes="100vw"
						quality={100}
						priority
						layout="fill"
					/>
					<div className="absolute top-1 right-1">
						<ProductTag
							text={CategoryStatus[status]}
							status={status}
						/>
					</div>
				</div>
			</Link>

			<div className="w-full h-full flex flex-col justify-between">
				<div className="mt-2">
					<div className="font-bold text-base">{categoryName}</div>
					<div className="text-gray-600 line-clamp-3 min-h-[24px] text-sm">
						{description || ""}
					</div>
				</div>

				<div className="mt-2">
					<div
						className="w-full my-4 h-[1px]"
						style={{
							background: "rgba(0, 0, 0, 0.12)",
						}}
					/>
					<div className="flex justify-between items-center">
						{salePrice && salePrice > 0 ? (
							<div className="font-bold flex items-center gap-2">
								<span className="text-lg text-red-500">
									{formatCurrency(salePrice)}
								</span>
								<span className="line-through text-sm text-gray-500">
									{formatCurrency(minPrice)}
								</span>
							</div>
						) : (
							<div
								className="font-bold text-lg"
								style={{ color: "#256f6e" }}>
								{formatCurrency(minPrice)}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(CategoryCard);
