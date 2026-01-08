import CartClient from "@/client/CartClient";
import { SuccessRemoveItem } from "@/components/CustomToastMessage";
import { HTTP_STATUS } from "@/constants/Enums/https";
import { IRemoveCartItem } from "@/interface/Client/Cart";
import { appQueryKeys } from "@/react-query/root";
import NotifyUtils from "@/utils/NotifyUtils";
import {
	useMutation,
	UseMutationOptions,
	useQueryClient,
} from "@tanstack/react-query";

interface Variables {
	payload: IRemoveCartItem & { productName: string };
}

export function useRemoveItemMutation(
	mutationOptions: UseMutationOptions<unknown, Error, Variables> = {}
) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (variables) => {
			const resp = await CartClient.removeCartItem(variables.payload);
			if (resp.status !== HTTP_STATUS.Ok) {
				throw new Error(resp.message);
			}
			return resp;
		},
		onError: (_) => {
			NotifyUtils.error(
				"Có lỗi xảy ra. Không thể xóa sản phẩm trong giỏ hàng"
			);
		},
		onSuccess: (_, variables) => {
			const { productName } = variables.payload;
			NotifyUtils.success(
				<CheckCircleRemoveItem productName={productName} />
			);
			queryClient.invalidateQueries(appQueryKeys.cart.cartData);
		},
		...mutationOptions,
	});
}
