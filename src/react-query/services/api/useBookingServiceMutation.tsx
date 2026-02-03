import ServiceClient from "@/client/ServiceClient";
import {
	SuccessCreateCategory,
	SuccessSubmitPayment,
} from "@/components/CustomToastMessage";
import { IResponse } from "@/interface/Client/interface";
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
	pSubmitPayment?: {
		payment: TRequestServiceSubmitPayment;
		donation?: IRequestServiceDonation | null;
	};
}

export function useSubmitPaymentMutation(
	mutationOptions: UseMutationOptions<unknown, Error, IVariable> = {},
) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (variables) => {
			const resp = await ServiceClient.postSubmitPayment(
				variables.pSubmitPayment,
			);
			return resp;
		},
		onError: (_) => {
			NotifyUtils.error("Có lỗi xảy ra. Không thể gửi thanh toán");
		},
		onSuccess: (
			resp: IResponse<IResponseBackendServicePayment>,
			variables: IVariable,
		) => {
			if (resp.status !== "OK") return;
			const { serviceBookingId, transitionId } =
				variables.pSubmitPayment?.payment || {};
			// NotifyUtils.success(
			// 	<CheckCircleSubmitPayment
			// 		serviceBookingId={serviceBookingId}
			// 	/>,
			// );
			NotifyUtils.success("Gửi thanh toán thành công");
			queryClient.invalidateQueries(
				appQueryKeys.service.getBookingService(serviceBookingId || ""),
			);
		},
		...mutationOptions,
	});
}
