import { mappingBankInfo, mappingLabelPaymentMethod } from "@/constants";
import { HUNDRED_PERCENT_ICON } from "@/constants/Images";
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
import { useRaffleSubmitPaymentMutation } from "@/react-query/raffles/api/useRaffleSubmitPaymentMutation";
import NotifyUtils from "@/utils/NotifyUtils";
import useRaffle, { useRaffleAction } from "@/zustand/useRaffle";
import { Check } from "lucide-react";
import Image from "next/image";
import { memo, useCallback, useEffect, useMemo } from "react";
import { ButtonCancelOrder, ButtonSubmitPayment } from "./ButtonPaymentForm";
import RafflePaymnetDonation from "./RaffleDonation";

interface RafflePaymentBlockProps {
	raffle: TResponseRaffleEntry;
	winningProducts?: IBEResponseRaffleProductSelection[] | null;
	onPaymentSuccess?: () => void;
}

const RafflePaymentBlock = ({
	raffle,
	winningProducts,
	onPaymentSuccess,
}: RafflePaymentBlockProps) => {
	const { raffleInfo } = raffle || {};
	const {
		rafflePaymentForm,
		raffleDonationForm,
		raffleSubTotalPrice,
		raffleTotalPrice,
	} = useRaffle();
	const { updateRafflePaymentForm } = useRaffleAction();
	const rafflePaymentMutation = useRaffleSubmitPaymentMutation();
	const { mutate, isPending: isLoading } = rafflePaymentMutation;

	const isDisabledChange =
		raffle?.paymentStatus !== EnumRafflePaymentStatus.PENDING;

	const makerPaymentInfo = useMemo(() => {
		if (!rafflePaymentForm?.paymentMethod) return null;

		return (
			raffleInfo?.paymentMethods.find(
				(method) => method.platform === rafflePaymentForm.paymentMethod,
			) || null
		);
	}, [rafflePaymentForm, raffleInfo.paymentMethods]);

	// Only one payment option: 100% full payment
	const paymentFormOptions = [
		{
			id: 1,
			name: "100%",
			description: "Thanh toán toàn bộ giá trị sản phẩm để nhận hàng",
			isActive: true,
			discount: 0,
			percentage: 100,
			paid: raffleTotalPrice,
			remaining: 0,
			icon: HUNDRED_PERCENT_ICON,
			value: EnumPaymentForm.FULL,
		},
	];

	// Auto-select the only option
	// const selectedPaymentFormOption = useMemo(() => {
	// 	return paymentFormOptions[0];
	// }, []);

	useEffect(() => {
		if (!raffleInfo?.paymentMethods?.length) {
			NotifyUtils.error(
				"Không có phương thức thanh toán khả dụng. Vui lòng liên hệ với Noobstore hoặc maker",
			);
			return;
		}
		updateRafflePaymentForm({
			paymentMethod:
				raffleInfo?.paymentMethods?.length > 1
					? null
					: raffleInfo?.paymentMethods[0]?.platform || null,
		});
	}, [raffle, raffleInfo.paymentMethods]);

	const handleSubmitPayment = useCallback(async () => {
		if (!rafflePaymentForm?.paymentMethod) {
			NotifyUtils.error("Vui lòng chọn phương thức thanh toán");
			return;
		}

		try {
			// TODO: Implement raffle payment submission
			// This will handle the payment request to the backend
			console.log("Processing payment for raffle:", {
				raffleId: raffle.raffleId,
				amount: raffleTotalPrice,
				paymentMethod: rafflePaymentForm.paymentMethod,
				paymentForm: EnumPaymentForm.FULL,
				donation: raffleDonationForm?.amount || 0,
			});

			mutate({
				payload: {
					totalPrice: raffleTotalPrice,
					tax: rafflePaymentForm.tax,
					raffleId: raffle.raffleId,
					entryId: raffle?.entryId,
					subPrice: raffleSubTotalPrice,
					shippingFee: raffle.shipping?.shippingMethod?.price || 0,
					paymentMethod: rafflePaymentForm.paymentMethod,
					donation: {
						donation_amount:
							parseFloat(raffleDonationForm?.amount || "0") || 0,
						message: raffleDonationForm?.message || "",
					},
				},
			});
		} catch (error) {
			console.error("Payment error:", error);
		}
	}, [
		rafflePaymentForm?.paymentMethod,
		raffle.raffleId,
		raffleTotalPrice,
		raffleDonationForm?.amount,
		onPaymentSuccess,
	]);

	const handleCancelOrder = useCallback(() => {
		// TODO: Implement raffle cancellation
		console.log("Canceling raffle order:", raffle.raffleId);
	}, [raffle.raffleId]);

	console.log("makerPaymentInfo", makerPaymentInfo);

	return (
		<div className="flex flex-col h-full p-4 border border-gray-200 rounded-lg space-y-4">
			<div className="text-gray-500 font-bold text-lg">Thanh toán</div>

			{/* Payment Status */}
			<div className="overflow-y-auto flex-1 min-h-0 space-y-4">
				<div className="space-y-2">
					<div className="max-w-max font-semibold border-b-2 border-gray-300">
						Phương thức thanh toán
					</div>
					<div className="space-y-2">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{raffle?.raffleInfo?.paymentMethods?.map(
								(option) => (
									<Option
										option={option}
										selectedPaymentMethod={makerPaymentInfo}
										isDisabledChange={isDisabledChange}
									/>
								),
							)}
						</div>
						{rafflePaymentForm?.paymentMethod ? (
							<div className="rounded-xl shadow-lg border-2 border-blue-200 p-2 space-y-2">
								<div className="bg-white rounded-lg p-2 space-y-4">
									<div className="flex gap-4">
										<div
											className={`w-1/2 flex flex-col gap-2 h-auto ${
												rafflePaymentForm?.paymentMethod ===
												EnumPaymentMethod.BANK_TRANSFER
													? "justify-between"
													: ""
											}`}>
											{rafflePaymentForm?.paymentMethod ===
											EnumPaymentMethod.BANK_TRANSFER ? (
												<div className="w-full border-b border-gray-300">
													<label className="block font-semibold text-gray-700 mb-1 text-sm">
														🏦 Ngân hàng
													</label>
													<div className="relative w-full h-24">
														<Image
															src={
																mappingBankInfo[
																	makerPaymentInfo?.bankCode as keyof typeof mappingBankInfo
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
													{makerPaymentInfo?.accountNumber ||
														""}
												</p>
											</div>
											<div className="w-full">
												<label className="block font-semibold text-gray-700 mb-1 text-sm">
													👤 Chủ tài khoản
												</label>
												<p className="text-base bg-gray-200 p-2 rounded">
													{makerPaymentInfo?.accountName ||
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
														makerPaymentInfo?.qrCode
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

				{/* <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border-2 border-green-200">
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
				</div> */}
			</div>

			<div className="w-full border-t border-gray-300" />

			<div className="flex items-center justify-end gap-4">
				<ButtonCancelOrder
					isDisabled={false}
					handleClick={handleCancelOrder}
					isLoading={false}
				/>
				<ButtonSubmitPayment
					isDisabled={
						isLoading ||
						raffle.paymentStatus === EnumRafflePaymentStatus.PAID ||
						!makerPaymentInfo
					}
					handleClick={handleSubmitPayment}
					isLoading={isLoading}
				/>
			</div>
		</div>
	);
};

export default RafflePaymentBlock;

const Option = memo(
	({
		option,
		selectedPaymentMethod,
		isDisabledChange,
	}: {
		option: IBEResponseRafflePaymentMethod;
		selectedPaymentMethod: IBEResponseRafflePaymentMethod | null;
		isDisabledChange: boolean;
	}) => {
		const { updateRafflePaymentForm } = useRaffleAction();
		return (
			<div key={option.platform} className="relative">
				<label
					className={`w-full h-full
								flex p-2 border-2 border-gray-400 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg relative
								${
									selectedPaymentMethod?.platform ===
									option.platform
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
						disabled={!option.isActive || isDisabledChange}
						checked={
							selectedPaymentMethod?.platform === option.platform
						} // force  checked is bank transfer
						defaultChecked={option.platform === "BANK_TRANSFER"}
						onChange={() => {
							if (isDisabledChange) return;
							// setPaymentMethod(option);
							updateRafflePaymentForm({
								paymentMethod: option.platform,
							});
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
					{selectedPaymentMethod?.platform === option.platform && (
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
		);
	},
);
