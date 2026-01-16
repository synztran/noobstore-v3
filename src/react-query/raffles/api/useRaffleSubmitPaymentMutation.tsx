import RaffleClient from "@/client/RaffleClient";
import { IResponse } from "@/interface/Client/interface";
import { IPayloadSubmitRafflePayment } from "@/interface/Client/Raffle";
import { appQueryKeys } from "@/react-query/root";
import NotifyUtils from "@/utils/NotifyUtils";
import {
	useMutation,
	UseMutationOptions,
	useQueryClient,
} from "@tanstack/react-query";

interface IVariable {
	payload?: IPayloadSubmitRafflePayment;
}

export function useRaffleSubmitPaymentMutation(
	mutationOptions: UseMutationOptions<unknown, Error, IVariable> = {}
) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (variables) => {
			const resp = await RaffleClient.postRaffleSubmitPayment(
				variables.payload
			);
			return resp;
		},
		onError: (_) => {
			NotifyUtils.error("Có lỗi xảy ra. Không thể gửi thanh toán");
		},
		onSuccess: (resp: IResponse<any>, variables: IVariable) => {
			if (resp.status !== "OK") return;
			NotifyUtils.success("Thanh toán thành công");
			queryClient.invalidateQueries(appQueryKeys.raffle.getRaffles());
		},
		...mutationOptions,
	});
}
