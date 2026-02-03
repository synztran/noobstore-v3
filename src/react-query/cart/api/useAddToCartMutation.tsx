import CartClient from "@/client/CartClient";
import { SuccessAddItem } from "@/components/CustomToastMessage";
import { HTTP_STATUS } from "@/constants/Enums/https";
import { ERROR_MESSAGES } from "@/constants/Errors";
import { IOption, IProductOption } from "@/interface/interface";
import { appQueryKeys } from "@/react-query/root";
import NotifyUtils from "@/utils/NotifyUtils";
import {
	useMutation,
	UseMutationOptions,
	useQueryClient,
} from "@tanstack/react-query";

interface Variables {
	payload: {
		products?: IProductOption[];
		service?: unknown[];
		usedProducts?: unknown[];
	};
}

export function useAddToCartMutation(
	mutationOptions: UseMutationOptions<unknown, Error, Variables> = {},
) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (variables) => {
			const resp = await CartClient.updateCart(variables.payload);
			if (resp.status !== HTTP_STATUS.Ok) {
				throw resp; // Throw the entire response object to access its properties in onError
			}
			return resp;
		},
		onError: (error: {
			name: string;
			status: number;
			errorCode: string;
			message: string;
		}) => {
			const mappingMessage = ERROR_MESSAGES[error?.errorCode];
			NotifyUtils.error(
				`${mappingMessage || error?.message || "Có lỗi xảy ra. Vui lòng thử lại"}`,
			);
		},
		onSuccess: (_, variables) => {
			NotifyUtils.success("Đã thêm vào giỏ hàng");
			queryClient.invalidateQueries(appQueryKeys.cart.cartData);
			queryClient.invalidateQueries(
				appQueryKeys.product.getProductOptions({
					productPart: variables?.payload?.products?.[0]?.productPart,
				}),
			);
		},
		...mutationOptions,
	});
}
