import { mappingEnumRafflePaymentStatus } from "@/constants";
import { NEW_MISSING_IMAGE } from "@/constants/Images";
import { TResponseRaffleEntry } from "@/interface/Context/auth";
import Image from "next/image";
import { memo } from "react";
import RafflePaidTimeline from "./PaymentStep";

interface RafflePaymentStatusCheckingProps {
	raffle: TResponseRaffleEntry;
}

const RafflePaymentStatusChecking = ({
	raffle,
}: RafflePaymentStatusCheckingProps) => {
	const paymentStatusInfo =
		mappingEnumRafflePaymentStatus[raffle.paymentStatus] || {};

	const { label, subLabel, icon } = paymentStatusInfo;

	return (
		<div className="flex flex-col gap-2 relative">
			{/* header */}
			<div className="relative flex flex-col gap-2 items-center">
				<div className="w-20 h-20 relative bg-blue-100 rounded-full">
					<Image
						src={icon || NEW_MISSING_IMAGE}
						alt={label || "status icon"}
						fill
						objectFit="contain"
						draggable={false}
						className={`${icon ? "" : "sr-only"}`}
					/>
				</div>
				<div className="text-center">
					<div className="text-2xl font-bold leading-8">{label}</div>
					<small className="text-gray-700">{subLabel}</small>
				</div>
			</div>

			<div className="space-y-4 w-full p-4 border-2 border-gray-200 rounded-xl">
				<div className="text-lg font-bold">Trạng thái đơn hàng</div>
				<RafflePaidTimeline raffle={raffle} />
			</div>
		</div>
	);
};

export default RafflePaymentStatusChecking;

const DisplayBlock = memo(
	({
		label,
		value,
		isHide = false,
	}: {
		label: string;
		value: any;
		isHide?: boolean;
	}) => {
		if (isHide) return null;
		return (
			<div className="flex justify-between items-center ">
				<span className="font-semibold text-gray-600 text-sm">
					{label}
				</span>
				{typeof value === "string" || typeof value === "number" ? (
					<span className="font-bold text-sm my-auto">{value}</span>
				) : (
					value
				)}
			</div>
		);
	},
);
