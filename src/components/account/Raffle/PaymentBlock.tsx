import {
	mapPaymentStatus,
	mappingBankInfo,
	mappingEnumRafflePaymentStatus,
	mappingLabelPaymentMethod,
} from "@/constants";
import {
	BANK_TRANSFER_ICON,
	COD_ICON,
	HUNDRED_PERCENT_ICON,
	I3D_NOTE,
	I3D_RAFFLE_PAYMENT,
	MOMO_LOGO,
	MOMO_QR,
	PAYPAL_1_ICON,
	VIETINBANK_LOGO,
	VIETINBANK_QR,
} from "@/constants/Images";
import { IBEResponseRaffleProductSelection } from "@/interface/Client/Raffle";
import {
	IBEResponseRafflePaymentMethod,
	TResponseRaffleEntry,
} from "@/interface/Context/auth";
import {
	EnumPaymentForm,
	EnumPaymentMethod,
	EnumRafflePaymentStatus,
} from "@/interface/interface";
import { formatCurrency } from "@/utils/FormatNumber";
import { Check } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import RafflePaymnetDonation from "./RaffleDonation";

// const paymentMethodOptions = [
// 	{
// 		id: 1,
// 		name: "Thanh toán khi nhận hàng",
// 		description:
// 			"Thanh toán khi nhận hàng. Hỗ trợ khách hàng thân thiết hoặc đơn hàng nhỏ",
// 		isActive: false,
// 		value: EnumPaymentMethod.CASH_ON_DELIVERY,
// 		icon: COD_ICON,
// 		iconW: 120,
// 		iconH: 48,
// 		isOnlyIcon: true,
// 	},
// 	{
// 		id: 2,
// 		name: "Chuyển khoản ngân hàng",
// 		description: "Thanh toán bằng hình thức chuyển khoản ngân hàng",
// 		isActive: true,
// 		value: EnumPaymentMethod.BANK_TRANSFER,
// 		icon: BANK_TRANSFER_ICON,
// 		isOnlyIcon: true,
// 		iconW: 70,
// 		iconH: 48,
// 		info: {
// 			label: "Vietinbank",
// 			logo: VIETINBANK_LOGO,
// 			accountNumber: "1090-0066-3716",
// 			accountHolder: "Trần Hồng Hải",
// 			qrCodeImage: VIETINBANK_QR,
// 			scale: 1.8,
// 		},
// 	},
// 	{
// 		id: 3,
// 		name: "Ví MoMo",
// 		description: "Thanh toán nhanh chóng qua ứng dụng MoMo",
// 		isActive: true,
// 		value: EnumPaymentMethod.MOMO,
// 		icon: MOMO_LOGO,
// 		isOnlyIcon: true,
// 		iconW: 48,
// 		iconH: 48,
// 		info: {
// 			label: "MoMo",
// 			logo: MOMO_LOGO,
// 			accountNumber: "083-922-0900",
// 			accountHolder: "Trần Hồng Hải",
// 			qrCodeImage: MOMO_QR,
// 			scale: 1,
// 		},
// 	},
// 	{
// 		id: 4,
// 		name: "PayPal",
// 		description: "Thanh toán an toàn qua tài khoản PayPal",
// 		isActive: false,
// 		info: {
// 			label: "PayPal",
// 			logo: PAYPAL_1_ICON,
// 			accountNumber: "paypal-account-number",
// 			accountHolder: "CONG TY TNHH NOOBSTORE",
// 		},
// 		value: EnumPaymentMethod.PAYPAL,
// 		icon: PAYPAL_1_ICON,
// 		isOnlyIcon: true,
// 		iconW: 90,
// 		iconH: 48,
// 		scale: 2.2,
// 	},
// ];

interface RafflePaymentBlockProps {
	raffle: TResponseRaffleEntry;
	winningProduct?: IBEResponseRaffleProductSelection | null;
	onPaymentSuccess?: () => void;
}

