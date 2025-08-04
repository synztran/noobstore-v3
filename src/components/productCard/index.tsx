import {
	EnumProductType,
	ICategory,
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
	const { categoryDetail, products } = productData || {
		categoryDetail: {},
		products: [],
	};

	console.log("productData", productData);

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
	const itemsOptions: Record<EnumProductType, IProductOption[]> =
		useMemo(() => {
			const producOptions = products?.map(
				(product: IProduct) => product?.productOpts
			);

			console.log("producOptions", producOptions);

			const mappingOptions = producOptions?.reduce(
				(acc, opts) => {
					opts?.forEach((opt) => {
						if (opt.productPart) {
							if (!acc[opt.productPart]) {
								acc[opt.productPart] = [];
							}
							acc[opt.productPart].push(opt);
						}
					});
					return acc;
				},
				{} as Record<EnumProductType, IProductOption[]>
			);

			return mappingOptions || {};
		}, [products]);

	return (
		<div className="grid grid-cols-12 gap-8 px-12">
			<div className="mb-auto w-full col-span-6 bg-white rounded-lg shadow-md p-4">
				{isLoading ? (
					<SkeletonBlock className="col-span-6" />
				) : (
					<SliderSyncing
						imageList={images?.map((pic, index) => ({
							src: pic.path,
							alt: "",
							id: index + 1,
						}))}
					/>
				)}
			</div>

			{/* Product info */}
			{isLoading ? (
				<SkeletonBlock className="col-span-5" />
			) : (
				<div className="max-w-full p-4 rounded-lg col-span-5 bg-white shadow-md">
					{Object.values(categoryDetail)?.length ? (
						<ProductInfoBlock
							products={products}
							category={categoryDetail as ICategory}
							itemsOptions={itemsOptions}
							selectedOpt={selectedOpt}
							setSelectedOpt={setSelectedOpt}
						/>
					) : null}
				</div>
			)}
			{isLoading ? (
				<SkeletonBlock className="col-span-1" />
			) : (
				<div className="max-w-max max-h-max p-4 rounded-lg col-span-1 bg-white shadow-md">
					<h1>{categoryDetail?.author}</h1>
				</div>
			)}
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
