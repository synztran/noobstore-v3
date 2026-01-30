import { getData, getFirst, isValid } from "@/client";
import UserClient from "@/client/UserClient";
import { createQueryKeys } from "@lukemorales/query-key-factory";

export const userQueryKeys = createQueryKeys("user", {
	getAccountInfo: {
		queryKey: null,
		async queryFn() {
			const response = await UserClient.getCurrentUser({});
			console.log("response", response);
			if (!isValid(response)) {
				return {};
			}
			return getFirst(response);
		},
	},
	getRaffleEntries: {
		queryKey: null,
		async queryFn() {
			const response = await UserClient.getRaffleEntries();
			if (!isValid(response)) {
				return [];
			}
			return getData(response);
		},
	},
});
