import { getFirst, isValid } from "@/client";
import CartClient from "@/client/CartClient";
import { ICart } from "@/interface/Client/Cart";
import { createQueryKeys } from "@lukemorales/query-key-factory";

export const cartQueryKeys = createQueryKeys("cart", {
	cartData: {
		queryKey: null,
		async queryFn(): Promise<ICart | {}> {
			const response = await CartClient.getCart();
			if (!isValid(response)) {
				return {};
			}
			return getFirst(response) || {};
		},
	},
});
