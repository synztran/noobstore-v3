import LoadingDots from "@/components/Effects/LoadingDots";
import {
	SERVICE_KEYBOARD_ICON,
	SERVICE_NEW_SWITCH_ICON,
	SERVICE_STABILIZER_ICON,
} from "@/constants/Images";
import { formatCurrency } from "@/utils/FormatNumber";
import useServices, { useServiceAction } from "@/zustand/useServices";
import { CircularProgress, Divider } from "@mui/material";
import { ChevronDown, Package } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import SummaryServiceCollapse from "../collapse";

interface Props {}

const SummaryServiceBlock = () => {
	const { keyboardItems, switchItems, stabilizerItems } = useServices();
	const { calculateTotalServicePrice, calculateTotalService } =
		useServiceAction();
	const [isCollapsed, setIsCollapsed] = useState(false);
	const totalService = useMemo(
		() => calculateTotalService(),
		[keyboardItems, switchItems, stabilizerItems]
	);
	const totalPrice = useMemo(
		() => calculateTotalServicePrice(),
		[keyboardItems, switchItems, stabilizerItems]
	);

	return (
		<div className="flex items-start gap-2">
			<Package size={24} className="min-w-[24px]" />
			<Divider orientation="vertical" flexItem />
			<div className="flex flex-col w-full">
				<div className="flex items-center justify-between">
					<div className="flex items-start gap-1">
						<strong className="text-base">
							{totalPrice > 0 ? (
								`${totalService} Dịch vụ`
							) : (
								<LoadingDots />
							)}
						</strong>
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
							{keyboardItems.map((keyboard, index) => (
								<div className="flex flex-col" key={index}>
									<div className="flex items-start gap-1">
										<Image
											src={SERVICE_KEYBOARD_ICON}
											className="aspect-square"
											width={40}
											height={40}
											alt="keyboard"
										/>
										<div className="flex flex-col w-full">
											<div className="flex flex-col">
												<span className="text-base font-medium min-h-[24px] capitalize">
													{keyboard.keyboardName || (
														<LoadingDots />
													)}
												</span>
												<div className="flex gap-1 min-h-[22px]">
													<span className="border border-gray-700 rounded-lg p-1 leading-[1] text-xs text-gray-700 min-w-[20px]">
														{keyboard.pcbType || (
															<CircularProgress
																size={12}
															/>
														)}
													</span>
													<span className="border border-gray-700 rounded-lg p-1 leading-[1] text-xs text-gray-700 min-w-[20px]">
														{keyboard.keyboardSize || (
															<CircularProgress
																size={12}
															/>
														)}
													</span>
												</div>
											</div>
											<Divider className="!mt-1.5 !mb-1" />
											<div className="flex flex-col">
												{keyboard.services.solder
													?.isUse &&
												keyboard.services.solder
													?.price ? (
													<div className="flex items-center justify-between w-full">
														<span className="text-base">
															Hàn switch
														</span>
														<span className="text-base">
															{formatCurrency(
																keyboard
																	.services
																	.solder
																	.price
															)}
														</span>
													</div>
												) : null}
												{keyboard.services.desolder
													?.isUse &&
												keyboard.services.desolder
													?.price ? (
													<div className="flex items-center justify-between w-full">
														<span className="text-base">
															Rã switch
														</span>
														<span className="text-base">
															{formatCurrency(
																keyboard
																	.services
																	.desolder
																	.price
															)}
														</span>
													</div>
												) : null}
												{keyboard.services.clean
													?.isUse &&
												keyboard.services.clean
													?.price ? (
													<div className="flex items-center justify-between w-full">
														<span className="text-base">
															Vệ sinh phím
														</span>
														<span className="text-base">
															{formatCurrency(
																keyboard
																	.services
																	.clean.price
															)}
														</span>
													</div>
												) : null}
											</div>
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
												<span className="text-base font-medium">
													{sw.type}
												</span>
												<div className="flex gap-1">
													<span className="border border-gray-700 rounded-md p-1 text-xs leading-[1] text-gray-700">
														{sw.quantity}sw
													</span>
													<span className="border border-gray-700 rounded-md p-1 text-xs leading-[1] text-gray-700">
														{sw.type}
													</span>
													<span className="border border-gray-700 rounded-md p-1 text-xs leading-[1] text-gray-700">
														{sw.status}
													</span>
												</div>
											</div>
											<Divider className="!mt-1.5 !mb-1" />
											<div className="flex flex-col">
												{sw.services.lube?.isUse &&
												sw.services.lube?.price ? (
													<div className="flex items-center justify-between w-full">
														<span className="text-base">
															{
																sw.services.lube
																	.name
															}
														</span>
														<span className="text-base flex items-center gap-4">
															<span className="text-sm">
																{sw.quantity} x{" "}
																{formatCurrency(
																	sw.services
																		.lube
																		.price
																)}
															</span>
															{formatCurrency(
																sw.services.lube
																	.price *
																	sw.quantity
															)}
														</span>
													</div>
												) : null}
												{sw.services.film?.isUse &&
												sw.services.film?.price ? (
													<div className="flex items-center justify-between w-full">
														<span className="text-base">
															{
																sw.services.film
																	.name
															}
														</span>
														<span className="text-base">
															{formatCurrency(
																sw.services.film
																	.price *
																	sw.quantity
															)}
														</span>
													</div>
												) : null}
												{sw.services.spring?.isUse &&
												sw.services.spring?.price ? (
													<div className="flex items-center justify-between w-full">
														<span className="text-base">
															Spring
														</span>
														<span className="text-base">
															{formatCurrency(
																sw.services
																	.spring
																	.price
															)}
														</span>
													</div>
												) : null}
												{sw.services.clean?.isUse &&
												sw.services.clean?.price ? (
													<div className="flex items-center justify-between w-full">
														<span className="text-base">
															Vệ sinh
														</span>
														<span className="text-base">
															{formatCurrency(
																sw.services
																	.clean.price
															)}
														</span>
													</div>
												) : null}
												{sw.services.quickClean
													?.isUse &&
												sw.services.quickClean
													?.price ? (
													<div className="flex items-center justify-between w-full">
														<span className="text-base">
															Vệ sinh re-lube
														</span>
														<span className="text-base">
															{formatCurrency(
																sw.services
																	.quickClean
																	.price *
																	sw.quantity
															)}
														</span>
													</div>
												) : null}
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
													{stabilizer.name || (
														<LoadingDots />
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
														{stabilizer.quantity}
													</span>
												</div>
											</div>
											<Divider className="!mt-1.5 !mb-1" />
											<div className="flex flex-col px-2">
												{Object.entries(
													stabilizer.services
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
																				stabilizer.quantity
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
