import { mappingBankInfo, mappingLabelPaymentMethod } from "@/constants";
import { I3D_NOTE } from "@/constants/Images";
import { IBEResponseRaffleProductSelection } from "@/interface/Client/Raffle";
import {
	IBEResponseRafflePaymentMethod,
	TResponseRaffleEntry,
} from "@/interface/Context/auth";
import {
	EnumPaymentMethod,
	EnumRafflePaymentStatus,
} from "@/interface/interface";
import { Check } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface IProps {
	raffle: TResponseRaffleEntry;
	winningProducts?: IBEResponseRaffleProductSelection[] | null;
	onPaymentSuccess?: () => void;
}

const PaidRafflePayment = ({
	raffle,
	winningProducts = null,
	onPaymentSuccess,
}: IProps) => {
	const [paymentMethod, setPaymentMethod] =
		useState<IBEResponseRafflePaymentMethod | null>(null);

	const getTotalPrice = () =>
		winningProducts?.reduce((acc, product) => acc + product.price, 0) || 0;

	const totalPrice = getTotalPrice();
	const isDisabledChange =
		raffle?.paymentStatus !== EnumRafflePaymentStatus.PENDING;

	return (
		<div className="flex flex-col h-full border border-gray-200 rounded-lg p-4">
			<div className="text-gray-800 font-bold">
				<div className="font-bold text-gray-500 text-lg">
					Thanh toán
				</div>
			</div>

			{/* Payment Status */}
			<div className="overflow-y-auto min-h-0">
				<div className="space-y-2">
					<div className="max-w-max font-semibold border-b-2 border-gray-300">
						Phương thức thanh toán
					</div>
					<div className="space-y-2">
						<div className="grid grid-cols-2 gap-4">
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
												defaultChecked={
													paymentMethod?.platform ===
													"BANK_TRANSFER"
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
			</div>
		</div>
	);
};

export default PaidRafflePayment;
