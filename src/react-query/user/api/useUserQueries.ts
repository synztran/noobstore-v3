import { useQuery } from "@tanstack/react-query";
import { queryPresets } from "react-query/configs";
import { appQueryKeys } from "react-query/root";

export default function useUserQuery(
	queryOptions?:
		| (typeof queryPresets)[keyof typeof queryPresets]
		| { enabled?: boolean }
) {
	const userQuery = useQuery({
		...appQueryKeys.user.getAccountInfo,
		...queryPresets.longLived,
		...queryOptions,
	});

	return userQuery;
}
