import { IServiceFee } from "@/zustand/useServices";
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
	Partial<UseQueryOptions<Record<string, IServiceFee>, Error>>;

export default function useServiceFeeQuery(
	planId: Parameters<typeof appQueryKeys.service.getPlans>[0] = "",
	queryOptions?: IQueryOptions
): UseQueryResult<Record<string, IServiceFee>, Error> {
	const enabled = queryOptions?.enabled ?? true;
	const queryConfig = {
		...appQueryKeys.service.getFees,
		...queryPresets.longLived,
		...queryOptions,
		enabled,
	};

	const serviceFeeQuery = useQuery(queryConfig);

	return serviceFeeQuery;
}
