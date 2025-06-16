import { ICategory, IProduct } from "@/interface/interface";
import { queryPresets } from "@/react-query/configs";
import { appQueryKeys } from "@/react-query/root";
import {
	useQuery,
	UseQueryOptions,
	UseQueryResult,
} from "@tanstack/react-query";

type QueryOptions = {
	enabled?: boolean | (() => boolean);
} & Partial<(typeof queryPresets)[keyof typeof queryPresets]> &
	Partial<UseQueryOptions<IProductData, Error>>;

interface IProductData {
	products: IProduct[];
	categoryDetail: ICategory;
}

export default function useProductQuery(
	params: Parameters<typeof appQueryKeys.product.singleCategoryData>[0],
	queryOptions?: QueryOptions
): UseQueryResult<IProductData, Error> {
	const enabled = queryOptions?.enabled ?? true;
	const queryConfig = {
		...appQueryKeys.product.singleCategoryData(params),
		...queryPresets.temporary,
		...queryOptions,
		enabled,
	};

	const productQuery = useQuery(queryConfig);

	return productQuery;
}
