import { TResponseRaffleEntry } from "@/interface/Context/auth";
import DateUtils from "@/utils/DateUtils";
import { CircularProgress } from "@mui/material";
import React from "react";
import SimpleMap from "./SimpleMap";

interface IProps {
	selected: TResponseRaffleEntry | null;
}

const ShopSummaryCard: React.FC<IProps> = ({ selected }) => {
	return (
		<div className="bg-white rounded-xl shadow p-4 w-full mx-auto border border-gray-200 flex flex-col gap-2">
			<SimpleMap address={selected?.shipping?.address || ""} />
			<div className="min-h-0 overflow-y-auto h-full flex-1 pr-2">
				<div className="font-bold">{selected?.shipping?.city}</div>
				<div className="text-sm text-gray-400 mb-4">
					{selected?.shipping?.address}
				</div>
				<hr className="mb-4" />
				<div className="space-y-2">
					<div className="flex justify-between items-center">
						<span className="text-sm text-gray-400 font-semibold">
							Đơn vị vận chuyển
						</span>
						<span className="font-semibold text-xs text-gray-900 bg-gray-200 rounded-md px-2 py-1">
							{selected?.shipping?.shippingMethod?.name ||
								"Undefined"}
						</span>
					</div>
					<div className="flex justify-between items-center">
						<span className="text-sm text-gray-400 font-semibold">
							Mã vận đơn
						</span>
						<span className="font-medium text-gray-700">
							<CircularProgress size={16} />
						</span>
					</div>
					<div className="flex justify-between items-center">
						<span className="text-sm text-gray-400 font-semibold">
							Dự kiến giao
						</span>
						<span className="font-medium text-gray-700">
							{selected?.raffleInfo?.deliveryEstimate ? (
								DateUtils.formatVietNamDate(
									selected?.raffleInfo?.deliveryEstimate ||
										"",
								)
							) : (
								<CircularProgress size={16} />
							)}
						</span>
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

export default ShopSummaryCard;
