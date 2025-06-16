import { IOrdered } from "@/interface/Client/Order";
import {
	useQuery,
	UseQueryOptions,
	UseQueryResult,
} from "@tanstack/react-query";
import { queryPresets } from "react-query/configs";
import { appQueryKeys } from "react-query/root";

type IQueryOptions = {
	enabled?: boolean | (() => boolean);
} & Partial<(typeof queryPresets)[keyof typeof queryPresets]> &
	Partial<UseQueryOptions<IOrdered, Error>>;

export default function useOrderQuery(
	orderId: Parameters<typeof appQueryKeys.order.getOrderDetail>[0],
	queryOptions?: IQueryOptions
): UseQueryResult<IOrdered, Error> {
	const enabled = queryOptions?.enabled ?? true;
	const queryConfig = {
		...appQueryKeys.order.getOrderDetail(orderId),
		...queryPresets.longLived,
		...queryOptions,
		enabled,
	};

	const orderQuery = useQuery(queryConfig);

	return orderQuery;
}
