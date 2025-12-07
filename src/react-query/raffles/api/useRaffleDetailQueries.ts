import { IBEResponseRaffleInfo } from "@/interface/Client/Raffle";
import {
	useQuery,
	UseQueryOptions,
	UseQueryResult,
} from "@tanstack/react-query";
import { queryPresets } from "../../configs";
import { appQueryKeys } from "../../root";

type IQueryOptions = {
	params?: {
		raffleId: string;
	};
	enabled?: boolean | (() => boolean);
} & Partial<(typeof queryPresets)[keyof typeof queryPresets]> &
	Partial<UseQueryOptions<IBEResponseRaffleInfo, Error>>;

export default function useRaffleDetailQueries(
	queryOptions?: IQueryOptions
): UseQueryResult<IBEResponseRaffleInfo, Error> {
	const enabled = queryOptions?.enabled ?? true;
	const queryConfig = {
		...appQueryKeys.raffle.getDetailRaffle(queryOptions?.params),
		...queryPresets.longLived,
		...queryOptions,
		enabled,
	};

	const raffleFeaturedQuery = useQuery(queryConfig);

	return raffleFeaturedQuery;
}
