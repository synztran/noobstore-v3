// @ts-ignore
import CategoryClient from "@/client/CategoryClient";
// @ts-ignore
import { getFirst, isValid } from "@/client/index";
import Breadcumb from "@/components/breadcumb";
import { BreadcumbTitle } from "@/components/constants";
import { Category } from "@/interface";
import { Base } from "@/templates/Base";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const CategoryDetailPage = () => {
	const params = useParams();
	const { id } = params || {};
	const [categoryDetail, setCategoryDetail] = useState<Category | null>(null);

	console.log(params);

	useEffect(() => {
		if (id) {
			(async () => {
				const resp = await CategoryClient.getCategoryById({ id });
				console.log("resp", resp, getFirst(resp));
				if (isValid(resp)) {
					setCategoryDetail(getFirst(resp));
				}
			})();
		}
	}, [id]);

	console.log("categoryDetail", categoryDetail);

	return (
		<Base>
			<div className="mx-w-full p-6 sm:py-6 lg:px-8 relative z-1">
				<Breadcumb
					mainRoot={BreadcumbTitle["products"]}
					subRoot={id as string}
				/>
				<article className="flex mt-4 h-80 gap-4">
					{/* product & slide */}
					<div className="flex-auto w-72 h-full bg-red-400"></div>
					{/* detail product */}
					<div className="flex-auto w-28 h-full border-red-200 border p-4">
						<div className="bg-white w-full h-full border-gray-300-300 border rounded-sm">
							<span className="text-2xl text-red-600">
								{categoryDetail?.category_name}
							</span>
						</div>
					</div>
				</article>
			</div>
		</Base>
	);
};

export default CategoryDetailPage;
