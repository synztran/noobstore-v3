import { IBEResponseRaffleInfo } from "@/interface/Client/Raffle";
import {
	useQuery,
	UseQueryOptions,
	UseQueryResult,
} from "@tanstack/react-query";
import { queryPresets } from "react-query/configs";
import { appQueryKeys } from "react-query/root";

type IQueryOptions = {
	params?: { featuredOnly?: boolean };
	enabled?: boolean | (() => boolean);
} & Partial<(typeof queryPresets)[keyof typeof queryPresets]> &
	Partial<UseQueryOptions<IBEResponseRaffleInfo[], Error>>;

export default function useRafflesQuery(
	queryOptions?: IQueryOptions
): UseQueryResult<IBEResponseRaffleInfo[], Error> {
	const enabled = queryOptions?.enabled ?? true;
	const queryConfig = {
		...appQueryKeys.raffle.getRaffles(queryOptions?.params),
		...queryPresets.longLived,
		...queryOptions,
		enabled,
	};

	const rafflesQuery = useQuery(queryConfig);
	return rafflesQuery;
}
