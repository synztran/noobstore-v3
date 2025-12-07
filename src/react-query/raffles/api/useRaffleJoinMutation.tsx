import RaffleClient from "@/client/RaffleClient";
import { IResponse } from "@/interface/Client/interface";
import { IRequestRaffleJoin } from "@/interface/Client/Raffle";
import { IResponseBackendServicePayment } from "@/interface/Client/Service";
import { appQueryKeys } from "@/react-query/root";
import NotifyUtils from "@/utils/NotifyUtils";
import {
	useMutation,
	UseMutationOptions,
	useQueryClient,
} from "@tanstack/react-query";

interface IVariable {
	payload?: IRequestRaffleJoin;
}

export function useRaffleJoinMutation(
	mutationOptions: UseMutationOptions<unknown, Error, IVariable> = {}
) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (variables) => {
			const resp = await RaffleClient.postRaffleJoin(variables.payload);
			return resp;
		},
		onError: (_) => {
			NotifyUtils.error("Có lỗi xảy ra. Không thể tham gia raffle");
		},
		onSuccess: (
			resp: IResponse<IResponseBackendServicePayment>,
			variables: IVariable
		) => {
			console.log("resp", resp);
			if (resp.status !== "OK") return;
			queryClient.invalidateQueries(
				appQueryKeys.raffle.getDetailRaffle({
					raffleId: variables.payload?.raffleId || "",
				})
			);
		},
		...mutationOptions,
	});
}
