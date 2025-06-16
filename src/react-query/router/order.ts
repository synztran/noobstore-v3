import { getFirst, isValid } from "@/client";
import CheckoutClient from "@/client/CheckoutClient";
import { IOrdered } from "@/interface/Client/Order";
import { createQueryKeys } from "@lukemorales/query-key-factory";

export const orderQueryKeys = createQueryKeys("order", {
	getOrderDetail: (orderId: string) => ({
		queryKey: [{ orderId }],
		async queryFn(): Promise<IOrdered | {}> {
			const response = await CheckoutClient.getOrderDetail(orderId);
			if (!isValid(response)) {
				return {};
			}
			return getFirst(response) || {};
		},
	}),
});
