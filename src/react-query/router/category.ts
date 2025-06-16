import { getData, isValid } from "@/client";
import CategoryClient from "@/client/CategoryClient";
import { ICategory } from "@/interface/interface";
import { createQueryKeys } from "@lukemorales/query-key-factory";

export const categoryQueryKeys = createQueryKeys("category", {
	getAll: (params: { status?: string; isValidate?: boolean }) => ({
		queryKey: [{ params }],
		queryFn: async ({ signal }) => {
			const response = await CategoryClient.getAllCategory({
				params,
				signal,
			});
			console.log("response", response);
			if (!isValid(response)) {
				return [];
			}
			return getData(response);
		},
	}),
	create: (data: ICategory) => ({
		queryKey: [{ data }],
		queryFn: async ({ signal }) => {
			const body = {
				...data,
			};
			const response = await CategoryClient.postCreateCategory({
				body,
				signal,
			});
			if (!isValid(response)) {
				throw new Error("Failed to create category");
			}
			return getData(response);
		},
	}),
});
