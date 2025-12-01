import { mapPaymentStatus } from "@/constants";
import {
	BANK_TRANSFER_ICON,
	COD_ICON,
	HUNDRED_PERCENT_ICON,
	MOMO_LOGO,
	MOMO_QR,
	NEW_MISSING_IMAGE,
	PAYPAL_1_ICON,
	TEN_PERCENT_ICON,
	THIRDTY_PERCENT_ICON,
	VIETINBANK_LOGO,
	VIETINBANK_QR,
} from "@/constants/Images";
import {
	IRequestServiceDonation,
	IResponseBackendServiceBooking,
	TRequestServiceSubmitPayment,
} from "@/interface/Client/Service";
import {
	EnumPaymentForm,
	EnumPaymentMethod,
	EnumPaymentStatus,
} from "@/interface/interface";
import { formatCurrency } from "@/utils/FormatNumber";
import useServices, {
	IDonation,
	IPaymentForm,
	IPaymentMethod,
	useServiceAction,
} from "@/zustand/useServices";
import { Check } from "lucide-react";
import Image from "next/image";
import DonationBlock from "../DonationBlock";
import { useEffect, useMemo, useState } from "react";
import { useSubmitPaymentMutation } from "@/react-query/services/api/useBookingServiceMutation";
import InfoPaymentSentBlock from "../InfoPaymentSentBlock";

const paymentMethodOptions = [
	{
		id: 1,
		name: "Thanh toán khi nhận hàng",
		description:
			"Thanh toán khi nhận hàng. Hỗ trợ khách hàng thân thiết hoặc đơn hàng nhỏ",
		isActive: false,
		value: EnumPaymentMethod.CASH_ON_DELIVERY,
		icon: COD_ICON,
		iconW: 120,
		iconH: 48,
		isOnlyIcon: true,
	},
	{
		id: 2,
		name: "Chuyển khoản ngân hàng",
		description: "Thanh toán bằng hình thức chuyển khoản ngân hàng",
		isActive: true,
		value: EnumPaymentMethod.BANK_TRANSFER,
		icon: BANK_TRANSFER_ICON,
		isOnlyIcon: true,
		iconW: 70,
		iconH: 48,
		info: {
			label: "Vietinbank",
			logo: VIETINBANK_LOGO,
			accountNumber: "1090-0066-3716",
			accountHolder: "Trần Hồng Hải",
			qrCodeImage: VIETINBANK_QR,
			scale: 1.8,
		},
	},
	{
		id: 3,
		name: "Ví MoMo",
		description: "Thanh toán nhanh chóng qua ứng dụng MoMo",
		isActive: true,
		value: EnumPaymentMethod.MOMO,
		icon: MOMO_LOGO,
		isOnlyIcon: true,
		iconW: 48,
		iconH: 48,
		info: {
			label: "MoMo",
			logo: MOMO_LOGO,
			accountNumber: "083-922-0900",
			accountHolder: "Trần Hồng Hải",
			qrCodeImage: MOMO_QR,
			scale: 1,
		},
	},
	{
		id: 4,
		name: "PayPal",
		description: "Thanh toán an toàn qua tài khoản PayPal",
		isActive: false,
		info: {
			label: "PayPal",
			logo: PAYPAL_1_ICON,
			accountNumber: "paypal-account-number",
			accountHolder: "CONG TY TNHH NOOBSTORE",
		},
		value: EnumPaymentMethod.PAYPAL,
		icon: PAYPAL_1_ICON,
		isOnlyIcon: true,
		iconW: 90,
		iconH: 48,
		scale: 2.2,
	},
];

