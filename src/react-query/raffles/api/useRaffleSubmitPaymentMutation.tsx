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
	payload: IPayloadSubmitRafflePayment;
}

export function useRaffleSubmitPaymentMutation(
	mutationOptions: UseMutationOptions<unknown, Error, IVariable> = {},
) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (variables) => {
			const resp = await RaffleClient.postRaffleSubmitPayment(
				variables.payload,
			);
			return resp;
		},
		onError: (_) => {
			NotifyUtils.error("Có lỗi xảy ra. Không thể gửi thanh toán");
		},
		onSuccess: (
			resp: IResponse<{
				raffleId: string;
				entryId: string;
			}>,
			variables: IVariable,
		) => {
			// Always try to invalidate the raffle detail query
			if (resp.data?.[0]?.raffleId) {
				queryClient.invalidateQueries(
					appQueryKeys.user.getRaffleEntries,
				);
			}

			// Then handle the response status
			if (resp.status !== "OK") {
				NotifyUtils.error("Có lỗi xảy ra. Không thể gửi thanh toán");
				return;
			}

			if (resp.data?.length === 0 || !resp.data?.[0]) {
				NotifyUtils.error(
					"Không tìm thấy đơn hàng để cập nhật trạng thái thanh toán",
				);
				return;
			}

			NotifyUtils.success("Thanh toán thành công");
		},
		...mutationOptions,
	});
}
