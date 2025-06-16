import { queryPresets } from "@/react-query/configs";
import { appQueryKeys } from "@/react-query/root";
import { useQuery } from "@tanstack/react-query";

type TQueryOptions = {
	enabled?: boolean | (() => boolean);
} & Partial<(typeof queryPresets)[keyof typeof queryPresets]>;

export default function useConfigQueries(queryOptions?: TQueryOptions): any {
	const configQuery = useQuery({
		...appQueryKeys.config.getAll,
		...queryPresets.temporary,
		...queryOptions,
	});

	return configQuery;
}