const PaymentBlock = ({
	service,
}: {
	service: IResponseBackendServiceBooking;
}): JSX.Element => {
	const { paymentForm, paymentMethod, donation } = useServices();
	const { selectPaymentMethod, selectPaymentForm } = useServiceAction();
	const postSubmitPayment = useSubmitPaymentMutation();
	const { mutate, isPending } = postSubmitPayment;

	const getTotalAmount = (): number => {
		return service?.totalPrice || 0;
	};
	const total = getTotalAmount();
	const amountToPay = Math.round(total * (paymentForm?.percentage || 0));
	const fullPay = Math.round(total + (donation?.totalDonated || 0));
	const isPartialPayment =
		paymentForm?.percentage !== undefined && paymentForm.percentage < 1;
	const remainingAmount =
		total - (paymentForm?.paid || 0) + (donation?.totalDonated || 0);
	const paymentStatusInfo =
		mapPaymentStatus[service?.paymentStatus || EnumPaymentStatus.PENDING];
	const isDisabledChange =
		service?.paymentStatus !== EnumPaymentStatus.PENDING;

	const paymentFormOptions: IPaymentForm[] = [
		{
			id: 1,
			name: "10%",
			description: "Hỗ trợ thanh toán trước 10%.",
			isActive: false,
			discount: 0,
			percentage: 0.1,
			paid: Math.round(service?.totalPrice * 0.1),
			remaining: Math.round(service?.totalPrice * 0.9),
			icon: TEN_PERCENT_ICON,
			value: EnumPaymentForm.PARTIAL_10_PERCENT,
		},
		{
			id: 2,
			name: "30%",
			description: "Hỗ trợ thanh toán trước 30%.",
			isActive: true,
			discount: 0,
			percentage: 0.3,
			paid: Math.round(service.totalPrice * 0.3),
			remaining: Math.round(service.totalPrice * 0.7),
			icon: THIRDTY_PERCENT_ICON,
			value: EnumPaymentForm.PARTIAL_30_PERCENT,
		},
		{
			id: 3,
			name: "100%",
			description:
				"Thanh toán 100% giá trị dịch vụ. Để được hưởng ưu đãi riêng từ shop",
			isActive: true,
			discount: 20000,
			percentage: 1,
			paid: service?.totalPrice,
			remaining: 0,
			icon: HUNDRED_PERCENT_ICON,
			value: EnumPaymentForm.FULL,
		},
	];

	const selectedPaymentFormOption = useMemo(() => {
		if (service?.payment?.paymentForm) {
			return paymentFormOptions.find(
				(option) => option.value === service.payment.paymentForm
			);
		}

		return paymentFormOptions.find(
			(option) => option.value === paymentForm?.value
		);
	}, [service?.payment, paymentForm]);

	const selectedPaymentMethodOption = useMemo(() => {
		if (service?.payment?.paymentMethod) {
			return paymentMethodOptions.find(
				(option) => option.value === service.payment.paymentMethod
			);
		}

		return paymentMethodOptions.find(
			(option) => option.value === paymentMethod?.value
		);
	}, [service?.payment, paymentMethod]);

	const handlePay = async () => {
		if (!paymentForm || !paymentForm.percentage) return;
		if (!paymentMethod) return;

		const payload: {
			payment: TRequestServiceSubmitPayment;
			donation?: IRequestServiceDonation | null;
		} = {
			payment: {
				serviceBookingId: service.serviceBookingId,
				paymentMethod: paymentMethod.value,
				paymentForm: paymentForm.value,
				paidAmount: amountToPay,
				paidPercentage: paymentForm.percentage || 1,
				remainingAmount: remainingAmount,
				submittedAt: new Date().toISOString(),
				attachments: [],
			},
			donation: {
				donationAmount: donation?.totalDonated || 0,
				donationPercentage: donation?.percentage || 0,
				donationMessage: donation?.message || "",
			},
		};

		mutate({ pSubmitPayment: payload });
	};

	return (
		<div className="bg-white rounded-xl shadow-lg border p-4 space-y-4">
			<div className="flex items-center gap-4">
				<div className="relative w-16 h-16">
					<Image
						src={BANK_TRANSFER_ICON}
						alt="Payment"
						fill
						className="object-contain"
					/>
				</div>
				<div className="flex flex-col items-start">
					<h2 className="text-xl font-bold">Thanh toán</h2>
					<p className="text-gray-600">
						Chọn phương thức & hình thức thanh toán phù hợp
					</p>
				</div>
			</div>

			{/* Payment Status */}
			<div className="relative">
				<div className="flex items-center justify-between p-4 bg-gray-200 rounded-lg">
					<span className="font-semibold">
						Trạng thái thanh toán:
					</span>
					<div
						className={`text-sm text-white font-bold px-4 py-2 rounded-lg border ${paymentStatusInfo?.bgColor}`}>
						{paymentStatusInfo?.label}
					</div>
				</div>
			</div>

			{/* <InfoPaymentSentBlock service={service} /> */}

			{/* Payment Method Selection */}
			<div className="mb-8 space-y-4">
				<h3 className="text-lg font-semibold">
					Phương thức thanh toán
				</h3>
				<div className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{paymentMethodOptions?.map((option) => (
							<div className="relative">
								<label
									className={`w-full h-full
								flex p-4 border-2 border-gray-400 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg relative
								${
									(service?.payment?.paymentMethod ||
										paymentMethod?.value) === option.value
										? "border-green-500 bg-gradient-to-r from-green-50 to-green-100 shadow-lg"
										: "hover:border-blue-300"
								}
                ${
					!option.isActive
						? "blur-sm !cursor-not-allowed pointer-events-none"
						: ""
				}
							`}>
									<input
										id={option.value}
										type="radio"
										value={option.value}
										disabled={
											!option.isActive || isDisabledChange
										}
										checked={
											(service?.payment?.paymentMethod ||
												paymentMethod?.value) ===
											option.value
										}
										onChange={() => {
											if (isDisabledChange) return;
											selectPaymentMethod(option);
										}}
										className="mr-4 w-5 h-5 sr-only"
									/>
									<div className="flex-1">
										<div className="flex items-center gap-2 mb-2">
											{option?.icon ? (
												<div
													className={`relative overflow-hidden`}
													style={{
														height: `${option.iconH}px`,
														width: `${option.iconW}px`,
													}}>
													<Image
														src={option.icon}
														alt={option.name}
														fill
														objectFit="contain"
														draggable={false}
														style={{
															transform: `scale(${
																option.scale ||
																1
															})`,
														}}
													/>
												</div>
											) : null}
											<span className="font-bold">
												{option.name}
											</span>
										</div>
										<p className="text-gray-600 text-sm">
											{option.description}
										</p>
									</div>
									{(service?.payment?.paymentMethod ||
										paymentMethod?.value) ===
										option.value && (
										<div className="absolute -top-1 -right-1 -translate-y-1 translate-x-1">
											<span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-600 text-white shadow">
												<Check
													size={14}
													className="stroke-white"
													style={{ strokeWidth: 4 }}
												/>
											</span>
										</div>
									)}
								</label>
								{!option.isActive ? (
									<div className="whitespace-nowrap max-w-max max-h-max px-3 py-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center flex items-center justify-center rounded-sm font-semibold text-red-600 bg-gray-100 shadow-md">
										Không khả dụng
									</div>
								) : null}
							</div>
						))}
					</div>
					{selectedPaymentMethodOption ? (
						<div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg border-2 border-blue-200 p-4 space-y-2">
							<div className="flex items-center gap-3">
								<span className="text-[32px]">📋</span>
								<div>
									<h3 className="text-lg font-bold text-blue-800">
										Hướng dẫn thực hiện giao dịch
									</h3>
									<p className="text-blue-600 text-sm">
										Vui lòng chuyển khoản theo thông tin bên
										dưới
									</p>
								</div>
							</div>

							<div className="bg-white rounded-lg p-4 shadow-inner border space-y-4">
								<div className="flex gap-4">
									<div
										className={`w-1/2 flex flex-col gap-2 h-auto ${
											selectedPaymentMethodOption?.value ===
											EnumPaymentMethod.BANK_TRANSFER
												? "justify-between"
												: ""
										}`}>
										{selectedPaymentMethodOption?.value ===
										EnumPaymentMethod.BANK_TRANSFER ? (
											<div className="w-full border-b border-gray-300">
												<label className="block font-semibold text-gray-700 mb-1">
													🏦 Ngân hàng
												</label>
												<div className="relative w-full h-24">
													<Image
														src={
															selectedPaymentMethodOption
																?.info?.logo ||
															""
														}
														alt="Vietinbank"
														objectFit="contain"
														fill
													/>
												</div>
											</div>
										) : null}
										<div className="w-full">
											<label className="block font-semibold text-gray-800 mb-1">
												💳 Số tài khoản
											</label>
											<p className="font-mono bg-gray-200 p-2 rounded font-bold text-blue-600">
												{selectedPaymentMethodOption
													?.info?.accountNumber || ""}
											</p>
										</div>
										<div className="w-full">
											<label className="block font-semibold text-gray-700 mb-1">
												👤 Chủ tài khoản
											</label>
											<p className="text-base bg-gray-200 p-2 rounded">
												{selectedPaymentMethodOption
													?.info?.accountHolder || ""}
											</p>
										</div>
										<div className="w-full">
											<label className="block font-semibold text-gray-700 mb-1">
												📝 Nội dung chuyển khoản
											</label>
											<p className="text-lg font-mono bg-gray-200 p-2 rounded font-bold text-green-600">
												{service?.serviceBookingId}
											</p>
										</div>
									</div>

									<div className="flex flex-col w-1/2">
										<label className="block font-semibold text-gray-700 mb-1">
											🏦 QR thanh toán
										</label>
										<div
											className={`w-full relative overflow-hidden ${
												selectedPaymentMethodOption
													?.info?.scale !== 1
													? "h-[96%]"
													: "h-80"
											}`}>
											<Image
												src={
													selectedPaymentMethodOption
														?.info?.qrCodeImage ||
													""
												}
												alt="QR Code"
												objectFit="contain"
												fill
												draggable={false}
												className={`${
													selectedPaymentMethodOption
														?.info?.scale !== 1
														? "!top-[17.5%]"
														: ""
												}`}
												style={{
													scale: `${
														selectedPaymentMethodOption
															?.info?.scale || 1
													}`,
												}}
											/>
										</div>
									</div>
								</div>

								<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
									<div className="flex items-start gap-3">
										<span className="text-yellow-600 text-xl">
											⚠️
										</span>
										<div>
											<p className="font-semibold text-yellow-800">
												Lưu ý quan trọng:
											</p>
											<ul className="text-yellow-700">
												<li className="text-sm">
													• Kiểm tra kĩ thông tin
													trước chuyển khoản
												</li>
												<li className="text-sm">
													• Vui lòng chuyển khoản đúng
													số tiền và ghi đúng nội dung
												</li>
												<li className="text-sm">
													• Thanh toán sẽ được xác
													nhận tự động trong vòng 1-3
													phút
												</li>
												<li className="text-sm">
													• Liên hệ shop nếu có vấn đề
													cần hỗ trợ
												</li>
											</ul>
										</div>
									</div>
								</div>
							</div>
						</div>
					) : null}
				</div>
			</div>

			{/* Deposit Selection */}
			<div className="mb-8">
				<h3 className="text-lg font-semibold mb-4 border-b border-gray-200">
					Hình thức thanh toán
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{paymentFormOptions?.map((option) => (
						<div className="relative">
							<label
								className={`block w-full h-full p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 	${
									selectedPaymentFormOption?.value ===
									option.value
										? "border-green-500 bg-green-50 shadow-lg"
										: "border-gray-200 hover:border-green-300"
								}  ${
									!option.isActive
										? "blur-sm !cursor-not-allowed pointer-events-none"
										: ""
								}`}>
								<input
									type="radio"
									value={option?.percentage || 0}
									checked={
										selectedPaymentFormOption?.value ===
										option.value
									}
									onChange={() => selectPaymentForm(option)}
									className="sr-only"
									disabled={!option.isActive}
								/>
								<div className="text-center mx-auto space-y-2">
									<div className="w-12 h-12 relative mx-auto">
										<Image
											src={
												option.icon || NEW_MISSING_IMAGE
											}
											alt={option.name}
											fill
											objectFit="cover"
											draggable={false}
										/>
									</div>
									<div className="text-green-600 font-semibold text-xl">
										{formatCurrency(
											Math.round(
												total * (option.percentage || 0)
											)
										)}
									</div>
									<div className="text-sm text-gray-600 mt-1">
										{option.description}
									</div>
								</div>
								{selectedPaymentFormOption?.value ===
									option.value && (
									<div className="absolute -top-1 -right-1 -translate-y-1 translate-x-1">
										<span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-600 text-white shadow">
											<Check
												size={14}
												className="stroke-white"
												style={{ strokeWidth: 4 }}
											/>
										</span>
									</div>
								)}
							</label>
							{!option.isActive ? (
								<div className="whitespace-nowrap max-w-max max-h-max px-2 py-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center flex items-center justify-center rounded-sm font-semibold text-red-600 bg-gray-50 shadow-md text-sm">
									Không khả dụng
								</div>
							) : null}
						</div>
					))}
				</div>
			</div>

			{/* Donation */}
			<div className="mb-8">
				<DonationBlock service={service} />
			</div>

			{/* Amount Summary */}
			<div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 mb-8 border-2 border-green-200">
				<div className="text-2xl font-semibold mb-4 text-center">
					Tóm tắt thanh toán
				</div>
				<div
					className={`flex items-center gap-6 justify-around mx-auto`}>
					{donation?.totalDonated ? (
						<div className="text-center">
							<div className=" text-gray-600 mb-1">Ủng hộ</div>
							<div className="text-lg font-bold text-orange-400">
								{formatCurrency(donation?.totalDonated || 0)}
							</div>
						</div>
					) : null}
					<div className="text-center">
						<div className=" text-gray-600 mb-1">Tiền dịch vụ</div>
						<div className="text-lg font-bold text-gray-900">
							{formatCurrency(total)}
						</div>
					</div>

					{isPartialPayment ? (
						<div className="text-center">
							<div className=" text-gray-600 mb-1">
								Thanh toán 1 phần
							</div>
							<div className="text-lg font-bold text-green-600">
								{formatCurrency(amountToPay || 0)}
							</div>
						</div>
					) : null}
					<div className="text-center">
						<div className=" text-gray-600 mb-1">
							{!isPartialPayment ? "Cần thanh toán" : "Còn lại"}
						</div>
						<div
							className={`text-lg font-bold ${
								!isPartialPayment
									? "text-green-700"
									: "text-red-400"
							}`}>
							{!isPartialPayment
								? formatCurrency(fullPay)
								: formatCurrency(remainingAmount)}
						</div>
					</div>
				</div>
				{paymentForm && (paymentForm?.percentage || 0) < 1 ? (
					<div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
						<p className="text-yellow-800 text-sm text-center">
							⚠️ Bạn cần thanh toán số tiền còn lại{" "}
							<span className="text-red-400 font-bold text-lg">
								({formatCurrency(remainingAmount)})
							</span>{" "}
							sau khi dịch vụ hoàn thành.
						</p>
					</div>
				) : null}
			</div>

			{/* Success Message */}
			{/* {successMessage && (
				<div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl">
					<div className="flex items-center gap-3">
						<span className="text-2xl">🎉</span>
						<div>
							<p className="font-semibold text-green-800">
								Thanh toán thành công!
							</p>
							<p className="text-green-700 text-sm">
								{successMessage}
							</p>
						</div>
					</div>
				</div>
			)} */}

			{/* Payment Button */}
			<div className="flex flex-col sm:flex-row gap-4">
				<button
					type="button"
					onClick={handlePay}
					disabled={
						isPending ||
						// service.paymentStatus === EnumPaymentStatus.PAID ||
						!paymentMethod ||
						!paymentForm
					}
					className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none disabled:cursor-not-allowed shadow-xl">
					{isPending ? (
						<div className="flex items-center justify-center">
							<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
							Đang xử lý thanh toán...
						</div>
					) : service.paymentStatus === EnumPaymentStatus.PAID ? (
						<div className="flex items-center justify-center">
							<span className="mr-3 text-xl">✅</span>
							Đã thanh toán
						</div>
					) : (
						<div className="flex items-center justify-center text-white text-xl">
							<span className="mr-3 text-lg">💳</span>
							{!paymentForm ? "Chọn hình thức thanh toán" : ""}
							{paymentForm && !paymentMethod
								? "Chọn phương thức thanh toán"
								: ""}
							{paymentForm && paymentMethod ? (
								<>
									Thanh toán{" "}
									{formatCurrency(
										paymentForm?.value !==
											EnumPaymentForm.FULL
											? amountToPay
											: fullPay
									)}
								</>
							) : null}
						</div>
					)}
				</button>
			</div>

			{/* Error Message */}
			{/* {error && (
				<div className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
					<div className="flex items-center gap-3">
						<span className="text-2xl">❌</span>
						<div>
							<p className="font-semibold text-red-800">
								Lỗi thanh toán
							</p>
							<p className="text-red-700 text-sm">{error}</p>
						</div>
					</div>
				</div>
			)} */}
		</div>
	);
};

export default PaymentBlock;
