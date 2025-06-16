import { GET, PUT } from "@/client/index";
import { CART_API } from "@/constants/APIUri";
import {
	ICart,
	IRemoveCartItem,
	IUpdateCartProductQuantity,
} from "@/interface/Client/Cart";
import { IResponse } from "@/interface/Client/interface";

const updateCart = async (data: unknown): Promise<IResponse<ICart>> => {
	const url = CART_API.UPDATE_CART;
	return PUT({ url, body: data, isAuth: true });
};

const getCart = async (): Promise<IResponse<ICart>> => {
	const url = CART_API.GET_CART;
	return GET({ url, isAuth: true });
};

const removeCartItem = async (
	payload: IRemoveCartItem
): Promise<IResponse<ICart>> => {
	const url = CART_API.REMOVE_ITEM_CART;
	const body = {
		cartId: payload.cartId,
		productId: payload.productId,
	};

	return PUT({ url, body, isAuth: true });
};

const updateCartProductQuantity = async (
	payload: IUpdateCartProductQuantity
): Promise<any> => {
	const url = CART_API.UPDATE_CART_PRODUCT;
	const body = {
		cartId: payload.cartId,
		productId: payload.productId,
		quantity: payload.quantity,
		productOptionId: payload.productOptionId,
	};

	return PUT({ url, body, isAuth: true });
};

export default {
	updateCart,
	getCart,
	removeCartItem,
	updateCartProductQuantity,
};
