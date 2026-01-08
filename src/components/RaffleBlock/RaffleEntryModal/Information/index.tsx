import { NEW_MISSING_IMAGE } from "@/constants/Images";
import { IStepProps } from "@/interface/Raffle";
import { Check, Verified } from "lucide-react";
import Image from "next/image";
import { memo } from "react";

const StepInformation: React.FC<IStepProps> = memo(
	({ raffleData, minPrice, maxPrice }) => {
		return (
			<div className="space-y-6">
				<div className="text-center mb-6">
					<div className="text-2xl font-bold">Thông tin Raffle</div>
					<div className="text-gray-600">
						Đọc kỹ thông tin và chính sách trước khi tham gia
					</div>
				</div>

				{/* Seller Information */}
				<div className="p-4 rounded-lg bg-gray-200">
					<div className="mb-3 font-semibold text-lg flex items-center gap-2">
						👤 Thông tin maker
					</div>
					<div className="flex items-center gap-3 mb-3">
						<div className="relative w-20 h-20">
							<Image
								src={
									raffleData?.makerInfo?.logo?.path ||
									NEW_MISSING_IMAGE
								}
								alt={raffleData?.makerInfo?.brandName || ""}
								className="w-60 h-60 rounded-full"
								fill
								objectFit="cover"
							/>
						</div>
						<div className="flex flex-col">
							<div className="font-medium text-xl flex items-center gap-2">
								{raffleData?.makerInfo?.brandName || ""}
								<Verified className="stroke-green-600 w-6 h-6" />
							</div>
							<div className="flex items-center gap-3 text-sm text-gray-600">
								<span>
									⭐{" "}
									{raffleData?.makerInfo?.rating
										?.averageRating || 0}
									/5
								</span>
								<span>
									📦 {raffleData?.makerInfo?.raffleTimes || 0}{" "}
									raffle
								</span>
							</div>
						</div>
					</div>
					<div className="text-base text-gray-700">
						Người bán đã được xác minh và có uy tín tốt trên nền
						tảng
					</div>
				</div>

				{/* Store Policies */}
				<div className="p-4 rounded-lg bg-gray-200">
					<div className="mb-3 font-semibold text-lg flex items-center gap-2">
						🏪 Chính sách của NoobStore
					</div>
					<div className="space-y-2 text-sm text-gray-700">
						<div className="flex items-center gap-2">
							<span className="text-yellow-600">•</span>
							<span>
								Raffle được tổ chức minh bạch, công khai kết quả
							</span>
						</div>
						<div className="flex items-center gap-2">
							<span className="text-yellow-600">•</span>
							<span>
								Mỗi khách hàng chỉ được tham gia 1 lần vào mỗi
								đợt raffle
							</span>
						</div>
						<div className="flex items-center gap-2">
							<span className="text-yellow-600">•</span>
							<span>
								Kết quả được công bố trong vòng x giờ sau khi
								raffle kết thúc
							</span>
						</div>
						<div className="flex items-center gap-2">
							<span className="text-yellow-600">•</span>
							<span>
								Khách hàng nhận được mail thông báo có 24 giờ để
								thanh toán, quá hạn sẽ sẽ được re-roll chuyển
								cho người tiếp theo
							</span>
						</div>
						<div className="flex items-center gap-2">
							<span className="text-yellow-600">•</span>
							<span>
								NoobStore và maker sẽ đảm bảo quyền lời cho
								người tham gia, đảm bảo một cộng đồng raffle
								công bằng
							</span>
						</div>
					</div>
				</div>

				{/* Maker Policies */}
				<div className="p-4 rounded-lg bg-gray-200">
					<div className="mb-3 font-semibold text-lg flex items-center gap-2">
						🔧 Chính sách của{" "}
						{raffleData?.makerInfo?.brandName || ""}
					</div>
					<div className="space-y-2 text-sm text-gray-700">
						<div className="flex items-center gap-2">
							<span className="text-indigo-600">•</span>
							<span>
								Sản phẩm được thiết kế và sản xuất thủ công
								không, màu sắc có thể sẽ không giống 100% với
								ảnh chụp
							</span>
						</div>
						<div className="flex items-center gap-2">
							<span className="text-indigo-600">•</span>
							<span>
								Sản phẩm đã bao gồm chi phí vận chuyển nội địa,
								với khách hàng không nằm trong khu vực nội địa
								sẽ được tính thêm chi phí vận chuyển
							</span>
						</div>
						<div className="flex items-center gap-2">
							<span className="text-indigo-600">•</span>
							<span>
								Hỗ trợ kỹ thuật 24/7 qua hotline và email chính
								thức
							</span>
						</div>
						<div className="flex items-center gap-2">
							<span className="text-indigo-600">•</span>
							<span>
								Sản phẩm được kiểm tra chất lượng trước khi giao
								hàng
							</span>
						</div>
					</div>
				</div>

				{/* Important Agreement Notice */}
				<div className="p-4 rounded-lg bg-gray-200">
					<div className="mb-3 font-bold text-base flex items-center gap-2">
						⚠️ LƯU Ý QUAN TRỌNG
					</div>
					<div className="bg-red-100 p-3 rounded-lg border border-red-200">
						<div className="text-base text-red-800 font-medium mb-2">
							Bằng việc tiếp tục bước tiếp theo, bạn đồng ý với:
						</div>
						<ul className="text-xs text-red-700 space-y-1">
							<li className="flex items-center gap-2">
								<Check className="stroke-green-600" /> Tất cả
								các chính sách của cửa hàng được nêu ở trên
							</li>
							<li className="flex items-center gap-2">
								<Check className="stroke-green-600" /> Các điều
								khoản và chính sách của nhà sản xuất
							</li>
							<li className="flex items-center gap-2">
								<Check className="stroke-green-600" /> Quy trình
								thanh toán và giao hàng khi thắng giải
							</li>
							<li className="flex items-center gap-2">
								<Check className="stroke-green-600" /> Cam kết
								thanh toán đúng hạn nếu nhận được mail thông báo
							</li>
							<li className="flex items-center gap-2">
								<Check className="stroke-green-600" /> Không
								được hủy bỏ sau khi đã xác nhận tham gia
							</li>
						</ul>
					</div>
				</div>

				{/* Contact Support */}
				{/* <div className="rounded border-l-4 border-blue-400 bg-blue-50 p-3">
				<div className="text-sm text-blue-800 flex items-start gap-2">
					<span role="img" aria-label="support" className="mt-0.5">
						💬
					</span>
					<div>
						<div className="font-medium mb-1">Cần hỗ trợ?</div>
						<div className="flex flex-col gap-2 text-base">
							<div>
								Liên hệ:{" "}
								<span className="font-medium border border-blue-600 rounded-sm px-2">
									noobassembly@gmail.com
								</span>
							</div>
							<div>
								Facebook:{" "}
								<span className="font-medium border border-blue-600 rounded-sm px-2">
									https://www.fb.com/noobassembly
								</span>
							</div>
						</div>
					</div>
				</div>
			</div> */}
			</div>
		);
	}
);

export default StepInformation;
