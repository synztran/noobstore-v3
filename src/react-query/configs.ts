import { QueryObserverOptions } from "@tanstack/react-query";

type TQueryConfig =
	| "eternity"
	| "longLived"
	| "shortLived"
	| "temporary"
	| "withSocket";

type QueryPresets = Record<
	TQueryConfig,
	{
		cacheTime: number;
		staleTime: number;
		refetchOnMount: boolean | "always";
		refetchOnWindowFocus: boolean | "always";
		refetchOnReconnect: boolean | "always";
	}
>;

export const queryPresets = Object.freeze({
	/**
	 * Use case: data that when in app, rarely change.
	 * Example: user profile, app config, etc.
	 */
	eternity: {
		cacheTime: Infinity,
		staleTime: Infinity,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
	},
	/**
	 * Use case: data that not change frequently.
	 * Example: list of product, list of category, etc.
	 */
	longLived: {
		cacheTime: 10 * 60 * 1000,
		staleTime: 50 * 60 * 1000,
		refetchOnMount: true,
		refetchOnWindowFocus: false,
		refetchOnReconnect: true,
	},
	/**
	 * Use case: data that change quite often.
	 * Example: comment, react, etc.
	 */
	shortLived: {
		cacheTime: 5 * 60 * 1000,
		staleTime: 0,
		refetchOnMount: true,
		refetchOnWindowFocus: false,
		refetchOnReconnect: true,
	},
	/**
	 * Use case: data that need to be newest and no unexpected refetch when using it.
	 * Example: payment detail, etc.
	 */
	temporary: {
		cacheTime: 0,
		staleTime: 0,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
	},
	/**
	 * Use case: data that manually been update using socket.
	 */
	withSocket: {
		cacheTime: 5 * 60 * 1000,
		staleTime: Infinity,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
	},
});

export function getQueriesConfig<TError = unknown>(
	config: Partial<QueryObserverOptions<unknown, TError>> = {}
): QueryObserverOptions<unknown, TError> {
	return {
		// Default configs
		retry: 2,
		// keepPreviousData: true,
		queryKey: [],
		...queryPresets.temporary,
		// Custom configs
		...config,
	};
}

export const DEFAULT_GET_PAGE_LIMIT = 20;
