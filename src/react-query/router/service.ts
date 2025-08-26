import { getData, getFirst, isValid } from "@/client";
import ServiceClient from "@/client/ServiceClient";
import { createQueryKeys } from "@lukemorales/query-key-factory";

export const serviceQueryKeys = createQueryKeys("service", {
	getDefinitions: (params: { category?: string } = {}) => ({
		queryKey: [{ params }],
		async queryFn() {
			const resp = await ServiceClient.getDefinitions(params);
			if (!isValid(resp)) return [];
			return getData(resp);
		},
	}),
	getPlans: {
		queryKey: null,
		async queryFn() {
			const resp = await ServiceClient.getPlans();
			if (!isValid(resp)) return [];
			return getData(resp);
		},
	},
	getTasks: {
		queryKey: null,
		async queryFn() {
			const resp = await ServiceClient.getTasks();
			if (!isValid(resp)) return [];
			return getData(resp);
		},
	},
	getBooking: {
		queryKey: null,
		async queryFn() {
			const resp = await ServiceClient.getBooking();
			if (!isValid(resp)) return {};
			return getFirst(resp) || {};
		},
	},
	updateServiceBookingIntoCart: (payload: unknown) => ({
		queryKey: [{ payload }],
		async queryFn() {
			const resp = await ServiceClient.upsertBooking(payload);
			if (!isValid(resp)) throw new Error("Failed to update booking");
			return getFirst(resp);
		},
	}),
});
