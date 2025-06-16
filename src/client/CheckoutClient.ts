import { GET, POST } from "@/client/index";
import { CHECKOUT_API } from "@/constants/APIUri";
import { IDataPostCheckout } from "@/interface/Client/Checkout";
import { IResponse } from "@/interface/Client/interface";
import { IOrder, IOrdered } from "@/interface/Client/Order";

const postCheckout = async (
	data: IDataPostCheckout
): Promise<IResponse<IOrder>> => {
	const url = CHECKOUT_API.CHECKOUT;
	const body = {
		...data,
	};
	return POST({ url, body, isAuth: true });
};

const getOrderDetail = async (
	orderId: string
): Promise<IResponse<IOrdered>> => {
	const url = CHECKOUT_API.ORDER_DETAIL;
	const params = {
		orderId,
	};
	return GET({ url, params, isAuth: true });
};

export default {
	postCheckout,
	getOrderDetail,
};
