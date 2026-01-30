import { TResponseRaffleEntry } from "@/interface/Context/auth";
import { EnumRafflePaymentStepType } from "@/interface/interface";
import { CircularProgress } from "@mui/material";
import React, { memo } from "react";
import SimpleMap from "./SimpleMap";

interface IProps {
	selected: TResponseRaffleEntry | null;
}

const ShopSummaryCard: React.FC<IProps> = ({ selected }) => {
	const currentStep = selected?.timeline?.find((step) => step.isCurrent);
	return (
		<div className="bg-white rounded-xl shadow p-4 w-full mx-auto border-2 border-gray-200 flex flex-col h-full">
			<span className="text-lg font-semibold text-gray-500 tracking-wide mb-4">
				Thông tin giao hàng
			</span>
			<div className="space-y-2">
				<SimpleMap address={selected?.shipping?.address || ""} />
				<div className="min-h-0 overflow-y-auto h-full flex-1 pr-2">
					<div className="font-bold text-sm">
						{selected?.shipping?.city}
					</div>
					<div className="text-xs text-gray-500 mb-2">
						{selected?.shipping?.address}
					</div>
					<hr className="mb-2" />
					<div className="space-y-2">
						<div className="flex justify-between items-center">
							<span className="text-sm font-semibold">
								Giao bởi
							</span>
							<span className="font-semibold text-xs text-gray-900 bg-gray-200 rounded-md px-2 py-1 whitespace-nowrap max-w-full overflow-hidden text-ellipsis">
								{selected?.shipping?.shippingMethod?.name ||
									"Undefined"}
							</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-sm font-semibold">
								Mã vận đơn
							</span>
							<span className="font-medium text-gray-700 text-xs">
								{selected?.shipping?.trackingNumber || (
									<CircularProgress size={16} />
								)}
							</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-sm font-semibold">
								Dự kiến giao
							</span>
							<span className="font-medium text-gray-700 text-xs">
								{/* {selected?.raffleInfo?.deliveryEstimate ? (
								DateUtils.formatVietNamDate(
									selected?.raffleInfo?.deliveryEstimate ||
										"",
								)
							) : (
								<CircularProgress size={16} />
							)} */}
								{currentStep?.stepType ===
								EnumRafflePaymentStepType.COMPLETED ? (
									"___"
								) : (
									<>
										{selected?.shipping
											?.expectedDelivery || (
											<CircularProgress size={16} />
										)}
									</>
								)}
							</span>
						</div>
					</div>
				</div>
			</div>
			{/* <hr className="my-4" />
			<div className="text-lg font-semibold text-gray-500 mb-2">
				Điểm thưởng
			</div>
			<div className="flex justify-between">
				<div className="text-sm text-gray-400 mb-1 max-w-36">
					Điểm thưởng được nhận ở đơn hàng này
				</div>
				<div className="text-6xl font-bold text-gray-900">15</div>
			</div> */}
		</div>
	);
};

export default memo(ShopSummaryCard);
