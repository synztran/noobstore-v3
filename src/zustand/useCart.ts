import { getFirst } from "@/client";
import CartClient from "@/client/CartClient";
import { ICart } from "@/interface/Client/Cart";
import { IResponse } from "@/interface/Client/interface";
import { ICartFee } from "@/interface/interface";
import NotifyUtils from "@/utils/NotifyUtils";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface IRespAddToCart {
	code: number;
	message: string;
	status: string;
	data: any;
}

interface IResponseUpdateQuantity {
	code: number;
	message: string;
	status: string;
	data?: any;
	errorCode?: string;
}

interface Actions {
	// fetchCartData: () => void
	// addToCart: (payload: any) => Promise<IRespAddToCart>;
	removeItemCart: (payload: {
		cartId: string;
		productId: string;
		productOptionId?: string;
	}) => void;
	updateProductCartQuantity: (payload: {
		cartId: string;
		productId: string;
		quantity: number;
		productOptionId?: string;
	}) => Promise<IResponse<ICart>>;
	setIniting: (isFetching: boolean) => void;
	setData: (payload: any) => void;
}

interface InitialCartState {
	cart: {
		cartId: string;
		fees: ICartFee;
		products: any[];
		services: any[];
		totalPrice: number;
		totalProductQuantity: number;
		updatedAt: string;
	};
	isIniting: boolean;
}

type CartState = InitialCartState & { actions: Actions };

const InitialState = {
	cart: {
		cartId: "",
		fees: {
			shipping: 0,
			tax: 0,
			handling: 0,
			voucherCode: "",
			voucherDiscount: 0,
		},
		products: [],
		services: [],
		totalPrice: 0,
		totalProductQuantity: 0,
		updatedAt: "",
	},
	isIniting: true,
};

const useCart = create<CartState>()(
	devtools((set, get) => ({
		...InitialState,
		actions: {
			// addToCart: async (payload) => {
			// 	try {
			// 		const respUpdateCart = await CartClient.updateCart(payload);
			// 		return respUpdateCart;
			// 	} catch (err) {
			// 		NotifyUtils.error(err.message);
			// 	}
			// },
			removeItemCart: async (payload) => {
				try {
					const respRemoveItem =
						await CartClient.removeCartItem(payload);
					if (respRemoveItem.status === "OK") {
						set({
							cart: getFirst(
								respRemoveItem
							) as unknown as InitialCartState["cart"],
						});
					} else {
						NotifyUtils.error(respRemoveItem.message);
					}
				} catch (err) {
					NotifyUtils.error(err.message);
				}
			},
			updateProductCartQuantity: async (payload) => {
				try {
					const respUpdateCart: IResponse<ICart> =
						await CartClient.updateCartProductQuantity(payload);
					if (respUpdateCart.status === "OK") {
						set({
							cart: getFirst(
								respUpdateCart
							) as unknown as InitialCartState["cart"],
						});
					}
					return respUpdateCart;
				} catch (err) {
					NotifyUtils.error(err.message);
					throw err;
				}
			},
			setIniting: (isIniting) => {
				set((state) => ({
					...state,
					isIniting,
				}));
			},
			setData: (payload) => {
				set((state) => ({
					...state,
					cart: payload,
				}));
			},
		},
	}))
);

export const useCartAction = () => useCart((state) => state.actions);

export default useCart;
