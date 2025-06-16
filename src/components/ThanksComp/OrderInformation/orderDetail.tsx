import {
	MapPaymentMethod,
	mapPaymentStatus,
	MapShippingMethod,
} from "@/constants";
import { EnumPaymentMethod, EnumPaymentStaus } from "@/interface/interface";
import useOrderQuery from "@/react-query/order/api/useOrderQueries";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useMemo } from "react";

interface IMapOrderInfo {
	mail: string | number;
	paymentMethod: {
		icon: string;
		label: string;
	};
	paymentStatus: EnumPaymentStaus;
	shippingInfo: {
		firstName: string;
		lastName: string;
		address: string;
		phone: string;
		shippingMethod?: string;
		postalCode?: string;
	};
	billingInfo: {
		firstName: string;
		lastName: string;
		address: string;
		phone: string;
		deliveryMethod?: string;
		postalCode?: string;
	};
}

const OrderDetail: React.FC = () => {
	const router = useRouter();
	const { id: orderId } = router.query || {};
	const { data: orderData, isPending } = useOrderQuery(orderId as string);

	const mapOrderInfo: IMapOrderInfo = useMemo(() => {
		if (!orderData) {
			return {
				mail: "",
				paymentMethod: {
					icon: "",
					label: "",
				},
				paymentStatus: EnumPaymentStaus.PENDING,
				shippingInfo: {
					firstName: "",
					lastName: "",
					address: "",
					phone: "",
					shippingMethod: "",
					postalCode: "",
				},
				billingInfo: {
					firstName: "",
					lastName: "",
					address: "",
					phone: "",
					postalCode: "",
				},
			};
		}
		const { orderInfo } = orderData || {};
		return {
			mail: orderData?.orderInfo?.phoneNumber || "",
			paymentMethod: MapPaymentMethod[
				orderData?.orderInfo?.paymentMethod.toUpperCase() as EnumPaymentMethod
			] || {
				icon: "",
				label: "",
			},
			paymentStatus: orderData.paymentStatus || EnumPaymentStaus.PENDING,
			shippingInfo: {
				firstName: orderInfo?.firstName,
				lastName: orderInfo?.lastName,
				address: orderInfo?.address,
				phone: orderInfo?.phoneNumber.replace("0", "+84"),
				shippingMethod:
					MapShippingMethod[
						orderInfo?.deliveryMethod.toUpperCase()
					] || "",
				postalCode: orderInfo?.postCode,
			},
			billingInfo: {
				firstName: orderInfo?.firstName,
				lastName: orderInfo?.lastName,
				address: orderInfo?.address,
				phone: orderInfo?.phoneNumber.replace("0", "+84"),
				postalCode: orderInfo?.postCode,
			},
		};
	}, [orderData]);

	if (isPending) return null;

	return (
		<div className="border-[#d9d9d9] border-2 rounded-lg flex flex-col p-4">
			<strong className="text-lg">Thông tin đơn hàng</strong>
			<div className="grid grid-cols-2 gap-4 pt-4">
				<ChildContainer
					label="Thông tin liên hệ"
					content={String(mapOrderInfo.mail)}
				/>
				<div className="flex flex-col">
					<strong className="text-base">
						Phương thức thanh toán
					</strong>
					<address className="whitespace-pre-wrap text-sm not-italic flex items-center gap-1">
						{mapOrderInfo.paymentMethod.icon ? (
							<Image
								src={mapOrderInfo.paymentMethod.icon}
								alt="payment-method"
								width={32}
								height={16}
								className="!h-[32px] !w-auto"
							/>
						) : null}
						<span className="w-2 h-2 bg-gray-500 rounded-full" />
						<span
							className={`${mapPaymentStatus[
								mapOrderInfo.paymentStatus
							]
								?.bgColor} px-1 rounded-sm text-white font-semibold`}>
							{
								mapPaymentStatus[mapOrderInfo.paymentStatus]
									?.label
							}
						</span>
					</address>
				</div>
				<DeliveryInfo
					label="Thông tin giao hàng"
					deliverInfo={mapOrderInfo.shippingInfo}
				/>
				<DeliveryInfo
					label="Địa chỉ thanh toán"
					deliverInfo={mapOrderInfo.billingInfo}
				/>
				<ChildContainer
					label="Đơn vị vận chuyển"
					content={
						mapOrderInfo.shippingInfo.shippingMethod ||
						"Chưa xác định"
					}
				/>
			</div>
		</div>
	);
};

export default OrderDetail;

const ChildContainer = ({
	label,
	content,
}: {
	label: string;
	content: string | string[];
}) => {
	return (
		<div className="flex flex-col">
			<strong className="text-base">{label}</strong>
			<address className="whitespace-pre-wrap text-sm not-italic">
				{typeof content === "string"
					? content
					: content?.join(" ").replaceAll(" ", "\n")}
			</address>
		</div>
	);
};

const DeliveryInfo = ({
	deliverInfo,
	label,
}: {
	label: string;
	deliverInfo: IMapOrderInfo["shippingInfo"] | IMapOrderInfo["billingInfo"];
}) => {
	return (
		<div className="flex flex-col">
			<strong className="text-base">{label}</strong>
			<p className="text-sm">
				{deliverInfo.firstName} {deliverInfo.lastName}
			</p>
			<address className="whitespace-pre-wrap text-sm not-italic">
				{deliverInfo.address}&nbsp;
				{deliverInfo.postalCode}
			</address>
			<p className="text-sm">{deliverInfo.phone}</p>
		</div>
	);
};
