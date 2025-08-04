import { getFirst } from "@/client";
import CategoryClient from "@/client/CategoryClient";
import { ICategory } from "@/interface/interface";
import ProductCard from "components/productCard";
import { GetStaticPaths, GetStaticProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { memo } from "react";
import { Base } from "templates/Base";

interface ProductPageProps {
	category: ICategory;
}

export const getStaticPaths: GetStaticPaths = async (ctx) => {
	try {
		const categories = await CategoryClient.getAllCategory({
			ctx: ctx,
			isAuth: false,
			params: {
				isValidate: false,
			},
		});

		const paths =
			categories?.data?.map((category) => ({
				params: { id: category?.categoryId?.toString() },
			})) || [];

		return {
			paths,
			fallback: "blocking",
		};
	} catch (error) {
		console.error("Error generating static paths:", error);
		return {
			paths: [],
			fallback: "blocking",
		};
	}
};

interface ProductPageParams extends ParsedUrlQuery {
	id: string;
}

export const getStaticProps: GetStaticProps<
	{ category: ICategory },
	ProductPageParams
> = async ({ params }) => {
	if (!params?.id) {
		return {
			notFound: true,
		};
	}

	try {
		const category = await CategoryClient.getCategoryById({
			id: params.id,
		});
		const categoryData = getFirst(category);

		if (!categoryData) {
			return {
				notFound: true,
			};
		}

		return {
			props: {
				category: categoryData,
			},
			revalidate: 60 * 60 * 12, // 12 hours
		};
	} catch (error) {
		console.error("Error fetching category:", error);
		return {
			notFound: true,
		};
	}
};

const ProductPage = ({ category }: ProductPageProps) => {
	if (!category) {
		return (
			<Base>
				<div className="flex items-center justify-center min-h-[60vh]">
					<p className="text-gray-600">Loading...</p>
				</div>
			</Base>
		);
	}

	const { slug } = category;

	return (
		<Base>
			<div className="mx-w-full pb-6 relative z-1">
				<article className="mt-4 h-full gap-4">
					<ProductCard slug={slug as string} />
				</article>
			</div>
		</Base>
	);
};

export default memo(ProductPage);
