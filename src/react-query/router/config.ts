import { getFirst, isValid } from "@/client";
import ConfigClient from "@/client/ConfigClient";
import { createQueryKeys } from "@lukemorales/query-key-factory";

export const configQueryKeys = createQueryKeys("config", {
	getAll: {
		queryKey: null,
		async queryFn() {
			const response = await ConfigClient.getAllConfig();
			console.log(response);
			if (!isValid(response)) {
				return {};
			}
			return getFirst(response);
		},
	},
});
