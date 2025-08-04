import { PRODUCT_OPTIONS_API } from "@/constants/APIUri";
import type { IResponse } from "@/interface/Client/interface";
import type { IProductOption } from "@/interface/interface";
import { EnumProductType } from "@/interface/interface";
import { POST } from ".";

const getProductOptions = async ({
	body,
	signal,
}: {
	body?: {
		productId?: string;
		productPart?: EnumProductType;
		productOptionIds?: string[];
	};
	signal: AbortSignal;
}): Promise<IResponse<IProductOption>> => {
	const url = PRODUCT_OPTIONS_API.GET;
	return POST({ url, body, isAuth: true, signal });
};

export default {
	getProductOptions,
};
