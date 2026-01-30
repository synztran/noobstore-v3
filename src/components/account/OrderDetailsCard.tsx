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
	"Để đảm bảo an toàn cho người dùng, thanh toán sẽ được giữ lại cho đến khi maker khi đơn hàng được giao đến tay maker.";

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

	const rafflePaymentMethod =
		raffle?.payment?.paymentMethod || rafflePaymentForm?.paymentMethod;

	const raffleDonation =
		raffle?.payment?.donation?.donationAmount ||
		parseInt(raffleDonationForm?.amount || "", 10);

	return (
		<div className="bg-white rounded-xl shadow p-4 w-full mx-auto border border-gray-200 flex flex-col">
			<span className="text-lg font-semibold text-gray-500 tracking-wide mb-4">
				Thông tin đơn hàng
			</span>
			<div className="space-y-2 flex flex-col min-h-0">
				<div className="relative">
					<small className="text-sm">Tổng:</small>
					<strong className="text-4xl">
						{formatCurrency(
							rafflePaymentForm?.totalPrice || raffleTotalPrice,
						)}
					</strong>
				</div>
				<div className="bg-gray-200 rounded-lg p-2 flex justify-between items-center gap-6">
					<span className={`py-1 rounded font-semibold`}>
						Trạng thái thanh toán
					</span>
					<span
						className={`text-xs px-2 py-1 rounded font-semibold whitespace-nowrap ${mappingEnumRafflePaymentStatus[raffle?.paymentStatus].color} ${mappingEnumRafflePaymentStatus[raffle?.paymentStatus].bgColor}`}>
						{
							mappingEnumRafflePaymentStatus[
								raffle?.paymentStatus
							].label
						}
					</span>
				</div>
				<div
					className="text-xs text-gray-500 mb-2"
					style={{ textIndent: "1.5em" }}>
					{makerRaffleTimes > 3 ? letgitMaker : nonLegitMaker}
				</div>
				<div className="flex flex-col overflow-y-auto">
					<div className="mb-4">
						<div className=" font-semibold text-gray-500 mb-2 uppercase border-b-2 border-gray-200 max-w-max">
							Thông tin thanh toán
						</div>
						<div className="space-y-2">
							<div className="flex justify-between text-sm">
								<strong>Mã đơn hàng</strong>
								<span className="text-right">
									{raffle?.entryId}
								</span>
							</div>
							<div className="flex justify-between items-center text-sm">
								<strong>Phương thức</strong>
								<span
									className={`bg-gray-200 px-2 py-0.5 rounded-sm text-gray-700 ${mappingLabelPaymentMethod[rafflePaymentMethod || ""]?.bgColor || ""}`}>
									{rafflePaymentMethod
										? mappingLabelPaymentMethod[
												rafflePaymentMethod
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
										? raffle?.makerInfo?.brandName
										: "NoobStore"}
								</span>
							</div>
						</div>
					</div>
					<div className="">
						<div className=" font-semibold text-gray-500 mb-2 uppercase border-b-2 border-gray-200 max-w-max">
							Tổng tiền
						</div>
						<div className="space-y-1">
							<div className="flex justify-between text-sm">
								<strong>Tạm tính</strong>
								<span>
									{formatCurrency(raffleSubTotalPrice)}
								</span>
							</div>
							<div className="flex justify-between text-sm">
								<strong>Vận chuyển</strong>
								<span>
									{shipping?.shippingMethod?.price === 0
										? "Miễn phí"
										: formatCurrency(
												shipping?.shippingMethod
													?.price || 0,
											)}
								</span>
							</div>
							<Activity
								mode={
									raffleDonation && raffleDonation > 0
										? "visible"
										: "hidden"
								}>
								<div className="flex justify-between text-sm">
									<strong>Ủng hộ</strong>
									<span>
										{formatCurrency(raffleDonation || 0)}
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
									<span>
										{formatCurrency(raffleTaxAmount || 0)}
									</span>
								</div>
							</Activity>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(OrderDetailsCard);
