import MakerClient from "@/client/MakerClient";
import { IResponse } from "@/interface/Client/interface";
import { IPayloadVerifyEmailMaker } from "@/interface/Client/Maker";
import { appQueryKeys } from "@/react-query/root";
import NotifyUtils from "@/utils/NotifyUtils";
import {
	useMutation,
	UseMutationOptions,
	useQueryClient,
} from "@tanstack/react-query";

interface IVariable {
	payload: IPayloadVerifyEmailMaker;
}

export function useMakerSendVerifyEmailMutation(
	mutationOptions: UseMutationOptions<
		IResponse<unknown>,
		Error,
		IVariable
	> = {},
) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (variables) => {
			const resp = await MakerClient.postSendVerifyEmail(
				variables.payload,
			);
			return resp;
		},
		onError: (_) => {
			NotifyUtils.error(
				"Có lỗi xảy ra. Không thể gửi email xác thực maker",
			);
		},
		onSuccess: (
			resp: IResponse<{
				makerId: string;
			}>,
			variables: IVariable,
		) => {
			console.log("resp", resp, resp?.data);
			// Always try to invalidate the raffle detail query
			if (resp.data?.[0]?.makerId) {
				queryClient.invalidateQueries(appQueryKeys.user.getAccountInfo);
			}

			// Then handle the response status
			if (resp.status !== "OK") {
				NotifyUtils.error(
					"Có lỗi xảy ra. Không thể gửi email xác thực maker",
				);
				return;
			}

			NotifyUtils.success(
				"Gửi email xác thực maker thành công. Vui lòng kiểm tra email để xác nhận.",
			);
		},
		...mutationOptions,
	});
}
