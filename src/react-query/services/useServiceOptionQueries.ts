import { IServiceDefaultOption } from "@/zustand/useServices";
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
	Partial<
		UseQueryOptions<
			Record<
				"PACKAGE_METHOD" | "DELIVERY_METHOD" | "EXTRA_METHOD",
				IServiceDefaultOption[]
			>,
			Error
		>
	>;

export default function useServiceDefaultOptionQuery(
	planId: Parameters<typeof appQueryKeys.service.getPlans>[0] = "",
	queryOptions?: IQueryOptions
): UseQueryResult<
	Record<
		"PACKAGE_METHOD" | "DELIVERY_METHOD" | "EXTRA_METHOD",
		IServiceDefaultOption[]
	>,
	Error
> {
	const enabled = queryOptions?.enabled ?? true;
	const queryConfig = {
		...appQueryKeys.service.getServiceOptions,
		...queryPresets.longLived,
		...queryOptions,
		enabled,
	};

	const serviceDefaultOptionQuery = useQuery(queryConfig);

	return serviceDefaultOptionQuery;
}
