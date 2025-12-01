import {
	EnumProductType,
	ICategory,
	ICollapseContent,
	IProduct,
	IProductOption,
} from "@/interface/interface";
import useProductQuery from "@/react-query/products/api/useProductQueries";
import Skeleton from "@mui/material/Skeleton";
import { clamp } from "@mui/utils";
import { useMemo, useState } from "react";
import ProductInfoBlock from "../ProductInfoBlock";
import SliderSyncing from "../SliderSyncing";
import { classNames } from "@/utils/AppConfig";
import CollapseText from "../collapse";
import SideUtilities from "../SideUtilities";
import DetailRating from "../DetailRating";
import ProductReviews from "../ProductReviews";
import { useAuth } from "@/context/Auth";
import { IAuthUser } from "@/interface/Context/auth";

interface Props {
	slug: string;
}

const ProductCard = ({ slug }: Props) => {
	const { isAuthenticated = false } = useAuth() as unknown as {
		user: IAuthUser | null;
		isAuthenticated: boolean;
	};
	const { data: productData, isFetching: isLoading } = useProductQuery(
		{ categoryId: slug as string },
		{
			enabled: !!slug,
		}
	);
	const { categoryDetail, products, productOptions } = productData || {
		categoryDetail: {},
		products: [],
		productOptions: {},
	};
	const { images = [] } = categoryDetail || {};

	const [selectedOpt, setSelectedOpt] = useState<
		Record<EnumProductType, IProductOption[]>
	>(() => {
		const initialSelectedOpt = {} as Record<
			EnumProductType,
			IProductOption[]
		>;
		if (products instanceof Array && products.length === 0) {
			products?.forEach((product: IProduct) => {
				product?.productOpts?.forEach((opt) => {
					if (opt.productPart) {
						if (!initialSelectedOpt[opt.productPart]) {
							initialSelectedOpt[opt.productPart] = [];
						} else {
							initialSelectedOpt[opt.productPart].push(opt);
						}
					}
				});
			});
		}

		return initialSelectedOpt;
	});

	return (
		<div className="grid grid-cols-12 gap-4">
			{/* image and slider */}
			<div className="mb-auto w-full col-span-7">
				{isLoading ? (
					<>
						<SkeletonBlock className="col-span-6" />
						<SkeletonBlock className="col-span-6" />
					</>
				) : (
					<div className="flex flex-col gap-4">
						<SliderSyncing
							imageList={images?.map((pic, index) => ({
								src: pic.path,
								alt: "",
								id: index + 1,
							}))}
						/>
						{/* <DetailRating
							averageRating={4.99}
							totalReviews={215}
							ratingBreakdown={[
								{
									stars: 5,
									percentage: 85,
									count: 215,
								},
								{
									stars: 4,
									percentage: 10,
									count: 215,
								},
								{
									stars: 3,
									percentage: 1,
									count: 215,
								},
								{
									stars: 2,
									percentage: 1,
									count: 215,
								},
								{
									stars: 1,
									percentage: 3,
									count: 215,
								},
							]}
							showRatingMethodology={true}
						/> */}
						<ProductReviews
							productId={
								productData?.categoryDetail?.categoryId || ""
							}
							canReview={isAuthenticated}
						/>
					</div>
				)}
			</div>
			{/* Product info */}
			<div className="col-span-5 gap-6 grid grid-cols-12">
				{isLoading ? (
					<SkeletonBlock className="col-span-8" />
				) : (
					<div className="max-w-full p-4 rounded-lg col-span-11 bg-white shadow-md max-h-max">
						<ProductInfoBlock
							products={products}
							category={categoryDetail as ICategory}
							productOptions={
								productOptions as Record<
									EnumProductType,
									IProductOption[]
								>
							}
							selectedOpt={selectedOpt}
							setSelectedOpt={setSelectedOpt}
						/>
					</div>
				)}
				<div className="col-span-1 ml-auto">
					{isLoading ? (
						<SkeletonBlock className="w-full" />
					) : (
						<SideUtilities
							showAvatar={true}
							avatarUrl={categoryDetail?.author}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default ProductCard;

export function SkeletonBlock({ className }: { className?: string }) {
	return (
		<div className={classNames(className || "", "w-full h-full")}>
			<Skeleton
				variant="rectangular"
				width="100%"
				style={{
					height: clamp(550, 600, 610),
				}}
				animation="wave"
			/>
		</div>
	);
}
