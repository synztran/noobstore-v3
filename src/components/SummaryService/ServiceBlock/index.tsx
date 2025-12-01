// import LoadingDots from "@/components/Effects/LoadingDots";
import {
	SERVICE_KEYBOARD_ICON,
	SERVICE_NEW_SWITCH_ICON,
	SERVICE_STABILIZER_ICON,
} from "@/constants/Images";
import { formatCurrency } from "@/utils/FormatNumber";
import useServices, {
	IServiceItem,
	IStabilizerPack,
	IStabilizerWire,
	useServiceAction,
} from "@/zustand/useServices";
import { CircularProgress, Divider } from "@mui/material";
import { ChevronDown, Package } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import SummaryServiceCollapse from "../collapse";
import {
	mapLabelEnumStabilizerMountType,
	mapLabelEnumStabilizerType,
} from "@/interface/interface";
import { mappingServiceName } from "@/constants";

const SummaryServiceBlock = () => {
	const { keyboardItems, switchItems, stabilizerItems } = useServices();
	const {
		calculateTotalServicePrice,
		calculateTotalService,
		getPriceKeyboardServiceById,
		getPriceServiceById,
	} = useServiceAction();
	const [isCollapsed, setIsCollapsed] = useState(false);
	const totalService = useMemo(
		() => calculateTotalService(),
		[keyboardItems, switchItems, stabilizerItems]
	);
	const totalPrice = useMemo(
		() => calculateTotalServicePrice(),
		[keyboardItems, switchItems, stabilizerItems]
	);

	const listInfo = (
		name: "keyboard" | "switch" | "stabilizer",
		idx: number
	) => {
		if (!keyboardItems.length) return [];
		const targetItem = keyboardItems?.[idx] || {};

		const infoList: { key: string; value: any }[] = [];
		for (const [key, value] of Object.entries(
			targetItem[name as keyof typeof targetItem] || {}
		)) {
			switch (name) {
				case "keyboard": {
					const validKeys = ["size", "pcb"];
					if (value && validKeys.includes(key)) {
						switch (key) {
							case "size":
								const reLabel = `${value}%`;
								infoList.push({ key, value: reLabel });
								break;
							case "pcb":
								const pcbLabel =
									value === "SOLDER"
										? "Mạch hàn"
										: "Mạch hot-swap";
								infoList.push({ key, value: pcbLabel });
								break;
							default:
								infoList.push({ key, value: value || "" });
								break;
						}
					}
					break;
				}
				case "switch": {
					const validKeys = ["type", "status", "quantity"];
					if (value && validKeys.includes(key)) {
						switch (key) {
							case "status":
								const statusLabel =
									value === "NEW" ? "Mới" : "Đã qua xử lý";
								infoList.push({ key, value: statusLabel });
								break;
							case "quantity":
								const quantityLabel = `${value} sw`;
								infoList.push({ key, value: quantityLabel });
								break;
							case "type":
								const typeLabel =
									(value as string)
										?.charAt(0)
										?.toUpperCase() +
									(value as string)?.slice(1)?.toLowerCase();
								infoList.push({ key, value: typeLabel });
								break;
							default:
								infoList.push({ key, value: value || "" });
								break;
						}
					}
					break;
				}
				case "stabilizer": {
					const validKeys = [
						"brand",
						"mountType",
						"status",
						"totalPack",
						"totalWire",
						"type",
					];
					if (value && validKeys.includes(key)) {
						switch (key) {
							case "mountType":
								const mountTypeLabel =
									mapLabelEnumStabilizerMountType[
										value as keyof typeof mapLabelEnumStabilizerMountType
									] || value;
								infoList.push({ key, value: mountTypeLabel });
								break;
							case "type":
								const typeLabel =
									mapLabelEnumStabilizerType[
										value as keyof typeof mapLabelEnumStabilizerType
									] || value;
								infoList.push({ key, value: typeLabel });
								break;
							case "status":
								const statusLabel =
									value === "NEW" ? "Mới" : "Đã qua sử lý";
								infoList.push({ key, value: statusLabel });
								break;
							case "totalPack":
								const totalPackLabel = `${value} set`;
								infoList.push({ key, value: totalPackLabel });
								break;
							case "totalWire":
								const totalWireLabel = `${value} wire`;
								infoList.push({ key, value: totalWireLabel });
								break;
							default:
								const reValue =
									(value as string)
										?.charAt(0)
										?.toUpperCase() +
									(value as string)?.slice(1)?.toLowerCase();
								infoList.push({ key, value: reValue || "" });
								break;
						}
					}
					break;
				}
				default: {
					if (!value) continue;
					infoList.push({ key, value: value || "" });
					break;
				}
			}
		}
		return infoList;
	};

	console.log("item", keyboardItems, switchItems, stabilizerItems);

	return (
		<div className="flex items-start gap-2">
			<Package size={24} className="min-w-[24px]" />
			<Divider orientation="vertical" flexItem />
			<div className="flex flex-col w-full">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-1">
						{totalPrice > 0 ? (
							<strong className="text-base">
								{totalService} Dịch vụ
							</strong>
						) : (
							<CircularProgress size={20} />
						)}
						{totalService > 0 ? (
							<BtnCollapse
								isToggled={isCollapsed}
								toggle={setIsCollapsed}
							/>
						) : null}
					</div>
					{totalPrice > 0 ? (
						<div className="text-base">
							{formatCurrency(totalPrice)}
						</div>
					) : null}
				</div>
				{totalService > 0 ? (
					<SummaryServiceCollapse isCollapse={isCollapsed}>
						<div className="flex flex-col gap-2 pr-2 mt-2">
							{keyboardItems.map((item, index) => (
								<div className="flex flex-col" key={item.id}>
									<div className="flex items-start gap-1">
										<Image
											src={SERVICE_KEYBOARD_ICON}
											className="aspect-square"
											width={40}
											height={40}
											alt="keyboard"
										/>
										<div className="flex flex-col w-full">
											<div className="flex flex-col gap-1">
												<span className="text-base font-medium min-h-[24px] capitalize">
													{item.keyboard.name || (
														<CircularProgress
															size={20}
														/>
													)}
												</span>
												<div className="flex flex-col gap-2">
													<DisplayInfo
														label="Phím:"
														values={listInfo(
															"keyboard",
															index
														)}
													/>
													<DisplayInfo
														label="Switch:"
														values={listInfo(
															"switch",
															index
														)}
													/>
													<DisplayInfo
														label="Stabilizer:"
														values={listInfo(
															"stabilizer",
															index
														)}
													/>
												</div>
											</div>
											<Divider className="!mt-2.5 !mb-2" />
											{Object.keys(item.services)
												.length ? (
												<div className="flex flex-col gap-2">
													<DisplayServiceAndPrice
														key={item.id}
														service={
															item.services
																?.keyboard
														}
														parentName="keyboard"
														switchQuantity={
															item.switch.quantity
														}
														packs={
															item.stabilizer
																.packs
														}
														wires={
															item.stabilizer
																.wires
														}
													/>
													<DisplayServiceAndPrice
														key={item.id}
														service={
															item.services
																?.switch
														}
														parentName="switch"
														switchQuantity={
															item.switch.quantity
														}
													/>
													<DisplayServiceAndPrice
														key={item.id}
														service={
															item.services
																?.stabilizer
														}
														parentName="stabilizer"
														packs={
															item.stabilizer
																.packs
														}
														wires={
															item.stabilizer
																.wires
														}
													/>
													<div className="flex gap-2 text-right justify-end items-center border-t border-gray-300 max-w-max ml-auto pt-1">
														<span className="text-sm">
															Tổng:
														</span>
														<span className="text-right text-base">
															{formatCurrency(
																getPriceKeyboardServiceById(
																	item.id
																)
															)}
														</span>
													</div>
												</div>
											) : null}
										</div>
									</div>
								</div>
							))}

							{switchItems.map((sw, idx) => (
								<div
									className="flex flex-col"
									key={`${sw.name}-${idx}`}>
									<div className="flex items-start gap-1">
										<Image
											src={SERVICE_NEW_SWITCH_ICON}
											className="aspect-square"
											width={40}
											height={40}
											alt="keyboard"
										/>
										<div className="flex flex-col w-full">
											<div className="flex flex-col">
												<span className="text-base font-medium capitalize">
													{sw.type?.toLowerCase()}
												</span>
												<div className="flex gap-1">
													<DisplayInfo
														label="Switch:"
														values={listInfo(
															"switch",
															idx
														)}
														isHideLabel
													/>
												</div>
											</div>
											<Divider className="!mt-1.5 !mb-1" />
											<div className="flex flex-col">
												<DisplayServiceAndPrice
													key={sw.name ?? idx}
													service={sw.services}
													parentName="switch"
													switchQuantity={sw.quantity}
												/>
												<div className="flex gap-2 text-right justify-end items-center border-t border-gray-300 max-w-max ml-auto pt-1">
													<span className="text-base">
														Tổng:
													</span>
													<span className="text-right text-base">
														{formatCurrency(
															getPriceServiceById(
																sw.id,
																"switch"
															)
														)}
													</span>
												</div>
											</div>
										</div>
									</div>
								</div>
							))}

							{stabilizerItems.map((stabilizer, idx) => (
								<div className="flex flex-col" key={`${idx}`}>
									<div className="flex items-start gap-1">
										<Image
											src={SERVICE_STABILIZER_ICON}
											className="aspect-square"
											width={60}
											height={60}
											alt="stabilizer"
										/>
										<div className="flex flex-col w-full">
											<div className="flex flex-col">
												<span className="text-base font-medium min-h-[24px] capitalize">
													{stabilizer.brand || (
														// <LoadingDots />
														<CircularProgress
															size={12}
														/>
													)}
												</span>
												<div className="flex gap-1">
													<span className="border border-gray-700 rounded-md p-1 leading-[1] text-sm text-gray-700">
														{stabilizer.type}
													</span>
													<span className="border border-gray-700 rounded-md p-1 leading-[1] text-sm text-gray-700">
														{stabilizer.mountType}
													</span>
													<span className="border border-gray-700 rounded-md p-1 leading-[1] text-sm text-gray-700">
														{
															stabilizer.wires
																.length
														}{" "}
														thanh wire
													</span>
												</div>
											</div>
											<Divider className="!mt-1.5 !mb-1" />
											<div className="flex flex-col px-2">
												{Object.entries(
													stabilizer?.services || {}
												).map(
													(
														[serviceKey, service],
														index
													) => {
														if (
															service.isUse &&
															service.price &&
															service.price > 0
														) {
															return (
																<div
																	className="flex items-center justify-between w-full"
																	key={index}>
																	<span className="text-base">
																		{service.name ||
																			serviceKey}
																	</span>
																	<span className="text-base">
																		{formatCurrency(
																			service.price *
																				stabilizer
																					.wires
																					.length
																		)}
																	</span>
																</div>
															);
														}
														return null;
													}
												)}
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</SummaryServiceCollapse>
				) : null}
			</div>
		</div>
	);
};

export default SummaryServiceBlock;

const BtnCollapse = ({
	isToggled,
	toggle,
}: {
	isToggled: boolean;
	toggle: (isCollapsed: boolean) => void;
}) => {
	return (
		<button
			type="button"
			className="text-xs text-gray-600 hover:text-gray-800 rounded px-1 py-0.5 leading-none"
			onClick={() => toggle(!isToggled)}
			aria-label={isToggled ? "Expand" : "Collapse"}>
			<div className="hover:bg-gray-200 rounded-full transition-all duration-150">
				<ChevronDown
					size={20}
					className={`cursor-pointer hover:bg-gray-200 rounded-full transition-all duration-150 p-0.5 transform ${
						isToggled ? "-scale-y-100" : ""
					}`}
				/>
			</div>
		</button>
	);
};

const DisplayInfo = ({
	label,
	values,
	isHideLabel = false,
}: {
	label: string;
	values?: {
		key: string;
		value: string;
	}[];
	isHideLabel?: boolean;
}) => {
	if (!label || !values?.length) return;
	return (
		<div className="flex gap-1 min-h-[22px] flex-wrap items-center">
			{!isHideLabel ? (
				<span className="text-sm font-medium">{label}</span>
			) : null}
			{values?.map((item, index) => (
				<span
					key={index}
					className="border border-gray-700 rounded-lg p-1 leading-[1] text-sm text-gray-700 min-w-[20px]">
					{item.value}
				</span>
			))}
		</div>
	);
};

const DisplayServiceAndPrice = ({
	service,
	parentName,
	switchQuantity,
	packs,
	wires,
	isGrouped = false,
}: {
	service: {
		[x: string]: IServiceItem;
	};
	parentName: "keyboard" | "switch" | "stabilizer";
	switchQuantity?: number;
	packs?: IStabilizerPack[];
	wires?: IStabilizerWire[];
	isGrouped?: boolean;
}) => {
	console.log("service", service, switchQuantity);

	const calcuServicePrice = (data: {
		price: number;
		name: string;
		unitPrice?: { [x: string]: number };
	}) => {
		if (!data) return 0;
		const { price, name, unitPrice = {} } = data;
		// Configuration for services that multiply by switchQuantity
		const quantityMultipliers: Record<string, string[]> = {
			switch: ["lube", "film", "quickClean", "clean"],
		};

		const singPriceServices: Record<string, string[]> = {
			keyboard: ["solder", "desolder", "clean"],
		};

		// Check if service multiplies by switchQuantity
		if (quantityMultipliers[parentName]?.includes(name)) {
			if (!switchQuantity) return 0;
			return price * switchQuantity;
		}

		// Check if service is a single price service
		if (singPriceServices[parentName]?.includes(name)) {
			return price;
		}

		// Special case for stabilizer handle
		if (parentName === "stabilizer") {
			switch (name) {
				case "handle": {
					const totalPack = packs?.length || 0;
					const totalWire = wires?.length || 0;
					if (!totalPack && !totalWire) return 0;

					let totalPrice = 0;
					if (totalPack) {
						totalPrice += price * totalPack;
					}
					if (totalWire) {
						wires?.forEach((wire) => {
							const wireUnitPrice = unitPrice[wire.type] || 0;
							totalPrice += wireUnitPrice * wire.quantity;
						});
					}
					return totalPrice;
				}
				case "clean": {
					const totalWires = wires?.length || 0;
					if (!totalWires) return 0;
					return price * totalWires;
				}
				default:
					break;
			}
		}
		// Default: no multiplier
		return price;
	};

	if (!Object.values(service) || !Object.values(service).some((s) => s.isUse))
		return null;

	console.log("Object.entries(service)", Object.entries(service));

	return (
		<div className="flex flex-col w-full gap-2">
			{Object.entries(service).map(([name, serviceData], index) => {
				const { isUse, price } = serviceData || {};
				if (!isUse || !price) return null;
				const displayServiceName =
					mappingServiceName[parentName][name] || name;
				const formattedPrice = calcuServicePrice(serviceData);

				return (
					<div
						key={`${name}-${index}`}
						className="flex items-center justify-between w-full">
						<span className="text-sm">{displayServiceName}</span>
						<span className="text-sm">
							{formatCurrency(formattedPrice)}
						</span>
					</div>
				);
			})}
		</div>
	);
};
