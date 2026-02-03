import { classNames } from "@/utils/AppConfig";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Fragment, useEffect, useState } from "react";

interface Props {
	label?: string;
	selectList?: {
		[x: string]: string | number | boolean;
	}[];
	isIcon?: boolean;
	onChange?: (value: string | number) => void;
	name?: string;
	setFieldValue?: any;
	value?: string;
}

const defaultSelection = {
	name: "Lựa chọn",
	slug: "",
	type: "",
	code: "",
};

const SelectWithIcon = ({
	label = "",
	selectList = [],
	isIcon = true,
	name,
	setFieldValue,
	value,
}: Props) => {
	const [selected, setSelected] = useState<{
		name: string;
		slug: string;
		type: string;
		code: string;
		imageUrl?: string;
	} | null>(null);

	const handleChange = (newValue: {
		name: string;
		slug: string;
		type: string;
		code: string;
	}) => {
		if (newValue) {
			setSelected(newValue);
			setFieldValue(name, newValue);
		}
	};

	useEffect(() => {
		const found = selectList.find((item) => item.code === value);
		if (found) {
			setSelected({
				name: found.name as string,
				slug: found.slug as string,
				type: found.type as string,
				code: found.code as string,
				imageUrl: found.imageUrl as string,
			});
		}
		setSelected(defaultSelection);
	}, [value]);

	return (
		<Listbox
			value={selected}
			onChange={handleChange}
			defaultValue={defaultSelection}>
			{({ open }) => (
				<div>
					<Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">
						{label}
					</Listbox.Label>
					<div className="relative">
						<Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-9">
							<span className="flex items-center">
								{isIcon ? (
									<img
										src={selected?.imageUrl || ""}
										alt=""
										className="h-5 w-5 flex-shrink-0 rounded-full"
									/>
								) : null}
								<span className="block truncate">
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
								<Listbox.Option
									disabled
									value={null}
									className="text-gray-500 cursor-not-allowed select-none py-2 pl-3 pr-9">
									<div className="flex items-center">
										{isIcon ? (
											<span className="h-5 w-5 flex-shrink-0 rounded-full bg-gray-200" />
										) : null}
										<span className="ml-3 block truncate">
											{label || "Lựa chọn"}
										</span>
									</div>
								</Listbox.Option>
								{selectList.map((child) => (
									<Listbox.Option
										key={child.id as number}
										className={({ active }) =>
											classNames(
												active
													? "bg-indigo-600 text-white"
													: "text-gray-900",
												"relative cursor-default select-none py-2 pl-3 pr-9",
											)
										}
										value={child}>
										{({ selected, active }) => (
											<div>
												<div className="flex items-center">
													{isIcon ? (
														<img
															src={
																child.imageUrl as string
															}
															alt=""
															className="h-5 w-5 flex-shrink-0 rounded-full"
														/>
													) : null}
													<span
														className={classNames(
															selected
																? "font-semibold"
																: "font-normal",
															"ml-3 block truncate",
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
															"absolute inset-y-0 right-0 flex items-center pr-4",
														)}>
														<CheckIcon
															className="h-5 w-5"
															aria-hidden="true"
														/>
													</span>
												) : null}
											</div>
										)}
									</Listbox.Option>
								))}
							</Listbox.Options>
						</Transition>
					</div>
				</div>
			)}
		</Listbox>
	);
};

export default SelectWithIcon;
