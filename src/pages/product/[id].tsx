import CategoryClient from "client/CategoryClient";
import { getFirst, isValid } from "client/index";
import ProductClient from "client/ProductsClient";
import Breadcumb from "components/breadcumb";
import { BreadcumbTitle } from "components/constants";
import ProductCard from "components/productCard";
import { Category, Product } from "interface";
import { useParams } from "next/navigation";
import { memo, useEffect, useState } from "react";
import { Base } from "templates/Base";

const ProductPage = () => {
	const params = useParams();
	const { id } = params || {};

	const [categoryDetail, setCategoryDetail] = useState<Category | null>(null);
	const [products, setProducts] = useState<Product[]>([]);

	useEffect(() => {
		if (id) {
			(async () => {
				const resp = await CategoryClient.getCategoryById({ id });
				if (isValid(resp)) {
					setCategoryDetail(getFirst(resp));	
					const respProducts =
						await ProductClient.getProductsByCategoryID({
							category_id: getFirst(resp).category_id,
						});
					setProducts(getFirst(respProducts));
				}
			})();
		}
	}, [id]);

	return (
		<Base>
			<div className="mx-w-full p-6 sm:py-6 lg:px-8 relative z-1">
				<Breadcumb
					mainRoot={BreadcumbTitle["products"]}
					subRoot={categoryDetail?.category_name as string}
				/>
				<article className="mt-4 h-full gap-4">
					<ProductCard
						category={categoryDetail as Category}
						products={products}
					/>
				</article>
			</div>
		</Base>
	);
};

export default memo(ProductPage);
