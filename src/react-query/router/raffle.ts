import { getData, getFirst, isValid } from "@/client";
import RaffleClient from "@/client/RaffleClient";
import { createQueryKeys } from "@lukemorales/query-key-factory";

export const raffleQueryKeys = createQueryKeys("raffle", {
	getDetailRaffle: (params?: { raffleId: string }) => ({
		queryKey: [{ params }],
		async queryFn() {
			const resp = await RaffleClient.getDetailRaffle(params);
			if (!isValid(resp)) return null;
			return getFirst(resp) || [];
		},
	}),
	getRaffles: (params: { featuredOnly?: boolean }) => ({
		queryKey: [{ params }],
		async queryFn() {
			const resp = await RaffleClient.getRaffles(params);
			if (!isValid(resp)) return [];
			return getData(resp);
		},
	}),
});
