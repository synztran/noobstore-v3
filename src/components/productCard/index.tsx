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
		<div className="">
			<div className="grid grid-cols-5 gap-2">
				{/* Image gallery */}
				<div className="mb-auto w-full col-span-3">
					{isLoading ? (
						<SkeletonBlock className="col-span-3" />
					) : (
						<div className="lg:grid lg:grid-cols-1 lg:gap-y-8">
							<SliderSyncing
								imageList={images?.map((pic, index) => ({
									src: pic.path,
									alt: "",
									id: pic.id || index + 1,
								}))}
							/>
						</div>
					)}
				</div>

				{/* Product info */}
				{isLoading ? (
					<SkeletonBlock className="col-span-2" />
				) : (
					<div className="max-w-full p-4 rounded-md col-span-2">
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
