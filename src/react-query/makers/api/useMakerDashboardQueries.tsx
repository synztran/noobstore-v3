import {
	IBEResponseMaker,
	IBEResponseMakerDashboard,
} from "@/interface/Client/Maker";
import {
	useQuery,
	UseQueryOptions,
	UseQueryResult,
} from "@tanstack/react-query";
import { queryPresets } from "react-query/configs";
import { appQueryKeys } from "react-query/root";

type TQueryOptions = {
	enabled?: boolean | (() => boolean);
	params?: { makerId: string; search?: string };
} & Partial<(typeof queryPresets)[keyof typeof queryPresets]> &
	Partial<UseQueryOptions<IBEResponseMakerDashboard, Error>>;

export default function useMakerAnalyticsQuery(
	queryOptions?: TQueryOptions,
): UseQueryResult<IBEResponseMakerDashboard, Error> {
	const enabled = queryOptions?.enabled ?? true;
	const queryConfig = {
		...appQueryKeys.maker.getDashboardStats(queryOptions?.params?.makerId),
		...queryPresets.longLived,
		...queryOptions,
		enabled,
	};

	const makerAnalyticsQuery = useQuery(queryConfig);

	return makerAnalyticsQuery;
}
