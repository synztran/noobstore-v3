import { mapPaymentStatus, ORDER_STATUS_LABEL } from "@/constants";
import {
	EnumOrderStatus,
	EnumPaymentMethod,
	EnumPaymentStaus,
} from "@/interface/interface";
import classNames from "classnames";
import React from "react";
import dynamic from "next/dynamic";

const LocatedMap = dynamic(() => import("@/components/LocatedMap"), {
	ssr: false,
});

const OrderMapComp: React.FC<{
	orderStatus: EnumOrderStatus;
	paymentStatus: EnumPaymentStaus;
	address: string;
	city: string;
	paymentMethod: EnumPaymentMethod;
}> = ({ orderStatus, paymentStatus, address, city, paymentMethod }) => {
	return (
		<div className="flex flex-col border-[#d9d9d9] border-2 rounded-lg">
			<div className="w-full min-h-[200px] bg-gray-400 rounded-tr-md rounded-tl-md">
				<LocatedMap address={address} label={city} />
			</div>
			<div className="p-4 flex flex-col min-h-[120px]">
				<span className="text-lg">
					Đơn hàng{" "}
					{paymentStatus === EnumPaymentStaus.PAID ||
					paymentMethod === EnumPaymentMethod.CASH_ON_DELIVERY ? (
						<strong
							className={classNames(
								ORDER_STATUS_LABEL[orderStatus].color,
								"font-semibold",
								"lowercase"
							)}>
							{ORDER_STATUS_LABEL[orderStatus].label}
						</strong>
					) : (
						<span
							className={`${mapPaymentStatus[paymentStatus]?.color} font-semibold lowercase`}>
							{mapPaymentStatus[paymentStatus]?.label}
						</span>
					)}
				</span>
				<span className="text-sm">
					Bạn sẽ nhận thông báo khi đơn hàng sẵn sàng. Phiền bạn kiểm
					tra trong mục Spam của mail, nếu vẫn chưa có hãy liên hệ với
					shop ngay để được hỗ trợ nhé
				</span>
			</div>
		</div>
	);
};

export default OrderMapComp;
