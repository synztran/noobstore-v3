import ProductsClient from "@/client/ProductsClient";
import { SuccessDeleteProduct } from "@/components/CustomToastMessage";
import { appQueryKeys } from "@/react-query/root";
import NotifyUtils from "@/utils/NotifyUtils";
import {
	useMutation,
	UseMutationOptions,
	useQueryClient,
} from "@tanstack/react-query";

interface IVariable {
	payload: {
		productOptionId: string;
	};
}

export function useDeleteProductOptionMutation(
	mutationOptions: UseMutationOptions<unknown, Error, IVariable> = {}
) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (variables) => {
			const resp = await ProductsClient.postDeleteProductOption({
				body: { productOptionId: variables.payload.productOptionId },
				signal: new AbortController().signal,
			});
			console.log("resp", resp);
			return resp;
		},
		onError: (_) => {
			NotifyUtils.error("Có lỗi xảy ra. Không thể xóa sản phẩm");
		},
		onSuccess: (_, variables) => {
			const { productOptionId } = variables.payload;
			NotifyUtils.success(
				<SuccessDeleteProduct productId={productOptionId} />
			);
			queryClient.invalidateQueries(
				appQueryKeys.product.getProductOptions({})
			);
		},
		...mutationOptions,
	});
}
