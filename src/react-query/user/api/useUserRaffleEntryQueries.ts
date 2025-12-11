import { useQuery } from "@tanstack/react-query";
import { queryPresets } from "react-query/configs";
import { appQueryKeys } from "react-query/root";

export default function useUserRaffleEntryQueries(
	queryOptions?:
		| (typeof queryPresets)[keyof typeof queryPresets]
		| { enabled?: boolean }
) {
	const userQuery = useQuery({
		...appQueryKeys.user.getRaffleEntries,
		...queryPresets.longLived,
		...queryOptions,
	});

	return userQuery;
}
