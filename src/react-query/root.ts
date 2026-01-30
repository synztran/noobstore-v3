import { mergeQueryKeys } from "@lukemorales/query-key-factory";
import { cartQueryKeys } from "./router/cart";
import { categoryQueryKeys } from "./router/category";
import { configQueryKeys } from "./router/config";
import { makerQueryKeys } from "./router/maker";
import { orderQueryKeys } from "./router/order";
import { productQueryKeys } from "./router/product";
import { raffleQueryKeys } from "./router/raffle";
import { serviceQueryKeys } from "./router/service";
import { userQueryKeys } from "./router/user";

export const appQueryKeys = mergeQueryKeys(
	cartQueryKeys,
	userQueryKeys,
	categoryQueryKeys,
	productQueryKeys,
	configQueryKeys,
	orderQueryKeys,
	serviceQueryKeys,
	raffleQueryKeys,
	makerQueryKeys,
);

export type AppQueryKeys = typeof appQueryKeys;
