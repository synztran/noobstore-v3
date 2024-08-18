import { EnumSaleStatus } from "@/interface";
import { Dialog, Disclosure, Transition } from "@headlessui/react";
import { MinusIcon, PlusIcon } from "@heroicons/react/20/solid";
import { FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react";
import { filters } from "../constants";

interface Props {
	isMobileOpen: boolean;
	setMobileOpen: Dispatch<SetStateAction<boolean>>;
}

const FilterSection = ({ isMobileOpen = false, setMobileOpen }: Props) => {
	const router = useRouter();
	const { status } = router.query;
	const [filterOpts, setFilterOpts] = useState({
		status_gb: status || EnumSaleStatus.ALL
	})

	const handleResetFilter = () => {
		setFilterOpts({
			status_gb: EnumSaleStatus.ALL
		})
		router.replace({
			query: {},
			pathname: router.pathname
		})
	}

	useEffect(() => {
		if (status) {
			setFilterOpts({
				status_gb: status as EnumSaleStatus
			})
		}
 	}, [status])

	return (
		<div className="w-96">
			<div className="border border-gray-400 p-4">
				{/* Mobile filter dialog */}
				<Transition.Root show={isMobileOpen} as={Fragment}>
					<Dialog
						as="div"
						className="relative z-60 lg:hidden"
						onClose={setMobileOpen}>
						<Transition.Child
							as={Fragment}
							enter="transition-opacity ease-linear duration-300"
							enterFrom="opacity-0"
							enterTo="opacity-100"
							leave="transition-opacity ease-linear duration-300"
							leaveFrom="opacity-100"
							leaveTo="opacity-0">
							<div className="fixed inset-0 bg-black bg-opacity-25" />
						</Transition.Child>

						<div className="fixed inset-0 z-60 flex">
							<Transition.Child
								as={Fragment}
								enter="transition ease-in-out duration-300 transform"
								enterFrom="translate-x-full"
								enterTo="translate-x-0"
								leave="transition ease-in-out duration-300 transform"
								leaveFrom="translate-x-0"
								leaveTo="translate-x-full">
								<Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
									<div className="flex items-center justify-between px-4">
										<h2 className="text-lg font-medium text-gray-900">
											Bộ lọc
										</h2>
										<button
											type="button"
											className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
											onClick={() =>
												setMobileOpen(false)
											}>
											<span className="sr-only">
												Close menu
											</span>
											<XMarkIcon
												className="h-6 w-6"
												aria-hidden="true"
											/>
										</button>
									</div>

									{/* Filters */}
									<form className="mt-4 border-t border-gray-200">
										<h3 className="sr-only">Categories</h3>
										{/* <ul
											role="list"
											className="px-2 py-3 font-medium text-gray-900">
											{subCategories.map((category) => (
												<li key={category.name}>
													<a
														href={category.href}
														className="block px-2 py-3">
														{category.name}
													</a>
												</li>
											))}
										</ul> */}

										{filters.map((section) => (
											<Disclosure
												as="div"
												key={section.id}
												className="border-t border-gray-200 px-4 py-6"
												defaultOpen={true}
											>
												{({ open }) => (
													<>
														<h3 className="-mx-2 -my-3 flow-root">
															<Disclosure.Button className="flex w-full items-center justify-between px-2 py-3 text-gray-400 hover:text-gray-500">
																<span className="font-medium text-gray-900">
																	{
																		section.name
																	}
																</span>
																<span className="ml-6 flex items-center">
																	{open ? (
																		<MinusIcon
																			className="h-5 w-5"
																			aria-hidden="true"
																		/>
																	) : (
																		<PlusIcon
																			className="h-5 w-5"
																			aria-hidden="true"
																		/>
																	)}
																</span>
															</Disclosure.Button>
														</h3>
														<Disclosure.Panel className="pt-6">
															<div className="space-y-6">
																{section.options.map(
																	(
																		option,
																		optionIdx
																	) => (
																		<div
																			key={
																				option.value
																			}
																			className="flex items-center">
																			<input
																				id={`filter-mobile-${section.id}-${optionIdx}`}
																				name={`${section.id}[]`}
																				defaultValue={
																					option.value
																				}
																				type="checkbox"
																				defaultChecked={
																					option.checked
																				}
																				className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
																			/>
																			<label
																				htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
																				className="ml-3 min-w-0 flex-1 text-gray-500">
																				{
																					option.label
																				}
																			</label>
																		</div>
																	)
																)}
															</div>
														</Disclosure.Panel>
													</>
												)}
											</Disclosure>
										))}
									</form>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</Dialog>
				</Transition.Root>

				{/* desktop */}
				<main className="mx-auto max-w-7xl ">
					<section
						aria-labelledby="products-heading"
						className="">
						<h2 id="products-heading" className="sr-only">
							Products
						</h2>

						<form className="hidden lg:block md:block">
							<h3 className="sr-only">Categories</h3>
							<h3 className="text-2xl font-bold border-b border-gray-200 flex items-center gap-2">
								<FunnelIcon width={24} height={24} /> Bộ lọc
							</h3>

							{filters.map((section) => (
								<Disclosure
									as="div"
									key={section.id}
									className="border-b border-gray-200 py-6"
									defaultOpen
								>
									{({ open }) => (
										<>
											<h3 className="-my-3 flow-root">
												<Disclosure.Button className="flex w-full items-center justify-between py-3 text-sm text-gray-400 hover:text-gray-500">
													<span className="font-medium text-gray-900 text-base">
														{section.name}
													</span>
													<span className="ml-6 flex items-center">
														{open ? (
															<MinusIcon
																className="h-5 w-5"
																aria-hidden="true"
															/>
														) : (
															<PlusIcon
																className="h-5 w-5"
																aria-hidden="true"
															/>
														)}
													</span>
												</Disclosure.Button>
											</h3>
											<Disclosure.Panel className="pt-6">
												<div className="space-y-4">
													{section.options.map(
														(option, optionIdx) => (
															<div
																key={
																	option.value
																}
																className="flex items-center"
															>
																<input
																	id={`filter-${section.id}-${optionIdx}`}
																	name={`${section.id}`}
																	defaultValue={
																		option.value
																	}
																	type="checkbox"
																	defaultChecked={
																		filterOpts.status_gb === option.value
																	}
																	className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
																/>
																<label
																	htmlFor={`filter-${section.id}-${optionIdx}`}
																	className="ml-3 text-sm text-gray-600">
																	{
																		option.label
																	}
																</label>
															</div>
														)
													)}
												</div>
											</Disclosure.Panel>
										</>
									)}
								</Disclosure>
							))}
							<div className="flex mt-8 gap-4">
								<button type="reset" className="w-1/2 border border-gray-400 p-2 rounded-md font-bold hover:bg-gray-200" onClick={handleResetFilter}>
									Làm mới
								</button>
								<button className="w-1/2 border border-gray-400 p-2 rounded-md font-bold hover:bg-gray-200">
									Áp dụng
								</button>
							</div>
						</form>
					</section>
				</main>
			</div>
		</div>
	);
};

export default FilterSection;
