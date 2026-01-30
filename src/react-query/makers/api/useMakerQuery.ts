import { IBEResponseMaker } from "@/interface/Client/Maker";
import {
	useQuery,
	UseQueryOptions,
	UseQueryResult,
} from "@tanstack/react-query";
import { queryPresets } from "react-query/configs";
import { appQueryKeys } from "react-query/root";

type TQueryOptions = {
	enabled?: boolean | (() => boolean);
	params?: { makerId?: string };
} & Partial<(typeof queryPresets)[keyof typeof queryPresets]> &
	Partial<UseQueryOptions<IBEResponseMaker, Error>>;

export default function useMakerQuery(
	queryOptions?: TQueryOptions,
): UseQueryResult<IBEResponseMaker, Error> {
	const enabled = queryOptions?.enabled ?? true;
	const queryConfig = {
		...appQueryKeys.maker.getMakerInfo(queryOptions?.params?.makerId),
		...queryPresets.longLived,
		...queryOptions,
		enabled,
	};

	const makerQuery = useQuery(queryConfig);

	return makerQuery;
}
