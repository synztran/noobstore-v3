import RaffleV2Countdown from "@/components/RaffleBlockV2/Countdown";
import { Button } from "@/components/ReUIComponent/Button";
import { NEW_MISSING_IMAGE } from "@/constants/Images";
import { IBEResponseRaffleInfo } from "@/interface/Client/Raffle";
import { formatCurrency } from "@/utils/FormatNumber";
import Image from "next/image";
import { useMemo, useState } from "react";

interface RafflePricingSidebarProps {
	raffle: IBEResponseRaffleInfo;
	selectedProductId: string;
	setSelectedProductId: (productId: string) => void;
	onEnterRaffle?: (productId: string) => void;
}

export const RafflePricingSidebar = ({
	raffle,
	selectedProductId,
	setSelectedProductId,
	onEnterRaffle,
}: RafflePricingSidebarProps) => {
	const [isEntering, setIsEntering] = useState(false);

	// Get selected product info
	const selectedProduct = useMemo(() => {
		return raffle.productOptions?.find(
			(p: any) => p.productId === selectedProductId,
		);
	}, [raffle.productOptions, selectedProductId]);

	// Show price only when variant is selected
	const displayPrice = selectedProduct?.price || 0;
	const hasVariants =
		raffle.productOptions && raffle.productOptions.length > 1;

	const handleEnterRaffle = async () => {
		setIsEntering(true);
		try {
			if (onEnterRaffle) {
				onEnterRaffle(selectedProductId);
			}
		} finally {
			setIsEntering(false);
		}
	};

	return (
		<>
			{/* Sticky Pricing Card */}
			<div className="bg-slate-50 border border-slate-200 shadow-xl shadow-slate-200/60 rounded-2xl p-8 overflow-hidden sticky top-24">
				{/* Glow Effects */}
				<div className="absolute -top-32 -right-32 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
				<div className="absolute -bottom-32 -left-32 w-64 h-64 bg-orange-100 rounded-full blur-3xl pointer-events-none"></div>

				{/* Content */}
				<div className="relative z-10 space-y-6">
					{/* Header with Price - Show only when variant selected */}
					{selectedProduct && (
						<div className="border-b border-slate-200 pb-6">
							<p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">
								Giá Tham Gia
							</p>
							<h2 className="text-4xl font-black text-slate-900">
								{formatCurrency(displayPrice)}
							</h2>
						</div>
					)}

					{/* Variant Status Badge */}
					<div className="bg-amber-100 text-amber-700 border-amber-200 px-3 py-1.5 rounded-lg border flex flex-col items-center justify-center">
						<span className="text-xs font-bold uppercase tracking-wider mb-1 text-amber-700">
							Trạng Thái
						</span>
						<div className="flex items-center gap-1.5">
							<span className="animate-pulse w-2 h-2 bg-amber-500 rounded-full"></span>
							<span className="text-xs font-black uppercase">
								{raffle.status === "ONGOING"
									? "Đang Diễn Ra"
									: raffle.status === "UPCOMING"
										? "Sắp Diễn Ra"
										: "Đã Kết Thúc"}
							</span>
						</div>
					</div>

					{/* Product Variants */}
					{hasVariants && (
						<div className="space-y-3">
							<p className="text-xs uppercase tracking-wider mb-3 text-slate-500">
								Chọn Phiên Bản
							</p>
							<div className="space-y-2">
								{raffle.productOptions.map((product: any) => (
									<button
										key={product.productId}
										onClick={() =>
											setSelectedProductId(
												product.productId,
											)
										}
										className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer group ${
											selectedProductId ===
											product.productId
												? "border-amber-400/60 bg-amber-50 text-amber-700"
												: "border-slate-200 text-slate-700 hover:border-amber-300 hover:bg-slate-100"
										}`}>
										<div className="flex items-center gap-3 flex-1">
											{/* Thumbnail instead of letter */}
											<div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-slate-200 shadow-sm">
												<Image
													src={
														product.thumbnail
															?.path ||
														product.image?.path ||
														NEW_MISSING_IMAGE
													}
													alt={product.label}
													width={48}
													height={48}
													className="w-full h-full object-cover"
												/>
											</div>
											<div className="text-left">
												<p className="text-sm font-semibold">
													{product.label}
												</p>
												<p className="text-xs text-slate-500">
													+
													{formatCurrency(
														product.price,
													)}
												</p>
											</div>
										</div>
										{selectedProductId ===
											product.productId && (
											<span className="text-lg text-amber-500 ml-2">
												✓
											</span>
										)}
									</button>
								))}
							</div>
						</div>
					)}

					{/* Countdown Timer */}
					<div className="pt-2">
						<RaffleV2Countdown
							startDate={raffle.startAt}
							endDate={raffle.endAt}
							raffleStatus={raffle.status}
							className="w-full"
						/>
					</div>

					{/* Action Button */}
					<Button
						onClick={handleEnterRaffle}
						disabled={
							raffle.status !== "ONGOING" ||
							!selectedProduct ||
							isEntering
						}
						variant="primary"
						size="lg"
						className="w-full uppercase tracking-wider">
						{isEntering ? "Đang xử lý..." : "🎫 Tham Gia Raffle"}
					</Button>

					{/* Info Footer */}
					<div className="text-xs text-center space-y-1 pt-4 border-t border-slate-200 text-slate-500">
						<p>
							* Hóa đơn tham gia sẽ được gửi qua email đến địa chỉ
							đã đăng ký của bạn
						</p>
						<p>✓ Thanh toán an toàn với mã hóa</p>
					</div>
				</div>
			</div>

			{/* Estimate Delivery Section - Fixed below sticky card */}
			<div className="mt-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
				<div className="flex items-start gap-4">
					<div className="text-3xl">📦</div>
					<div className="flex-1">
						<h3 className="font-semibold text-slate-900 mb-2">
							Dự Kiến Giao Hàng
						</h3>
						<p className="text-sm text-slate-600 mb-3">
							Sau khi raffle kết thúc, người chiến thắng sẽ nhận
							được sản phẩm trong vòng 7-14 ngày làm việc.
						</p>
						<div className="text-xs text-slate-500 space-y-1">
							<p>✓ Giao hàng toàn quốc</p>
							<p>✓ Bảo hiểm vận chuyển</p>
							<p>✓ Đóng gói kỹ lưỡng</p>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
