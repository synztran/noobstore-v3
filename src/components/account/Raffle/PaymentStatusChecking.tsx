import { mappingEnumRafflePaymentStatus } from "@/constants";
import { TResponseRaffleEntry } from "@/interface/Context/auth";
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
		<>
			{/* header */}
			{/* <div className="flex flex-col gap-2 items-center">
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
			</div> */}

			<div className="space-y-4 w-full p-4 border-2 border-gray-200 rounded-xl flex flex-col min-h-0 h-full">
				<div className="text-lg font-bold tracking-wide text-gray-500">
					Trạng thái đơn hàng
				</div>
				<RafflePaidTimeline raffle={raffle} />
			</div>
		</>
	);
};

export default RafflePaymentStatusChecking;
