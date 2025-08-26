import { UsedProductStatus } from "@/constants";
import { NEW_MISSING_IMAGE } from "@/constants/Images";
import { IUsedProduct } from "@/interface/interface";
import { formatCurrency } from "@/utils/FormatNumber";
import Image from "next/image";
import Link from "next/link";
import React from "react";
// import Tag from "../productTags";

interface IProps {
	usedProduct: IUsedProduct;
}

const UsedProductCard: React.FC<IProps> = ({ usedProduct }) => {
	const { images, name, price, salePrice, slug, shortDescription, status } =
		usedProduct || {};

	return (
		<div className="max-w-lg relative p-4 border border-solid border-gray-400 shadow-lg hover:shadow-xl xs:w-full h-max">
			<Link href={`/product/${slug}`}>
				<div className="w-full h-52 relative overflow-hidden">
					<Image
						src={images?.[0]?.public_url || NEW_MISSING_IMAGE}
						alt="product image"
						className="hover:scale-105 transition-all duration-500 object-contain"
						fill
						sizes="100vw"
						quality={100}
						priority
					/>
				</div>
			</Link>
			<div className="w-full pt-4">
				<div className="font-bold text-lg">{name}</div>
				<div
					dangerouslySetInnerHTML={{ __html: shortDescription }}
					className="text-gray-600 line-clamp-2"
					style={{ minHeight: 48 }}
				/>
				<div className="mt-2">
					<div
						className="w-full my-4"
						style={{
							background: "rgba(0, 0, 0, 0.12)",
							height: "1px",
						}}
					/>
					<div className="flex justify-between items-center">
						{salePrice > 0 ? (
							<div className="flex flex-col font-bold text-xl">
								<span className="text-xl text-red-500">
									{formatCurrency(salePrice)}
								</span>
								<span className="line-through text-sm text-gray-500">
									{formatCurrency(price)}
								</span>
							</div>
						) : null}
						<div>
							{/* <Tag
								text={usedProduct}
								status={status}
							/> */}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UsedProductCard;
