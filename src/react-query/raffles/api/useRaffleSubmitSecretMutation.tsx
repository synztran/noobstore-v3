import RaffleClient from "@/client/RaffleClient";
import { IResponse } from "@/interface/Client/interface";
import NotifyUtils from "@/utils/NotifyUtils";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

interface IVariable {
	payload: {
		raffleId: string;
		secretKey: string;
	};
}

export function useRaffleSubmitSecretMutation(
	mutationOptions: UseMutationOptions<unknown, Error, IVariable> = {}
) {
	// const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (variables) => {
			const resp = await RaffleClient.postRaffleSubmitSecretKey(
				variables.payload
			);

			console.log("resp", resp);
			return resp;
		},
		onError: (_) => {
			NotifyUtils.error("Có lỗi xảy ra. Không thể tham gia raffle");
		},
		onSuccess: (resp: IResponse<unknown>, variables: IVariable) => {
			if (resp.status !== "OK") return;
		},
		...mutationOptions,
	});
}
