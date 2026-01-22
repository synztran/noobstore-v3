import CartClient from "@/client/CartClient";
import { HTTP_STATUS } from "@/constants/Enums/https";
import { ERROR_MESSAGES } from "@/constants/Errors";
import { ICart } from "@/interface/Client/Cart";
import { IResponse } from "@/interface/Client/interface";
import { appQueryKeys } from "@/react-query/root";
import NotifyUtils from "@/utils/NotifyUtils";
import {
	useMutation,
	UseMutationOptions,
	useQueryClient,
} from "@tanstack/react-query";
import { useRef } from "react";

interface QuantityMutationVariables {
	cartId: string;
	productId: string;
	quantity: number;
	productOptionId?: string;
}

interface QuantityMutationContext {
	previousCart: ICart | undefined;
}

// Debounce time in milliseconds - adjust based on your needs
const INVALIDATE_DEBOUNCE_MS = 1000;

export function useCartQuantityMutation(
	mutationOptions: UseMutationOptions<
		IResponse<ICart>,
		Error,
		QuantityMutationVariables,
		QuantityMutationContext
	> = {},
) {
	const queryClient = useQueryClient();
	const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

	const debouncedInvalidate = () => {
		// Clear existing timer if any
		if (debounceTimerRef.current) {
			clearTimeout(debounceTimerRef.current);
		}

		// Set new timer - will only fire if no new mutations happen within INVALIDATE_DEBOUNCE_MS
		debounceTimerRef.current = setTimeout(() => {
			queryClient.invalidateQueries(appQueryKeys.cart.cartData);
			debounceTimerRef.current = null;
		}, INVALIDATE_DEBOUNCE_MS);
	};

	return useMutation({
		mutationFn: async (variables) => {
			const resp = await CartClient.updateCartProductQuantity(variables);
			if (resp.status !== HTTP_STATUS.Ok && resp.status !== "OK") {
				throw resp;
			}
			return resp;
		},
		onMutate: async (variables) => {
			// Cancel any outgoing refetches to prevent overwriting optimistic update
			await queryClient.cancelQueries(appQueryKeys.cart.cartData);

			// Get the previous cart data
			const previousCart = queryClient.getQueryData<ICart>(
				appQueryKeys.cart.cartData.queryKey,
			);

			// Optimistically update the cart quantity
			if (previousCart) {
				queryClient.setQueryData<ICart>(
					appQueryKeys.cart.cartData.queryKey,
					(old) => {
						if (!old) return old;

						return {
							...old,
							products: old.products.map((product) => {
								const isTarget =
									product.productId === variables.productId &&
									(!variables.productOptionId ||
										product.productId ===
											variables.productId);

								if (isTarget) {
									return {
										...product,
										quantity: variables.quantity,
									};
								}
								return product;
							}),
							totalProductQuantity:
								old.totalProductQuantity -
								(old.products.find(
									(p) =>
										p.productId === variables.productId &&
										(!variables.productOptionId ||
											p.productId ===
												variables.productId),
								)?.quantity || 0) +
								variables.quantity,
						};
					},
				);
			}

			return { previousCart };
		},
		onError: (
			error: any,
			_variables,
			context: QuantityMutationContext | undefined,
		) => {
			// Rollback to previous cart on error
			if (context?.previousCart) {
				queryClient.setQueryData(
					appQueryKeys.cart.cartData.queryKey,
					context.previousCart,
				);
			}

			// Handle error messaging
			const errorCode = error?.errorCode;
			const mappingMessage = ERROR_MESSAGES[errorCode];
			NotifyUtils.error(
				mappingMessage ||
					error?.message ||
					"Có lỗi xảy ra. Vui lòng thử lại",
			);
		},
		onSuccess: () => {
			NotifyUtils.success("Cập nhật số lượng thành công");
			// Use debounced invalidate to batch multiple mutations
			debouncedInvalidate();
		},
		...mutationOptions,
	});
}
