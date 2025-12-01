import RaffleClient from "@/client/RaffleClient";
import ServiceClient from "@/client/ServiceClient";
import { SuccessRaffleJoin } from "@/components/CustomToastMessage";
import { IResponse } from "@/interface/Client/interface";
import { IRequestRaffleJoin } from "@/interface/Client/Raffle";
import {
	IRequestServiceDonation,
	IResponseBackendServicePayment,
	TRequestServiceSubmitPayment,
} from "@/interface/Client/Service";
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
			console.log("resp", resp);
			return resp;
		},
		onError: (_) => {
			NotifyUtils.error("Có lỗi xảy ra. Không thể tham gia raffle");
		},
		onSuccess: (
			resp: IResponse<IResponseBackendServicePayment>,
			variables: IVariable
		) => {
			// console.log("respSuccess", resp);
			// console.log("variables", variables);
			if (resp.status !== "OK") return;
			// const { serviceBookingId, transitionId } =
			//   variables.pSubmitPayment?.payment || {};
			// console.log("transitionId", transitionId);
			// console.log("serviceBookingId", serviceBookingId);
			// NotifyUtils.success(
			//   <SuccessRaffleJoin serviceBookingId={serviceBookingId} />
			// );
			queryClient.invalidateQueries(
				appQueryKeys.raffle.getDetailRaffle({
					raffleId: variables.payload?.raffleId || "",
				})
			);
		},
		...mutationOptions,
	});
}
