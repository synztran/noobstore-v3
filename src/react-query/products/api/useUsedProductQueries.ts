import { IUsedProduct } from "@/interface/interface";
import { queryPresets } from "@/react-query/configs";
import { appQueryKeys } from "@/react-query/root";
import {
	useQuery,
	UseQueryOptions,
	UseQueryResult,
} from "@tanstack/react-query";

type TQueryOptions = {
	enabled?: boolean | (() => boolean);
} & Partial<(typeof queryPresets)[keyof typeof queryPresets]> &
	Partial<UseQueryOptions<IUsedProduct[], Error>>;

export default function useUsedProductQuery(
	params: Parameters<typeof appQueryKeys.product.getAllUsedProduct>[0],
	queryOptions?: TQueryOptions
): UseQueryResult<IUsedProduct[], Error> {
	const enabled = queryOptions?.enabled ?? true;
	const queryConfig = {
		...appQueryKeys.product.getAllUsedProduct(params),
		...queryPresets.temporary,
		...queryOptions,
		enabled,
	};

	const usedProductQuery = useQuery(queryConfig);

	return usedProductQuery;
}
