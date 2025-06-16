import { IProduct } from "@/interface/interface";
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
	Partial<UseQueryOptions<IProduct[], Error>>;

export default function useProductsQuery(
	queryOptions?: QueryOptions
): UseQueryResult<IProduct[], Error> {
	const enabled = queryOptions?.enabled ?? true;
	const queryConfig = {
		...appQueryKeys.product.getAllProducts(),
		...queryPresets.temporary,
		...queryOptions,
		enabled,
	};

	const productsQuery = useQuery(queryConfig);

	return productsQuery;
}
