import { getFirst, isValid } from "@/client";
import MakerClient from "@/client/MakerClient";
import {
	IBEResponseMaker,
	IBEResponseMakerDashboard,
} from "@/interface/Client/Maker";
import { createQueryKeys } from "@lukemorales/query-key-factory";

export const makerQueryKeys = createQueryKeys("maker", {
	getMakerInfo: (makerId?: string) => ({
		queryKey: [{ makerId }],
		async queryFn(): Promise<IBEResponseMaker | {}> {
			const response = await MakerClient.getMakerInfo(makerId);
			if (!isValid(response)) {
				return {};
			}
			return getFirst(response) || {};
		},
	}),
	getDashboardStats: (makerId?: string) => ({
		queryKey: [{ makerId }],
		async queryFn(): Promise<IBEResponseMakerDashboard | {}> {
			const response = await MakerClient.getMakerDashboardStats({
				makerId: makerId || "",
			});
			if (!isValid(response)) {
				return {};
			}
			return getFirst(response) || {};
		},
	}),
});
