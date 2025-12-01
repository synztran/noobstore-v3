import { getData, getFirst, isValid } from "@/client";
import ServiceClient from "@/client/ServiceClient";
import { IResponse } from "@/interface/Client/interface";
import {
	IResponseBackendServiceBooking,
	IResponseBackendServicePayment,
} from "@/interface/Client/Service";
import {
	EnumServiceFeeType,
	IServiceDefaultOption,
	IServiceFee,
} from "@/zustand/useServices";
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
	getPlans: (planId?: string) => ({
		queryKey: [{ planId }],
		async queryFn() {
			const resp = await ServiceClient.getPlans(planId);
			if (!isValid(resp)) return [];
			return getData(resp);
		},
	}),
	getTasks: {
		queryKey: null,
		async queryFn() {
			const resp = await ServiceClient.getTasks();
			if (!isValid(resp)) return [];
			return getData(resp);
		},
	},
	getServiceOptions: {
		queryKey: null,
		async queryFn() {
			const resp = await ServiceClient.getServiceOptions();
			if (!isValid(resp)) return {};
			const mapped: Record<
				"PACKAGE_METHOD" | "DELIVERY_METHOD" | "EXTRA_METHOD",
				IServiceDefaultOption[] | undefined
			> = {
				PACKAGE_METHOD: undefined,
				DELIVERY_METHOD: undefined,
				EXTRA_METHOD: undefined,
			};
			if (resp && resp.data) {
				for (const item of resp.data || []) {
					mapped[
						item.key as
							| "PACKAGE_METHOD"
							| "DELIVERY_METHOD"
							| "EXTRA_METHOD"
					] = item.options;
				}
			}
			return mapped;
		},
	},
	getFees: {
		queryKey: null,
		async queryFn() {
			const resp = await ServiceClient.getFees();
			if (!isValid(resp)) return {};
			const mapped: Record<EnumServiceFeeType, IServiceFee | undefined> =
				{
					[EnumServiceFeeType.PLATFORM]: undefined,
					[EnumServiceFeeType.OUT_OF_SERVICE_TIME]: undefined,
				};
			if (resp && resp.data) {
				for (const item of resp.data || []) {
					if (item && item !== undefined) {
						mapped[item?.value as EnumServiceFeeType] = item;
					}
				}
				return mapped;
			}
			return mapped;
		},
	},
	getBookingService: (bookingId: string) => ({
		queryKey: [{ bookingId }],
		async queryFn() {
			const params = {
				id: bookingId,
			};
			const resp: IResponse<IResponseBackendServiceBooking> =
				await ServiceClient.getBookingService(params);
			if (!isValid(resp)) return {};
			return getFirst(resp) || {};
		},
	}),
});
