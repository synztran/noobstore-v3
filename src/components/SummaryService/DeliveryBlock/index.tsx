import { EnumShippingMethodCode } from "@/interface/interface";
import useServices from "@/zustand/useServices";
import { CalendarRange, ChevronDown, MapPin, Route, User } from "lucide-react";

interface IProps {}

const SummaryServiceDeliveryBlock = (props: IProps) => {
	const { shippingInfo, contactInfo } = useServices();
	const { delivery, pickup } = shippingInfo;
	const isDelivery = [
		EnumShippingMethodCode.STORE_DELIVERY_SELF_PICKUP,
		EnumShippingMethodCode.STORE_DELIVERY_STORE_PICKUP,
	].includes(shippingInfo.method.code as EnumShippingMethodCode);
	const isPickup = [
		EnumShippingMethodCode.STORE_PICKUP_SELF_DELIVERY,
		EnumShippingMethodCode.STORE_DELIVERY_STORE_PICKUP,
	].includes(shippingInfo.method.code as EnumShippingMethodCode);

	if (
		shippingInfo.method.code === "" ||
		shippingInfo.method.code ===
			EnumShippingMethodCode.SELF_DELIVERY_SELF_PICKUP
	)
		return null;

	if (isDelivery && isPickup) {
		return (
			<div className="flex flex-col gap-2">
				{isPickup ? (
					<div className="flex flex-col">
						<div className="flex gap-2">
							<Route size={28} className="min-w-[28px]" />
							<div className="flex flex-col gap-1">
								<div className="flex items-start">
									<strong className="text-lg">
										Lấy hàng
									</strong>
								</div>
								<div className="pl-2 flex flex-col gap-2">
									<div className="flex items-center gap-1">
										<strong className="flex items-center gap-1">
											<User size={20} />
										</strong>
										<div className="text-base text-gray-600 leading-[1]">
											{contactInfo.name} -{" "}
											{contactInfo.phone}
										</div>
									</div>
									<div className="flex items-center gap-1">
										<strong className="flex items-center gap-1">
											<CalendarRange size={20} />
										</strong>
										<div className="text-base text-gray-600 leading-[1]">
											{pickup.date}
										</div>
									</div>
									<div className="flex items-center gap-1">
										<strong className="flex items-center gap-1">
											<MapPin size={20} />
										</strong>
										<div className="text-base text-gray-600 leading-[1] line-clamp-1">
											{pickup.address}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				) : null}
				{isDelivery ? (
					<div className="flex flex-col">
						<div className="flex gap-2">
							<Route size={28} className="min-w-[28px]" />
							<div className="flex flex-col gap-1">
								<div className="flex items-start">
									<strong className="text-lg">
										Giao hàng
									</strong>
								</div>
								<div className="pl-2 flex flex-col gap-2">
									<div className="flex items-center gap-1">
										<strong className="flex items-center gap-1">
											<User size={20} />
										</strong>
										<div className="text-base text-gray-600 leading-[1]">
											{contactInfo.name} -{" "}
											{contactInfo.phone}
										</div>
									</div>
									<div className="flex items-center gap-1">
										<strong className="flex items-center gap-1">
											<CalendarRange size={20} />
										</strong>
										<div className="text-base text-gray-600 leading-[1]">
											{delivery.date}
										</div>
									</div>
									<div className="flex items-center gap-1 min-h-[17px]">
										<strong className="flex items-center gap-1">
											<MapPin size={20} />
										</strong>
										<div className="text-base text-gray-600 leading-[1] line-clamp-1">
											{delivery.address}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				) : null}
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-2">
			<div className="flex flex-col">
				<div className="flex gap-2">
					<Route size={28} />
					<div className="flex flex-col gap-1">
						<div className="flex items-start">
							<strong>
								{isDelivery ? "Giao hàng" : ""}
								{isPickup ? "Lấy hàng" : ""}
							</strong>
						</div>
						<div className="pl-2 flex flex-col gap-2">
							<div className="flex items-center gap-1">
								<strong className="flex items-center gap-1">
									<User size={20} />
								</strong>
								<div className="text-base text-gray-600 leading-[1]">
									{contactInfo.name} - {contactInfo.phone}
								</div>
							</div>
							<div className="flex items-center gap-2">
								<strong className="flex items-center gap-1">
									<CalendarRange size={16} />
								</strong>
								<div className="text-sm text-gray-600 leading-[1]">
									{isDelivery ? delivery?.date : ""}
									{isPickup ? pickup?.date : ""}
								</div>
							</div>
							<div className="flex items-center gap-2 min-h-[17px]">
								<strong className="flex items-center gap-1">
									<MapPin size={16} />
								</strong>
								<div className="text-sm text-gray-600 leading-[1]">
									{isDelivery ? delivery?.address : ""}
									{isPickup ? pickup?.address : ""}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SummaryServiceDeliveryBlock;

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
					className={`cursor-pointer hover:bg-gray-300 rounded-full transition-all duration-150 bg-gray-200 p-0.5 transform ${
						isToggled ? "-scale-y-100" : ""
					}`}
				/>
			</div>
		</button>
	);
};
