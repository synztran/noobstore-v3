import {
	mapPaymentStatus,
	mappingLabelPaymentForm,
	mappingLabelPaymentMethod,
} from "@/constants";
import { IResponseBackendServiceBooking } from "@/interface/Client/Service";
import { EnumPaymentForm, EnumPaymentStatus } from "@/interface/interface";
import DateUtils from "@/utils/DateUtils";
import { formatCurrency } from "@/utils/FormatNumber";
import Image from "next/image";
import BookingStepper from "../BookingStepper";

interface IProps {
	service: IResponseBackendServiceBooking;
}

const PaymentStatusChecking = ({ service }: IProps) => {
	const paymentStatusInfo = mapPaymentStatus[service.paymentStatus] || {};

	const { label, subLabel, icon } = paymentStatusInfo;

	return (
		<div className="flex flex-col gap-2 relative space-y-8">
			{/* header */}
			<div className="relative flex flex-col gap-2 items-center">
				<div className="w-20 h-20 relative bg-blue-100 rounded-full">
					<Image
						src={icon || ""}
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

			<div className="flex gap-4">
				<div className="space-y-2 w-[45%]">
					<div className="border-2 border-gray-200 rounded-xl p-4 space-y-4">
						<div className="font-bold text-xl">
							Thông tin thanh toán
						</div>
						<div className="space-y-2">
							<DisplayBlock
								label="Mã giao dịch"
								value={service?.payment.transitionId}
							/>
							<hr className="border-t-2" />
							<DisplayBlock
								label="Thời gian"
								value={
									<div className="text-sm font-bold">
										{DateUtils.formatVietNamDate(
											service?.payment.submittedAt || "",
										)}{" "}
										-{" "}
										{DateUtils.formatVietNamTime(
											service?.payment.submittedAt || "",
										)}
									</div>
								}
							/>
							<hr className="border-t-2" />
							<DisplayBlock
								label="Hình thức thanh toán"
								value={
									<div className="font-bold inline-flex gap-1 items-center text-sm">
										<Image
											src={
												mappingLabelPaymentMethod[
													service?.payment
														.paymentMethod || ""
												].icon || ""
											}
											alt="icon"
											width={22}
											height={22}
											className={`${
												mappingLabelPaymentMethod[
													service?.payment
														.paymentMethod || ""
												].icon
													? ""
													: "sr-only"
											}`}
										/>
										{
											mappingLabelPaymentMethod[
												service?.payment
													.paymentMethod || ""
											].label
										}
									</div>
								}
							/>
							<hr className="border-t-2" />
							<DisplayBlock
								label="Phương thức thanh toán"
								value={
									<span className="font-bold text-sm">
										{
											mappingLabelPaymentForm[
												service?.payment.paymentForm ||
													""
											].label
										}
									</span>
								}
							/>
							<hr className="border-t-2" />
							<DisplayBlock
								label="Tổng tiền"
								value={formatCurrency(service?.totalPrice)}
							/>
							<hr className="border-t-2" />
							<DisplayBlock
								label="Đã thanh toán"
								value={
									<span className="font-bold text-sm">
										{formatCurrency(
											service?.payment.paidAmount,
										)}
									</span>
								}
							/>
							{service?.payment.paymentForm !==
							EnumPaymentForm.FULL ? (
								<>
									<hr />
									<DisplayBlock
										label="Còn lại"
										value={
											<span className="font-bold text-sm">
												{formatCurrency(
													service?.payment
														.remainingAmount,
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
										className={`font-bold text-sm ${paymentStatusInfo.color} ${paymentStatusInfo.bgColor} py-1 px-2 rounded-lg inline-flex items-center gap-2`}>
										{paymentStatusInfo.iconBadge}
										{mapPaymentStatus[
											service.paymentStatus as EnumPaymentStatus
										]?.label || ""}
									</div>
								}
							/>
						</div>
					</div>
				</div>
				<div className="space-y-4 w-[55%] p-4 border-2 border-gray-200 rounded-xl">
					<div className="text-lg font-bold">Trạng thái đơn hàng</div>
					{/* <div className="flex flex-col gap-4">
						<div className="border-2 border-gray-200 rounded-xl p-4 w-full flex gap-4">
							<div className="min-w-[56px] h-[56px] relative overflow-hidden rounded-full">
								<Image
									src={LOGO_STORE}
									alt="NoobStore"
									fill
									objectFit="cover"
									draggable={false}
								/>
							</div>
							<div className="flex gap-4 justify-between w-full">
								<div className="flex-1 my-auto">
									<div className="font-semibold">
										NoobStore's Service
									</div>
									<div className="text-sm text-gray-600 whitespace-normal">
									</div>
								</div>
								<div className="space-x-4 my-auto">
									<button className="border border-gray-500 p-1.5 rounded-full">
										<Phone
											className="stroke-gray-500"
											size={16}
										/>
									</button>
									<button className="border border-gray-500 p-1.5 rounded-full">
										<MessageCircle
											className="stroke-gray-500"
											size={16}
										/>
									</button>
								</div>
							</div>
						</div>
					</div> */}
					<BookingStepper service={service} />
				</div>
			</div>
		</div>
	);
};

export default PaymentStatusChecking;

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
		<div className="flex justify-between items-center ">
			<span className="font-semibold text-gray-600 text-sm">{label}</span>
			{typeof value === "string" || typeof value === "number" ? (
				<span className="font-bold text-sm my-auto">{value}</span>
			) : (
				value
			)}
		</div>
	);
};
