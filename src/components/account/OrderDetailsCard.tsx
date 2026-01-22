import {
	mappingEnumRafflePaymentStatus,
	mappingLabelPaymentMethod,
} from "@/constants";
import { IBEResponseRaffleProductSelection } from "@/interface/Client/Raffle";
import { TResponseRaffleEntry } from "@/interface/Context/auth";
import { formatCurrency } from "@/utils/FormatNumber";
import useRaffle from "@/zustand/useRaffle";
import React, { Activity, memo } from "react";

interface IProps {
	raffle: TResponseRaffleEntry;
	winningProducts: IBEResponseRaffleProductSelection[];
}

const letgitMaker =
	"Thanh toán sẽ được chuyển đến maker ngay sau khi raffle kết thúc và mọi thanh toán đã được thực hiện";
const nonLegitMaker =
	"Để đảm bảo an toàn cho người dùng, thanh toán sẽ được giữ lại cho đến khi maker khi đơn hành được giao đến tay maker.";

const OrderDetailsCard: React.FC<IProps> = ({ raffle, winningProducts }) => {
	const {
		rafflePaymentForm,
		raffleSubTotalPrice,
		raffleTotalPrice,
		raffleTaxAmount,
		raffleDonationForm,
	} = useRaffle();
	const { shipping } = raffle || {};

	const makerRaffleTimes = raffle?.makerInfo?.raffleTimes || 0;

	console.log("rafflePaymentForm", rafflePaymentForm);

	return (
		<div className="bg-white rounded-xl shadow p-4 w-full mx-auto border border-gray-200 max-h-max space-y-2">
			<div className="flex justify-between items-center mb-4">
				<span className="text-lg font-semibold text-gray-500 tracking-wide">
					Thông tin đơn hàng
				</span>
			</div>
			<div className="text-4xl font-bold">
				{formatCurrency(raffleTotalPrice)}
			</div>
			<div className="bg-gray-200 rounded-lg p-2 flex justify-between items-center gap-2">
				<span className={`py-1 rounded`}>Trạng thái</span>
				<span
					className={`text-xs px-2 py-1 rounded font-semibold ${mappingEnumRafflePaymentStatus[raffle?.paymentStatus].color} ${mappingEnumRafflePaymentStatus[raffle?.paymentStatus].bgColor}`}>
					{
						mappingEnumRafflePaymentStatus[raffle?.paymentStatus]
							.label
					}
				</span>
			</div>
			<div
				className="text-xs text-gray-500 mb-2"
				style={{ textIndent: "1.5em" }}>
				{makerRaffleTimes > 3 ? letgitMaker : nonLegitMaker}
			</div>
			<div className="mb-4">
				<div className="text-sm font-semibold text-gray-500 mb-2 uppercase border-b-2 border-gray-200 max-w-max">
					Thông tin thanh toán
				</div>
				<div className="space-y-2">
					<div className="flex justify-between text-sm">
						<strong>Mã đơn hàng</strong>
						<span className="font-mono">{raffle?.entryId}</span>
					</div>
					<div className="flex justify-between items-center text-sm">
						<strong>Phương thức</strong>
						<span className="bg-gray-200 px-2 py-0.5 rounded-sm text-gray-700 ">
							{rafflePaymentForm?.paymentMethod
								? mappingLabelPaymentMethod[
										rafflePaymentForm?.paymentMethod
									].label
								: "Chưa chọn"}
						</span>
					</div>
					<div className="flex justify-between text-sm">
						<strong>Hình thức</strong>
						<span className="bg-gray-200 px-2 py-.5 rounded-sm text-gray-700">
							100%
						</span>
					</div>
					<div className="flex justify-between text-sm">
						<strong>Nền tảng</strong>
						<span>
							{makerRaffleTimes > 3
								? "Noobstore"
								: raffle?.makerInfo?.brandName}
						</span>
					</div>
				</div>
			</div>
			<div className="">
				<div className="text-sm font-semibold text-gray-500 mb-2 uppercase border-b-2 border-gray-200 max-w-max">
					Tổng tiền
				</div>
				<div className="space-y-1">
					<div className="flex justify-between text-sm">
						<strong>Tạm tính</strong>
						<span>{formatCurrency(raffleSubTotalPrice)}</span>
					</div>
					<div className="flex justify-between text-sm">
						<strong>Vận chuyển</strong>
						<span>
							{shipping?.shippingMethod?.price === 0
								? "Miễn phí"
								: formatCurrency(
										shipping?.shippingMethod?.price || 0,
									)}
						</span>
					</div>
					<Activity
						mode={
							raffleDonationForm?.amount &&
							parseInt(raffleDonationForm.amount, 10) > 0
								? "visible"
								: "hidden"
						}>
						<div className="flex justify-between text-sm">
							<strong>Ủng hộ maker</strong>
							<span>
								{formatCurrency(
									parseInt(
										raffleDonationForm?.amount || "0",
										10,
									) || 0,
								)}
							</span>
						</div>
					</Activity>
					<Activity
						mode={
							raffle?.raffleInfo?.taxPercent
								? "visible"
								: "hidden"
						}>
						<div className="flex justify-between text-sm">
							<strong>Thuế</strong>
							<span>{formatCurrency(raffleTaxAmount || 0)}</span>
						</div>
					</Activity>
				</div>
			</div>
		</div>
	);
};

export default memo(OrderDetailsCard);
