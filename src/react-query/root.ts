import { mergeQueryKeys } from "@lukemorales/query-key-factory";
import { cartQueryKeys } from "./router/cart";
import { categoryQueryKeys } from "./router/category";
import { configQueryKeys } from "./router/config";
import { orderQueryKeys } from "./router/order";
import { productQueryKeys } from "./router/product";
import { userQueryKeys } from "./router/user";
import { serviceQueryKeys } from "./router/service";
import { raffleQueryKeys } from "./router/raffle";

export const appQueryKeys = mergeQueryKeys(
	cartQueryKeys,
	userQueryKeys,
	categoryQueryKeys,
	productQueryKeys,
	configQueryKeys,
	orderQueryKeys,
	serviceQueryKeys,
	raffleQueryKeys
);

export type AppQueryKeys = typeof appQueryKeys;
