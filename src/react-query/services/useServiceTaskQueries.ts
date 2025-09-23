import { IServicePlan } from "@/zustand/useServices";
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
	Partial<UseQueryOptions<IServicePlan[], Error>>;

export default function useServiceTaskQuery(
	queryOptions?: IQueryOptions
): UseQueryResult<IServicePlan[], Error> {
	const enabled = queryOptions?.enabled ?? true;
	const queryConfig = {
		...appQueryKeys.service.getTasks,
		...queryPresets.longLived,
		...queryOptions,
		enabled,
	};

	const serviceTaskQuery = useQuery(queryConfig);

	return serviceTaskQuery;
}
