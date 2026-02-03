import MakerClient from "@/client/MakerClient";
import { IResponse } from "@/interface/Client/interface";
import { IPayloadCreateMaker } from "@/interface/Client/Maker";
import { appQueryKeys } from "@/react-query/root";
import NotifyUtils from "@/utils/NotifyUtils";
import {
	useMutation,
	UseMutationOptions,
	useQueryClient,
} from "@tanstack/react-query";

interface IVariable {
	payload: IPayloadCreateMaker;
}

export function useCreateMakerMutation(
	mutationOptions: UseMutationOptions<
		IResponse<unknown>,
		Error,
		IVariable
	> = {},
) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (variables) => {
			const resp = await MakerClient.postCreateMaker(variables.payload);
			return resp;
		},
		onError: (_) => {
			NotifyUtils.error("Có lỗi xảy ra. Không thể tạo tài khoản maker");
		},
		onSuccess: (
			resp: IResponse<{
				makerId: string;
			}>,
			variables: IVariable,
		) => {
			// Always try to invalidate the raffle detail query
			if (resp.data?.[0]?.makerId) {
				queryClient.invalidateQueries(appQueryKeys.user.getAccountInfo);
			}

			// Then handle the response status
			if (resp.status !== "OK") {
				NotifyUtils.error(
					"Có lỗi xảy ra. Không thể tạo tài khoản maker",
				);
				return;
			}

			if (resp.data?.length === 0 || !resp.data?.[0]) {
				NotifyUtils.error(
					"Không tìm thấy thông tin để tạo tài khoản maker",
				);
				return;
			}

			NotifyUtils.success(
				"Tạo tài khoản maker thành công. Vui lòng kiểm tra email để xác nhận.",
			);
		},
		...mutationOptions,
	});
}
