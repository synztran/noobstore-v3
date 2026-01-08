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
		productId: string;
	};
}

export function useDeleteProductMutation(
	mutationOptions: UseMutationOptions<unknown, Error, IVariable> = {}
) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (variables) => {
			const resp = await ProductsClient.deleteProduct({
				body: { productId: variables.payload.productId },
				signal: new AbortController().signal,
			});
			return resp;
		},
		onError: (_) => {
			NotifyUtils.error("Có lỗi xảy ra. Không thể xóa sản phẩm");
		},
		onSuccess: (_, variables) => {
			const { productId } = variables.payload;
			NotifyUtils.success(<CheckCircleDeleteProduct productId={productId} />);
			queryClient.invalidateQueries(
				appQueryKeys.product.getAllProducts()
			);
		},
		...mutationOptions,
	});
}
