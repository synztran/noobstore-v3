import { IProductOption } from "@/interface/interface";
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
	Partial<UseQueryOptions<IProductOption[], Error>>;

export default function useProductOptionsQuery(
	params: Parameters<typeof appQueryKeys.product.getProductOptions>[0],
	queryOptions?: QueryOptions
): UseQueryResult<IProductOption[], Error> {
	const enabled = queryOptions?.enabled ?? true;
	const queryConfig = {
		...appQueryKeys.product.getProductOptions(params),
		...queryPresets.temporary,
		...queryOptions,
		enabled,
	};

	const productOptionsQuery = useQuery(queryConfig);

	return productOptionsQuery;
}
