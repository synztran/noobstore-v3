import {
	mappingEnumRafflePaymentStatus,
	mappingLabelPaymentMethod,
} from "@/constants";
import { I3D_SHIPPING_TRUCK, I3D_SUMMARY_PRICE_LIST } from "@/constants/Images";
import { IBEResponseRaffleProductSelection } from "@/interface/Client/Raffle";
import { TResponseRaffleEntry } from "@/interface/Context/auth";
import { EnumRafflePaymentStatus } from "@/interface/interface";
import DateUtils from "@/utils/DateUtils";
import { formatCurrency } from "@/utils/FormatNumber";
import Image from "next/image";

interface IProps {
	raffle: TResponseRaffleEntry;
	winningProducts?: IBEResponseRaffleProductSelection[] | null;
}

const RafflePaymentStatusBlock = ({ raffle, winningProducts }: IProps) => {
	const paymentStatusInfo =
		mappingEnumRafflePaymentStatus[raffle.paymentStatus] || {};

	const { label, color, bgColor } = paymentStatusInfo;

	return (
		<div className="flex flex-col gap-2 relative">
			<div className="rounded-xl">
				<div className="font-bold bg-gray-200 w-full rounded-tl-xl rounded-tr-xl p-2 text-gray-800">
					<Image
						src={I3D_SUMMARY_PRICE_LIST}
						alt="Summary Price List"
						width={24}
						height={24}
						className="inline-block mr-2 scale-125"
					/>
					Thông tin thanh toán
				</div>
				<div className="space-y-2 p-2 border-2 border-gray-200 rounded-b-xl border-t-0">
					<DisplayBlock label="ID Raffle" value={raffle?.raffleId} />
					<hr className="border-t-2" />
					<DisplayBlock
						label="Thời gian thanh toán"
						value={
							<div className="text-sm font-bold">
								{DateUtils.formatVietNamDate(
									raffle?.joinedAt || "",
								)}{" "}
								-{" "}
								{DateUtils.formatVietNamTime(
									raffle?.joinedAt || "",
								)}
							</div>
						}
					/>
					<hr className="border-t-2" />
					{raffle.paymentStatus === EnumRafflePaymentStatus.PAID ? (
						<>
							<DisplayBlock
								label="Phương thức thanh toán"
								value={
									<div className="font-bold inline-flex gap-1 items-right text-sm">
										<Image
											src={
												mappingLabelPaymentMethod[
													raffle?.payment
														?.paymentMethod || ""
												]?.icon || ""
											}
											alt="icon"
											width={22}
											height={22}
											className={`${
												mappingLabelPaymentMethod[
													raffle?.payment
														?.paymentMethod || ""
												]?.icon
													? ""
													: "sr-only"
											}`}
										/>
										{
											mappingLabelPaymentMethod[
												raffle?.payment
													?.paymentMethod || ""
											]?.label
										}
									</div>
								}
							/>
							<hr className="border-t-2" />
						</>
					) : null}
					{raffle.paymentStatus === EnumRafflePaymentStatus.PAID ? (
						<>
							<DisplayBlock
								label="Đã thanh toán"
								value={
									<span className="font-bold text-sm">
										{formatCurrency(
											winningProducts?.reduce(
												(acc, product) =>
													acc + product.price,
												0,
											) || 0,
										)}
									</span>
								}
							/>
						</>
					) : null}
					<hr className="border-t-2" />
					<DisplayBlock
						label="Trạng thái thanh toán"
						value={
							<div
								className={`font-bold text-sm ${color} ${bgColor} py-1 px-2 rounded-lg inline-flex items-center gap-2`}>
								{label}
							</div>
						}
					/>
				</div>
			</div>
			<div className="rounded-xl">
				<div className="font-bold bg-gray-200 w-full rounded-tl-xl rounded-tr-xl p-2 text-gray-800">
					<Image
						src={I3D_SHIPPING_TRUCK}
						alt="Summary Price List"
						width={24}
						height={24}
						className="inline-block mr-2 scale-125"
					/>
					Thông tin giao hàng
				</div>
				<div className="space-y-2 p-2 border-2 border-gray-200 rounded-b-xl border-t-0">
					<DisplayBlock label="Mã vận đơn" value={raffle?.raffleId} />
					<hr className="border-t-2" />
					<DisplayBlock
						label="Vận chuyển bởi"
						value={
							<div className="bg-red-400  rounded-md px-2 py-0.5 max-w-max font-bold w-fit text-sm text-white">
								Vietnam Post
							</div>
						}
					/>
					<hr className="border-t-2" />
					<DisplayBlock
						label="Ngày gửi hàng"
						value={
							<div className="text-sm font-bold">
								{DateUtils.formatVietNamDate(
									raffle?.joinedAt || "",
								)}{" "}
								-{" "}
								{DateUtils.formatVietNamTime(
									raffle?.joinedAt || "",
								)}
							</div>
						}
					/>
				</div>
			</div>
		</div>
	);
};

export default RafflePaymentStatusBlock;

const DisplayBlock = ({
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
		<div className="flex justify-between items-center gap-4">
			<span className="font-semibold text-gray-600 text-sm">{label}</span>
			{typeof value === "string" || typeof value === "number" ? (
				<span className="font-bold text-sm my-auto">{value}</span>
			) : (
				value
			)}
		</div>
	);
};
