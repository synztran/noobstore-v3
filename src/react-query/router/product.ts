import { getData, getFirst, isValid } from "@/client";
import CategoryClient from "@/client/CategoryClient";
import ProductOptionClient from "@/client/ProductOptionClient";
import ProductClient from "@/client/ProductsClient";
import { HTTP_STATUS } from "@/constants/Enums/https";
import { IResponse } from "@/interface/Client/interface";
import { EnumProductType, ICategory } from "@/interface/interface";
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

			const categoryId = (getFirst(respCategoryDetail) as ICategory)
				?.categoryId;
			const respProductDetail =
				await ProductClient.getProductsByCategoryID({
					categoryId: categoryId as string,
				});
			const categoryDetail = getFirst(respCategoryDetail);
			const products = respProductDetail.data || [];
			const productOptionIds = products
				.map((product) => product.optionGroups?.optionIds)
				.flat();
			console.log("productOptionIds", productOptionIds);

      const signal = AbortSignal.timeout(10000);
			const respProductOptions = await ProductOptionClient.getProductOptions({
				body: {
					productOptionIds: productOptionIds,
				},
				signal,
      });
      
      console.log(respProductOptions)

			const data = {
				categoryDetail,
				products,
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