const RafflePaymentBlock = ({
	raffle,
	winningProduct,
	onPaymentSuccess,
}: RafflePaymentBlockProps): JSX.Element => {
	console.log("raffle", raffle);
	const [paymentMethod, setPaymentMethod] =
		useState<IBEResponseRafflePaymentMethod | null>(null);
	const [donationAmount, setDonationAmount] = useState(0);
	const [isPending, setIsPending] = useState(false);

	const getTotalAmount = (): number => {
		return winningProduct?.price || 0;
	};

	const total = getTotalAmount();
	const fullPayWithDonation = Math.round(total + donationAmount);

	const isDisabledChange =
		raffle?.paymentStatus !== EnumRafflePaymentStatus.PENDING;

	// Only one payment option: 100% full payment
	const paymentFormOptions = [
		{
			id: 1,
			name: "100%",
			description: "Thanh toán toàn bộ giá trị sản phẩm để nhận hàng",
			isActive: true,
			discount: 0,
			percentage: 1,
			paid: total,
			remaining: 0,
			icon: HUNDRED_PERCENT_ICON,
			value: EnumPaymentForm.FULL,
		},
	];

	// Auto-select the only option
	const selectedPaymentFormOption = useMemo(() => {
		return paymentFormOptions[0];
	}, []);

	const handlePay = async () => {
		if (!paymentMethod) return;

		setIsPending(true);

		try {
			// TODO: Implement raffle payment submission
			// This will handle the payment request to the backend
			console.log("Processing payment for raffle:", {
				raffleId: raffle.raffleId,
				amount: fullPayWithDonation,
				paymentMethod: paymentMethod.platform,
				paymentForm: EnumPaymentForm.FULL,
				donation: donationAmount,
			});

			setIsPending(false);
			onPaymentSuccess?.();
		} catch (error) {
			console.error("Payment error:", error);
			setIsPending(false);
		}
	};

	return (
		<div className="flex flex-col h-full">
			<div className="flex items-center gap-2 bg-gray-200 rounded-tl-xl rounded-tr-xl p-2 text-gray-800 font-bold flex-shrink-0">
				<Image
					src={I3D_RAFFLE_PAYMENT}
					alt="Payment"
					className="object-contain scale-125"
					width={32}
					height={32}
				/>
				<div className="font-bold text-lg">Thanh toán Raffle</div>
			</div>

			{/* Payment Status */}
			<div className="p-4 border-2 border-t-0 border-gray-200 rounded-b-xl overflow-y-auto pr-3 flex-1 min-h-0 space-y-4 ">
				<div className="space-y-2">
					<div className="max-w-max font-semibold border-b-2 border-gray-300">
						Phương thức thanh toán
					</div>
					<div className="space-y-2">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							{raffle?.raffleInfo?.paymentMethods?.map(
								(option) => (
									<div
										key={option.platform}
										className="relative">
										<label
											className={`w-full h-full
								flex p-2 border-2 border-gray-400 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg relative
								${
									paymentMethod?.platform === option.platform
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
												id={option.platform}
												type="radio"
												value={option.platform}
												disabled={
													!option.isActive ||
													isDisabledChange
												}
												checked={
													paymentMethod?.platform ===
													option.platform
												}
												onChange={() => {
													if (isDisabledChange)
														return;
													setPaymentMethod(option);
												}}
												className="mr-4 w-5 h-5 sr-only"
											/>
											<div className="flex-1">
												<div className="flex items-center gap-2">
													<Image
														src={
															mappingLabelPaymentMethod[
																option.platform as keyof typeof mappingLabelPaymentMethod
															].icon || ""
														}
														alt={
															mappingLabelPaymentMethod[
																option.platform as keyof typeof mappingLabelPaymentMethod
															].label || ""
														}
														objectFit="contain"
														draggable={false}
														width={40}
														height={40}
													/>
													<span className="font-bold text-sm">
														{option.name}
													</span>
												</div>
											</div>
											{paymentMethod?.platform ===
												option.platform && (
												<div className="absolute -top-1 -right-1 -translate-y-1 translate-x-1">
													<span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-600 text-white shadow">
														<Check
															size={14}
															className="stroke-white"
															style={{
																strokeWidth: 4,
															}}
														/>
													</span>
												</div>
											)}
										</label>
									</div>
								)
							)}
						</div>
						{paymentMethod ? (
							<div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg border-2 border-blue-200 p-2 space-y-2">
								<div className="flex items-center gap-2">
									<Image
										src={I3D_NOTE}
										width={40}
										height={40}
										alt="note"
									/>
									<div>
										<h3 className="font-bold text-blue-800 text-sm">
											Hướng dẫn thực hiện giao dịch
										</h3>
										<p className="text-blue-600 text-xs">
											Vui lòng chuyển khoản theo thông tin
											bên dưới
										</p>
									</div>
								</div>

								<div className="bg-white rounded-lg p-2 shadow-inner border space-y-4">
									<div className="flex gap-4">
										<div
											className={`w-1/2 flex flex-col gap-2 h-auto ${
												paymentMethod?.platform ===
												EnumPaymentMethod.BANK_TRANSFER
													? "justify-between"
													: ""
											}`}>
											{paymentMethod?.platform ===
											EnumPaymentMethod.BANK_TRANSFER ? (
												<div className="w-full border-b border-gray-300">
													<label className="block font-semibold text-gray-700 mb-1 text-sm">
														🏦 Ngân hàng
													</label>
													<div className="relative w-full h-24">
														<Image
															src={
																mappingBankInfo[
																	paymentMethod?.bankCode as keyof typeof mappingBankInfo
																]?.logo || ""
															}
															alt="Bank Logo"
															objectFit="contain"
															fill
														/>
													</div>
												</div>
											) : null}
											<div className="w-full">
												<label className="block font-semibold text-gray-800 mb-1 text-sm">
													💳 Số tài khoản
												</label>
												<p className="font-mono bg-gray-200 p-2 rounded font-bold text-blue-600">
													{paymentMethod?.accountNumber ||
														""}
												</p>
											</div>
											<div className="w-full">
												<label className="block font-semibold text-gray-700 mb-1 text-sm">
													👤 Chủ tài khoản
												</label>
												<p className="text-base bg-gray-200 p-2 rounded">
													{paymentMethod?.accountName ||
														""}
												</p>
											</div>
											<div className="w-full">
												<label className="block font-semibold text-gray-700 mb-1 text-sm">
													📝 Nội dung chuyển khoản
												</label>
												<p className="text-lg font-mono bg-gray-200 p-2 rounded font-bold text-green-600">
													{raffle?.raffleId}
												</p>
											</div>
										</div>

										<div className="flex flex-col w-1/2">
											<label className="block font-semibold text-gray-700 mb-1 text-sm">
												🏦 QR thanh toán
											</label>
											<div
												className={`w-full h-full relative overflow-hidden`}>
												<Image
													src={
														paymentMethod?.qrCode
															.path || ""
													}
													alt="QR Code"
													objectFit="contain"
													fill
													draggable={false}
												/>
											</div>
										</div>
									</div>

									<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
										<div className="flex items-start gap-3">
											<span className="text-yellow-600">
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
														• Vui lòng chuyển khoản
														đúng số tiền và ghi đúng
														nội dung
													</li>
													<li className="text-sm">
														• Thanh toán sẽ được xác
														nhận tự động trong vòng
														1-3 phút
													</li>
													<li className="text-sm">
														• Liên hệ shop nếu có
														vấn đề cần hỗ trợ
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

				<RafflePaymnetDonation raffle={raffle} />

				<div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border-2 border-green-200">
					<div className="text-2xl font-semibold mb-4 text-center">
						Tóm tắt thanh toán
					</div>
					<div
						className={`flex items-center gap-6 justify-around mx-auto`}>
						{donationAmount > 0 ? (
							<div className="text-center">
								<div className=" text-gray-600 mb-1">
									Ủng hộ Maker
								</div>
								<div className="text-lg font-bold text-orange-400">
									{formatCurrency(donationAmount)}
								</div>
							</div>
						) : null}
						<div className="text-center">
							<div className=" text-gray-600 mb-1">
								Giá sản phẩm
							</div>
							<div className="text-lg font-bold text-gray-900">
								{formatCurrency(total)}
							</div>
						</div>
						<div className="text-center">
							<div className=" text-gray-600 mb-1">
								Cần thanh toán
							</div>
							<div className="text-lg font-bold text-green-700">
								{formatCurrency(fullPayWithDonation)}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Payment Button */}
			<button
				type="button"
				onClick={handlePay}
				disabled={
					isPending ||
					raffle.paymentStatus === EnumRafflePaymentStatus.PAID ||
					!paymentMethod
				}
				className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none disabled:cursor-not-allowed shadow-xl flex-shrink-0">
				{isPending ? (
					<div className="flex items-center justify-center">
						<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
						Đang xử lý thanh toán...
					</div>
				) : raffle.paymentStatus === EnumRafflePaymentStatus.PAID ? (
					<div className="flex items-center justify-center">
						<span className="mr-3 text-xl">✅</span>
						Đã thanh toán
					</div>
				) : (
					<div className="flex items-center justify-center text-white text-xl">
						<span className="mr-3 text-lg">💳</span>
						{!paymentMethod ? "Chọn phương thức thanh toán" : ""}
						{paymentMethod ? (
							<>
								Thanh toán {formatCurrency(fullPayWithDonation)}
							</>
						) : null}
					</div>
				)}
			</button>
		</div>
	);
};

export default RafflePaymentBlock;
