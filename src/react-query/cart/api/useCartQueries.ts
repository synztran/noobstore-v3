import { ICart } from "@/interface/Client/Cart";
import {
	useQuery,
	UseQueryOptions,
	UseQueryResult,
} from "@tanstack/react-query";
import { queryPresets } from "react-query/configs";
import { appQueryKeys } from "react-query/root";

type TQueryOptions = {
	enabled?: boolean | (() => boolean);
} & Partial<(typeof queryPresets)[keyof typeof queryPresets]> &
	Partial<UseQueryOptions<ICart, Error>>;

export default function useCartQuery(
	queryOptions?: TQueryOptions
): UseQueryResult<ICart, Error> {
	const enabled = queryOptions?.enabled ?? true;
	const queryConfig = {
		...appQueryKeys.cart.cartData,
		...queryPresets.temporary,
		...queryOptions,
		enabled,
	};

	const useCartQuery = useQuery(queryConfig);

	return useCartQuery;
}
