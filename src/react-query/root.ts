import { mergeQueryKeys } from "@lukemorales/query-key-factory";
import { cartQueryKeys } from "./router/cart";
import { categoryQueryKeys } from "./router/category";
import { configQueryKeys } from "./router/config";
import { orderQueryKeys } from "./router/order";
import { productQueryKeys } from "./router/product";
import { userQueryKeys } from "./router/user";

export const appQueryKeys = mergeQueryKeys(
	cartQueryKeys,
	userQueryKeys,
	categoryQueryKeys,
	productQueryKeys,
	configQueryKeys,
	orderQueryKeys
);

export type AppQueryKeys = typeof appQueryKeys;
