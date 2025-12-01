import React from "react";
import { Clock, MapPinHouse, Truck, User } from "lucide-react";
import { EnumShippingMethodCode } from "@/interface/interface";
import { IResponseBackendServiceBooking } from "@/interface/Client/Service";
import { mappingShippingMethodLabel } from "@/constants";

const DeliveryInformation: React.FC<{
	service: IResponseBackendServiceBooking;
}> = ({ service }) => {
	return (
		<div className="border border-gray-400 rounded-md p-4">
			<div className="flex items-center justify-between">
				<div className="flex gap-2 items-center">
					<Truck size={28} />
					<h3 className="text-xl font-bold">Thông tin giao/nhận</h3>
				</div>
				<div className="inline-flex gap-2 items-center">
					<span className="border border-gray-400 rounded-lg p-1.5 bg-gray-200">
						{mappingShippingMethodLabel[service?.shipping?.method]}
					</span>
				</div>
			</div>
			{[
				EnumShippingMethodCode.STORE_DELIVERY_SELF_PICKUP,
				EnumShippingMethodCode.STORE_DELIVERY_STORE_PICKUP,
				EnumShippingMethodCode.STORE_PICKUP_SELF_DELIVERY,
			].includes(service?.shipping?.method) ? (
				<div className="grid grid-cols-12 gap-4 mt-4">
					<div className="col-span-6">
						<div className="text-lg font-bold">Lấy hàng</div>
						<div className="space-y-2">
							<div className="flex items-center gap-2">
								<User size={22} />
								<span className="capitalize">
									{service.contact.name} |{" "}
									{service.contact.phone}
								</span>
							</div>
							<div className="flex items-center gap-1">
								<MapPinHouse size={22} />{" "}
								{service.shipping.pickup?.address}
							</div>
							<div className="flex items-center gap-1">
								<Clock size={22} />{" "}
								{service.shipping.pickup?.date}
							</div>
						</div>
					</div>
					<div className="col-span-6">
						<div className="text-lg font-bold">Giao hàng</div>
						<div className="space-y-2">
							<div className="flex items-center gap-1">
								<User size={22} />
								<span>
									{service.contact.name} |{" "}
									{service.contact.phone}
								</span>
							</div>
							<div className="flex items-start gap-1">
								<MapPinHouse size={22} />
								{service.shipping.delivery?.address}
							</div>
							<div className="flex items-center gap-1">
								<Clock size={22} />
								{service.shipping.delivery?.date}
							</div>
						</div>
					</div>
				</div>
			) : null}
		</div>
	);
};

export default DeliveryInformation;
