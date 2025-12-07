import UserClient from "@/client/UserClient";
import { IResponse } from "@/interface/Client/interface";
import { IRequestShippingAddress } from "@/interface/Context/auth";
import { appQueryKeys } from "@/react-query/root";
import NotifyUtils from "@/utils/NotifyUtils";
import {
	useMutation,
	UseMutationOptions,
	useQueryClient,
} from "@tanstack/react-query";

interface IVariable {
	payload: IRequestShippingAddress;
}

export function useUserAddShippingAddressMutation(
	mutationOptions: UseMutationOptions<unknown, Error, IVariable> = {}
) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (variables) => {
			const resp = await UserClient.postNewUserShippingAddress(
				variables.payload
			);

			console.log("resp", resp);
			return resp;
		},
		onError: (_) => {
			NotifyUtils.error(
				"Có lỗi xảy ra. Không thể thêm địa chỉ giao hàng"
			);
		},
		onSuccess: (resp: IResponse<unknown>, variables: IVariable) => {
			if (resp.status !== "OK") return;
			queryClient.invalidateQueries(appQueryKeys.user.getAccountInfo);
		},
		...mutationOptions,
	});
}
