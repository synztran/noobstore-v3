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

interface Props {
	slug: string;
}

const ProductCard = ({ slug }: Props) => {
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
	// const itemsOptions: Record<EnumProductType, IProductOption[]> =
	// 	useMemo(() => {
	// 		// const producOptions = products?.map(
	// 		// 	(product: IProduct) => product?.productOpts
	// 		// );

	// 		// console.log("producOptions", producOptions);
	// 		// const mappingOptions = productOptions?.reduce(
	// 		// 	(
	// 		// 		acc: Record<EnumProductType, IProductOption[]>,
	// 		// 		opts: IProductOption[]
	// 		// 	) => {
	// 		// 		opts?.forEach((opt) => {
	// 		// 			if (opt.productPart) {
	// 		// 				if (!acc[opt.productPart]) {
	// 		// 					acc[opt.productPart] = [];
	// 		// 				}
	// 		// 				acc[opt.productPart].push(opt);
	// 		// 			}
	// 		// 		});
	// 		// 		return acc;
	// 		// 	},
	// 		// 	{} as Record<EnumProductType, IProductOption[]>
	// 		// );

	// 		// console.log("mappingOptions", mappingOptions);

	// 		// return mappingOptions || {};
	// 		return {};
	// 	}, [products]);

	return (
		<div className="grid grid-cols-12 gap-8 px-4">
			<div className="mb-auto w-full col-span-6">
				{isLoading ? (
					<>
						<SkeletonBlock className="col-span-6" />
						<SkeletonBlock className="col-span-6" />
					</>
				) : (
					<div className="flex flex-col gap-8">
						<SliderSyncing
							imageList={images?.map((pic, index) => ({
								src: pic.path,
								alt: "",
								id: index + 1,
							}))}
						/>
						<DetailRating
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
						/>
					</div>
				)}
			</div>

			{/* Product info */}
			<div className="col-span-6 gap-12 grid grid-cols-12">
				{isLoading ? (
					<SkeletonBlock className="col-span-5" />
				) : (
					<div className="max-w-full p-4 rounded-lg col-span-10 bg-white shadow-md max-h-max">
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
				<div className="col-span-2">
					{isLoading ? (
						<SkeletonBlock className="col-span-1" />
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
