import RaffleClient from "@/client/RaffleClient";
import { IResponse } from "@/interface/Client/interface";
import { IRequestRaffleCreation } from "@/interface/Client/Raffle";
import NotifyUtils from "@/utils/NotifyUtils";
import {
	useMutation,
	UseMutationOptions,
	useQueryClient,
} from "@tanstack/react-query";

interface IVariable {
	payload?: IRequestRaffleCreation;
}

export function useRaffleCreateMutation(
	mutationOptions: UseMutationOptions<unknown, Error, IVariable> = {},
) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (variables) => {
			if (!variables.payload) throw new Error("Missing payload");
			const resp = await RaffleClient.postRaffleCreation(
				variables.payload,
			);
			return resp;
		},
		onError: (_) => {
			NotifyUtils.error("Có lỗi xảy ra. Không thể tham gia raffle");
		},
		onSuccess: (resp: IResponse<any>, variables: IVariable) => {
      if (resp.status !== "OK") return;
      NotifyUtils.success("Tạo raffle thành công");
      // Invalidate raffle list query to refetch updated data
      queryClient.invalidateQueries({
        queryKey: ["raffleList"],
      });
		},
		...mutationOptions,
	});
}
