import { PRODUCTS_API, USED_PRODUCT_API } from "@/constants/APIUri";
import { IResponse } from "@/interface/Client/interface";
import {
	EnumProductType,
	IProduct,
	IProductOption,
} from "@/interface/interface";
import { GET, POST, PUT } from ".";

const getProductById = async ({ id }: { id: string }) => {
	const url = PRODUCTS_API.DETAIL;
	return GET({ url, isAuth: true, params: { id } });
};

const getProductsByCategoryID = async ({
	categoryId,
}: {
	categoryId: string;
}): Promise<IResponse<IProduct>> => {
	const url = PRODUCTS_API.ALL_DETAIL;
	return GET({ url, isAuth: true, params: { categoryId } });
};

const postUsedProduct = async ({ data }: { data: any }) => {
	const url = USED_PRODUCT_API.POSTING;
	const body = {
		...data,
	};

	return POST({ url, body, isAuth: true });
};

const getAllUsedProduct = async ({ signal }: { signal: AbortSignal }) => {
	const url = USED_PRODUCT_API.GET_ALL;
	return GET({ url, isAuth: true, signal });
};

const getAllProducts = async ({ signal }: { signal: AbortSignal }) => {
	const url = PRODUCTS_API.ALL_PRODUCT;
	return GET({ url, isAuth: true, signal });
};

const getProductOptions = async ({
	body,
	signal,
}: {
	body: {
		productId: string;
		productPart: EnumProductType;
		productOptionIds: string[];
	};
	signal: AbortSignal;
}): Promise<IResponse<IProductOption>> => {
	const url = PRODUCTS_API.PRODUCT_OPTIONS;
	return POST({ url, body, isAuth: true, signal });
};

const deleteProduct = async ({
	body,
	signal,
}: {
	body: { productId: string };
	signal: AbortSignal;
}) => {
	const url = PRODUCTS_API.DELETE_PRODUCT;
	return POST({ url, body, isAuth: true, signal });
};

const postNewProductOption = async ({
	body,
	signal,
}: {
	body: IProductOption;
	signal: AbortSignal;
}) => {
	const url = PRODUCTS_API.NEW_PRODUCT_OPTION;
	return POST({ url, body, isAuth: true, signal });
};

const postNewProduct = async ({
	body,
	signal,
}: {
	body: IProduct;
	signal: AbortSignal;
}) => {
	const url = PRODUCTS_API.NEW_PRODUCT;
	return POST({ url, body, isAuth: true, signal });
};

const postDeleteProductOption = async ({
	body,
	signal,
}: {
	body: {
		productOptionId: string;
	};
	signal: AbortSignal;
}) => {
	const url = PRODUCTS_API.DELETE_PRODUCT_OPTION;
	return POST({ url, body, isAuth: true, signal });
};

const putUpdateProduct = async ({
	body,
	signal,
}: {
	body: IProduct;
	signal: AbortSignal;
}) => {
	const url = PRODUCTS_API.UPDATE_PRODUCT;
	return PUT({ url, body, isAuth: true, signal });
};

export default {
	getProductById,
	getProductsByCategoryID,
	postUsedProduct,
	getAllUsedProduct,
	getAllProducts,
	getProductOptions,
	deleteProduct,
	postNewProductOption,
	postNewProduct,
	postDeleteProductOption,
	putUpdateProduct,
};
