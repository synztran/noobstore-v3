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

export default function useServicePlanQuery(
	planId: Parameters<typeof appQueryKeys.service.getPlans>[0] = "",
	queryOptions?: IQueryOptions
): UseQueryResult<IServicePlan[], Error> {
	const enabled = queryOptions?.enabled ?? true;
	const queryConfig = {
		...appQueryKeys.service.getPlans(planId),
		...queryPresets.longLived,
		...queryOptions,
		enabled,
	};

	const servicePlanQuery = useQuery(queryConfig);

	return servicePlanQuery;
}
