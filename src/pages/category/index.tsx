import CategoryClient from "@/client/CategoryClient";
import { getFirst, isValid } from "@/client/index";
import Breadcumb from "@/components/breadcumb";
import CategoryCard from "@/components/categoryCard";
import { BreadcumbTitle, sortOptions } from "@/components/constants";
import FilterSection from "@/components/filter";
import { Category } from "@/interface";
import { Base } from "@/templates/Base";
import { classNames } from "@/utils/AppConfig";
import { Menu, Transition } from "@headlessui/react";
import {
	ChevronDownIcon,
	FunnelIcon,
	Squares2X2Icon
} from "@heroicons/react/20/solid";
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react";


interface Props {
	title: string;
}

const CollectionPage = ({ title }: Props) => {

	const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
	const [categoryDetail, setCategoryDetail] = useState<Category[]>([]);

	useEffect(() => {
		(async () => {
			const resp = await CategoryClient.getAllCategory();
			console.log("resp", resp)
			if (isValid(resp)) {
				setCategoryDetail(getFirst(resp));	
			}
		})();
	}, []);

	return (
		<Base>
			<div className="mx-w-full p-6 sm:py-6 lg:px-8 relative z-1">
				<Breadcumb
					mainRoot={BreadcumbTitle["collection"]}
				/>
				<HeadSection
          title="Danh mục"
					setMobileFiltersOpen={setMobileFiltersOpen}
				/>
				<article className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4 mt-4">
					<FilterSection
						isMobileOpen={mobileFiltersOpen}
						setMobileOpen={setMobileFiltersOpen}
					/>
					<div className="grid gap-x-2 gap-y-4 col-span-1 grid-cols-1 sm:grid-cols-3 sm:col-span-3 justify-items-center">
            {
              categoryDetail?.map(child => <CategoryCard category={child} />)
            }
					</div>
				</article>
			</div>
		</Base>
	);
};

export default CollectionPage;

const HeadSection = ({
	title = "",
	setMobileFiltersOpen,
}: {
	title: string;
	setMobileFiltersOpen: Dispatch<SetStateAction<boolean>>;
}) => {
	return (
		<div className="flex items-baseline justify-between border-b border-gray-200 pb-2">
			<h1 className="text-4xl font-bold tracking-tight text-gray-900 capitalize">
				{title}
			</h1>

			<div className="flex items-center">
				<Menu as="div" className="relative inline-block text-left">
					<div>
						<Menu.Button className="group inline-flex justify-center text-base font-medium text-gray-700 hover:text-gray-900 items-center">
							Sắp xếp
							<ChevronDownIcon
								className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
								aria-hidden="true"
							/>
						</Menu.Button>
					</div>

					<Transition
						as={Fragment}
						enter="transition ease-out duration-100"
						enterFrom="transform opacity-0 scale-95"
						enterTo="transform opacity-100 scale-100"
						leave="transition ease-in duration-75"
						leaveFrom="transform opacity-100 scale-100"
						leaveTo="transform opacity-0 scale-95">
						<Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-gray-100 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
							<div className="py-1">
								{sortOptions.map((option) => (
									<Menu.Item key={option.name}>
										{({ active }) => (
											<a
												href={option.href}
												className={classNames(
													option.current
														? "font-medium text-gray-900"
														: "text-gray-500",
													active ? "bg-gray-100" : "",
													"block px-4 py-2 text-sm"
												)}>
												{option.name}
											</a>
										)}
									</Menu.Item>
								))}
							</div>
						</Menu.Items>
					</Transition>
				</Menu>

				<button
					type="button"
					className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7">
					<span className="sr-only">View grid</span>
					<Squares2X2Icon className="h-5 w-5" aria-hidden="true" />
				</button>
				<button
					type="button"
					className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
					onClick={() => setMobileFiltersOpen(true)}>
					<span className="sr-only">Filters</span>
					<FunnelIcon className="h-5 w-5" aria-hidden="true" />
				</button>
			</div>
		</div>
	);
};
