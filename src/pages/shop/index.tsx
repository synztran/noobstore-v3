import { isValid } from "@/client";
import CategoryClient from "@/client/CategoryClient";
import Breadcumb from "@/components/breadcumb";
import CategoryCard from "@/components/categoryCard";
import { BreadcumbTitle, sortOptions } from "@/components/constants";
import FilterSection from "@/components/filter";
import { Category } from "@/interface";
import { Base } from "@/templates/Base";
import { classNames } from "@/utils/AppConfig";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon, FunnelIcon } from "@heroicons/react/20/solid";
import { CircularProgress } from "@material-ui/core";
import { useRouter } from "next/router";
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react";

const ShopPage = () => {
  const router = useRouter();
  const { status } = router.query

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
	const [categoryDetail, setCategoryDetail] = useState<Category[]>([]);
	const [isLoading, setLoading] = useState(false)

	useEffect(() => {
		(async () => {
			setLoading(true)
			const resp = await CategoryClient.getAllCategory({params: {
        status_gb: status
      }});
			if (isValid(resp)) {
				setCategoryDetail(resp.data);	
			} else {
				setCategoryDetail([])
			}
			setLoading(false)
		})();
	}, [status]);
	
  return (
    <Base>
			<div className="mx-w-full py-6 relative z-1">
				<Breadcumb
					mainRoot={BreadcumbTitle["shop"]}
				/>
				{/* <HeadSection
					setMobileFiltersOpen={setMobileFiltersOpen}
				/> */}
				<article className="flex gap-x-8 mt-4">
					<FilterSection
						isMobileOpen={mobileFiltersOpen}
						setMobileOpen={setMobileFiltersOpen}
					/>
					{
						isLoading ? (
							<div className="flex justify-center items-center w-full h-96">
								<CircularProgress size={32} />
							</div>
						) : null
					}
					{
						!isLoading && categoryDetail?.length === 0 ? (
							<div className="flex justify-center items-center w-full h-96">
								<div>Không có dữ liệu</div>
							</div>
						) : null
					}
					{
						!isLoading && categoryDetail?.length > 0 ? (
							<div className="grid gap-x-4 gap-y-4 grid-cols-3 md:grid-cols-3 w-full">
								{
									categoryDetail?.filter(category => category.is_active)?.map(child => <CategoryCard category={child} />)
								}
							</div>
						) : null
					}
				</article>
			</div>
		</Base>
  )
}

export default ShopPage

const HeadSection = ({
	setMobileFiltersOpen,
}: {
	setMobileFiltersOpen: Dispatch<SetStateAction<boolean>>;
}) => {
	return (
		<div className="flex items-baseline justify-between border-b border-gray-200 pb-2">
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
					className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
					onClick={() => setMobileFiltersOpen(true)}>
					<span className="sr-only">Filters</span>
					<FunnelIcon className="h-5 w-5" aria-hidden="true" />
				</button>
			</div>
		</div>
	);
};