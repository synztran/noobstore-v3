import { IBEResponseRaffleProductSelection } from "@/interface/Client/Raffle";
import { TResponseRaffleEntry } from "@/interface/Context/auth";
import { formatCurrency } from "@/utils/FormatNumber";
import useRaffle from "@/zustand/useRaffle";
import React from "react";

interface IProps {
	raffle: TResponseRaffleEntry;
	winningProducts: IBEResponseRaffleProductSelection[];
}

const OrderDetailsCard: React.FC<IProps> = ({ raffle, winningProducts }) => {
	console.log("raffle", raffle);
	console.log("winningProducts", winningProducts);
	const { rafflePaymentForm, raffleSubTotalPrice, raffleTotalPrice } =
		useRaffle();
	const { shipping } = raffle || {};

	return (
		<div className="bg-white rounded-xl shadow p-4 w-full mx-auto border border-gray-200 max-h-max">
			<div className="mb-4 flex justify-between items-center">
				<span className="text-lg   font-semibold text-gray-500 tracking-wide">
					Tổng đơn hàng
				</span>
				{/* <button className="text-gray-400 hover:text-gray-600 text-lg font-bold">
					•••
				</button> */}
			</div>
			<div className="text-4xl font-bold mb-4">
				{formatCurrency(raffleTotalPrice)}
			</div>
			<div className="bg-gray-50 rounded-lg p-4 flex items-center gap-4 mb-6">
				<div className="flex items-center gap-2">
					<span className="bg-black text-white text-xs px-2 py-1 rounded font-semibold">
						cardType
					</span>
					<span className="text-lg font-mono tracking-widest">
						••••
					</span>
				</div>
				<span
					className={`ml-auto px-2 py-1 rounded text-xs font-bold `}>
					cardStatus
				</span>
			</div>
			<div className="text-xs text-gray-500 mb-6">cardNote</div>
			<div className="mb-4">
				<div className="text-sm font-semibold text-gray-500 mb-2 uppercase">
					Chi tiết đơn hàng
				</div>
				<div className="space-y-1">
					<div className="flex justify-between text-sm">
						<span>Mã</span>
						<span className="font-mono">{raffle?.entryId}</span>
					</div>
					<div className="flex justify-between text-sm">
						<span>Tạm tính</span>
						<span>{formatCurrency(raffleSubTotalPrice)}</span>
					</div>
					<div className="flex justify-between text-sm">
						<span>Vận chuyển</span>
						<span>
							{shipping?.shippingMethod?.price === 0
								? "Miễn phí"
								: formatCurrency(
										shipping?.shippingMethod?.price || 0,
									)}
						</span>
					</div>
					<div className="flex justify-between text-sm">
						<span>Thuế</span>
						<span>Miễn thuế</span>
					</div>
					<div className="flex justify-between text-sm">
						<span>Phương thức thanh toán</span>
						<span>{rafflePaymentForm?.paymentMethod || "N/a"}</span>
					</div>
					<div className="flex justify-between text-sm">
						<span>Hình thức thanh toán</span>
						<span
							className="bg-green-600 px-1 py-.5 rounded-sm text-white font-bol
            d">
							100%
						</span>
					</div>
					<div className="flex justify-between text-sm">
						<span>Trạng thái</span>
						<span className="font-mono">Đang kiểm tra</span>
					</div>
					<div className="flex justify-between text-sm">
						<span>Nền tảng</span>
						<span>Noobstore</span>
					</div>
				</div>
			</div>
			<div className="flex flex-col gap-2 mt-6">
				{/* <button
					className="w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-900 transition"
					onClick={onFlagFraud}>
					Xác nhận giao dịch
				</button> */}
				{/* <button
					className="w-full border border-gray-300 text-black py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
					onClick={onRefund}>
					Hoàn tiền
				</button> */}
			</div>
		</div>
	);
};

export default OrderDetailsCard;
