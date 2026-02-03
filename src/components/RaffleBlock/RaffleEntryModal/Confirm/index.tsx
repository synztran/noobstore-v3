import { IBEResponseRaffleInfo } from "@/interface/Client/Raffle";
import useRaffle from "@/zustand/useRaffle";
import { Divider } from "@mui/material";
import Image from "next/image";
import React from "react";

const StepConfirmation: React.FC<{ raffleData: IBEResponseRaffleInfo }> = ({
	raffleData,
}) => {
	const { raffleSubmitForm } = useRaffle();

	const selectedProducts =
		raffleSubmitForm?.productSelections?.filter((p) => p.selected) || [];

	// Generate a random registration code for more realism
	const registrationCode = React.useMemo(
		() => "#RF" + Math.floor(100000 + Math.random() * 900000).toString(),
		[],
	);

	return (
		<div className="flex flex-col items-center space-y-2">
			{/* Success Icon */}
			{/* <div className="relative flex flex-col items-center">
				<div className="w-24 h-24 bg-gradient-to-tr from-green-300 via-green-200 to-green-100 rounded-full flex items-center justify-center shadow-lg animate-bounce-slow">
					<CheckCircle
						className="text-green-700 drop-shadow-lg"
						size={56}
					/>
				</div>
			</div> */}
			{/* Title */}
			<div className="text-2xl font-extrabold text-green-700 drop-shadow-sm tracking-wide">
				Đăng ký thành công! 🎉
			</div>
			{/* Congratulation Box */}
			{/* <div className="rounded-xl border-l-8 border-green-400 bg-gradient-to-r from-green-50 to-green-100 p-4 text-left shadow-md w-full max-w-lg">
				<div className="text-green-800 font-semibold text-lg flex items-center gap-2">
					<span className="text-2xl">🥳</span>
					Chúc mừng! Bạn đã đăng ký tham gia raffle thành công.
				</div>
			</div> */}
			{/* Registration Details */}
			<div className="p-6 rounded-2xl bg-white text-left shadow-lg w-full max-w-lg border border-gray-200">
				{/* <div className="font-bold mb-4 text-lg text-blue-700 flex items-center gap-2">
					<CheckCircle className="text-blue-400" size={20} />
					Chi tiết đăng ký
				</div> */}
				<div className="space-y-2">
					<div className="flex justify-between text-base">
						<span className="text-gray-600 text-lg font-semibold">
							Mã đăng ký:
						</span>
						<span className="font-bold text-blue-600 tracking-wider text-base">
							{registrationCode}
						</span>
					</div>
					<div className="flex justify-between text-base">
						<span className="text-gray-600 text-lg font-semibold">
							Số sản phẩm đã chọn:
						</span>
						<span className="font-semibold text-base">
							{selectedProducts.length} sản phẩm
						</span>
					</div>
					<hr />
					<div className="flex flex-wrap gap-4">
						{selectedProducts
							.sort(
								(a, b) => (a.priority || 0) - (b.priority || 0),
							)
							.map((product) => (
								<div
									key={product.productId}
									className="flex flex-col items-center gap-2 bg-white border border-blue-200 rounded-lg p-2 shadow-sm max-w-36">
									<div className="w-32 h-32 rounded-lg overflow-hidden border border-gray-200 shrink-0 bg-white shadow relative">
										{product.thumbnail ? (
											<Image
												src={
													product.thumbnail.path || ""
												}
												alt={product.name}
												className="hover:scale-110 transition-all duration-300 ease-in-out"
												fill
												objectFit="cover"
											/>
										) : (
											<div className="flex items-center justify-center w-full h-full text-gray-300 text-2xl bg-gray-100">
												📦
											</div>
										)}
									</div>
									<div className="text-sm font-semibold text-blue-900 line-clamp-2">
										{product.name}
									</div>
								</div>
							))}
					</div>
				</div>
			</div>
			{/* Next Steps */}
			<div className="p-4 rounded-xl bg-white w-full max-w-lg border border-gray-200 shadow-lg">
				<div className="text-base text-blue-800">
					<div className="font-semibold mb-2 flex items-center gap-2 text-xl">
						Bước tiếp theo
					</div>
					<ul className="space-y-1 text-left pl-6 list-disc">
						<li className="text-base">
							Chúng tôi sẽ thông báo kết quả khi raffle kết thúc.
						</li>
						<li className="text-base">
							Nếu trúng thưởng, bạn sẽ nhận được mail thông báo
							xác nhận và thanh toán.
						</li>
					</ul>
				</div>
			</div>
			<div className="text-gray-500 font-medium flex items-center gap-2">
				<span className="text-2xl">Chúc bạn may mắn!</span>
				<span className="text-2xl animate-bounce">🍀</span>
			</div>
		</div>
	);
};

export default StepConfirmation;
