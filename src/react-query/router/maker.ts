import { getFirst, isValid } from "@/client";
import MakerClient from "@/client/MakerClient";
import { IBEResponseMaker } from "@/interface/Client/Maker";
import { createQueryKeys } from "@lukemorales/query-key-factory";

export const makerQueryKeys = createQueryKeys("maker", {
	getMakerInfo: (makerId?: string) => ({
		queryKey: [{ makerId }],
		async queryFn(): Promise<IBEResponseMaker | {}> {
			const response = await MakerClient.getMakerInfo(makerId);
			console.log("response", response);
			if (!isValid(response)) {
				return {};
			}
			return getFirst(response) || {};
		},
	}),
});
