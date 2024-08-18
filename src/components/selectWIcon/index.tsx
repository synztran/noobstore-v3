import { classNames } from "@/utils/AppConfig";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Fragment, useState } from "react";

const people = [
	{
		id: 1,
		name: "Sample 1",
		imageUrl: "https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
	},
	{
		id: 2,
		name: "Sample 2",
		imageUrl: "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
	},
];

interface Props {
	label?: string;
	selectList?: {
		[x: string]: string | number | boolean;
	}[],
	isIcon?: boolean;
	onChange?: (value: string | number) => void;
	name?: string;
	setFieldValue?: any
}

const SelectWithIcon = ({ label = "", selectList = people, isIcon = true, name, setFieldValue }: Props) => {
	const [selected, setSelected] = useState(selectList[0]);

	const handleChange = () => {
		if (selected) {
			setSelected(selected);
			setFieldValue(name, selected)
		}
	}

	return (
		<Listbox value={selected} onChange={handleChange}>
			{({ open }) => (
				<>
					<Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">
						{label}
					</Listbox.Label>
					<div className="relative">
						<Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-9">
							<span className="flex items-center">
								{isIcon ? (
									<img
										src={selected?.imageUrl as string}
										alt=""
										className="h-5 w-5 flex-shrink-0 rounded-full"
									/>
								) : null}
								<span className="ml-3 block truncate">
									{selected?.name}
								</span>
							</span>
							<span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
								<ChevronUpDownIcon
									className="h-5 w-5 text-gray-400"
									aria-hidden="true"
								/>
							</span>
						</Listbox.Button>

						<Transition
							show={open}
							as={Fragment}
							leave="transition ease-in duration-100"
							leaveFrom="opacity-100"
							leaveTo="opacity-0">
							<Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
								{selectList.map((child) => (
									<Listbox.Option
										key={child.id as number}
										className={({ active }) =>
											classNames(
												active
													? "bg-indigo-600 text-white"
													: "text-gray-900",
												"relative cursor-default select-none py-2 pl-3 pr-9"
											)
										}
										value={child}>
										{({ selected, active }) => (
											<>
												<div className="flex items-center">
													{isIcon ? (
														<img
															src={child.imageUrl as string}
															alt=""
															className="h-5 w-5 flex-shrink-0 rounded-full"
														/>
													) : null}
													<span
														className={classNames(
															selected
																? "font-semibold"
																: "font-normal",
															"ml-3 block truncate"
														)}>
														{child.name}
													</span>
												</div>

												{selected ? (
													<span
														className={classNames(
															active
																? "text-white"
																: "text-indigo-600",
															"absolute inset-y-0 right-0 flex items-center pr-4"
														)}>
														<CheckIcon
															className="h-5 w-5"
															aria-hidden="true"
														/>
													</span>
												) : null}
											</>
										)}
									</Listbox.Option>
								))}
							</Listbox.Options>
						</Transition>
					</div>
				</>
			)}
		</Listbox>
	);
};

export default SelectWithIcon;
