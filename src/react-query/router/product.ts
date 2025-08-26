import { getData, getFirst, isValid } from "@/client";
import CategoryClient from "@/client/CategoryClient";
import ProductOptionClient from "@/client/ProductOptionClient";
import ProductClient from "@/client/ProductsClient";
import { HTTP_STATUS } from "@/constants/Enums/https";
import { IResponse } from "@/interface/Client/interface";
import {
	EnumProductType,
	ICategory,
	IProductOption,
} from "@/interface/interface";
import NotifyUtils from "@/utils/NotifyUtils";
import { createQueryKeys } from "@lukemorales/query-key-factory";

export const productQueryKeys = createQueryKeys("product", {
	singleCategoryData: (params: { categoryId: string }) => ({
		queryKey: [{ params }],
		queryFn: async () => {
			if (!params || !params.categoryId) {
				return {};
			}

			const respCategoryDetail: IResponse<ICategory> =
				await CategoryClient.getCategoryById({
					id: params.categoryId,
				});

			if (respCategoryDetail.status !== HTTP_STATUS.Ok) {
				return {};
			}

			const categoryDetail = getFirst(respCategoryDetail) as ICategory;
			const categoryId = (getFirst(respCategoryDetail) as ICategory)
				?.categoryId;

			const respProductDetail =
				await ProductClient.getProductsByCategoryID({
					categoryId: categoryId as string,
				});

			const products = respProductDetail.data || [];
			const productOptionIds = products
				.map((product) => product.optionGroups?.optionIds)
				.flat();

			const signal = AbortSignal.timeout(10000);
			const respProductOptions =
				await ProductOptionClient.getProductOptions({
					body: {
						productOptionIds: productOptionIds,
					},
					signal,
				});

			let productOptions: Record<string, IProductOption[]> = {};

			if (respProductOptions.status !== HTTP_STATUS.Ok) {
				NotifyUtils.error(respProductOptions.message);
			} else {
				productOptions =
					getData(respProductOptions)?.reduce(
						(acc, curr) => {
							if (curr.productPart) {
								acc[curr.productPart] = [
									...(acc[curr.productPart] || []),
									curr,
								];
							}
							return acc;
						},
						{} as Record<string, IProductOption[]>
					) || {};
			}

			const data = {
				categoryDetail,
				products,
				productOptions,
			};

			console.log("data", data);

			return data;
		},
	}),
	getAllUsedProduct: (params: { status?: string; isValidate?: boolean }) => ({
		queryKey: ["allUsedProduct", params],
		queryFn: async ({ signal }) => {
			if (!params) {
				return [];
			}

			const response = await ProductClient.getAllUsedProduct({ signal });
			if (!isValid(response)) {
				return [];
			}
			return getData(response);
		},
	}),
	getAllProducts: () => ({
		queryKey: ["products"],
		queryFn: async ({ signal }) => {
			const response = await ProductClient.getAllProducts({ signal });
			if (!isValid(response)) {
				return [];
			}
			return getData(response);
		},
	}),
	getProductOptions: (params: {
		productId?: string;
		productPart?: EnumProductType;
		productOptionIds?: string[];
	}) => ({
		queryKey: ["productOptions", params],
		queryFn: async ({ signal }) => {
			const respProductDetail = await ProductClient.getProductOptions({
				body: {
					productId: params?.productId ?? "",
					productPart: params?.productPart ?? EnumProductType.ETC,
					productOptionIds: params?.productOptionIds ?? [],
				},
				signal,
			});

			if (respProductDetail.status !== HTTP_STATUS.Ok) {
				return [];
			}

			const productOptions = getData(respProductDetail);

			return productOptions;
		},
	}),
});
