import {
	I3D_E_INVOICE,
	I3D_INFORMATION,
	I3D_NUMBER_ONE,
	I3D_NUMBER_RAFFLE_WHEEL,
	I3D_NUMBER_THREE,
	I3D_NUMBER_TWO,
	I3D_STAR_POINT,
	I3D_WINNER_CUP,
	VIETINBANK_QR,
} from "@/constants/Images";
import { IBEResponseRaffleProductSelection } from "@/interface/Client/Raffle";
import { TResponseRaffleEntry } from "@/interface/Context/auth";
import { formatCurrency } from "@/utils/FormatNumber";
import useRaffle from "@/zustand/useRaffle";
import Image from "next/image";
import FinancingCard from "./FinancingCard";

const RaffleSubmittedForm = ({
	raffle,
	winningProducts,
}: {
	raffle: TResponseRaffleEntry;
	winningProducts?: IBEResponseRaffleProductSelection[] | null;
}) => {
	const { rafflePaymentForm } = useRaffle();
	console.log("rafflePaymentForm", rafflePaymentForm);

	if (winningProducts && raffle?.paymentStatus !== "PAID") {
		return (
			<div className="space-y-4 relative h-full">
				{winningProducts?.map((winningProduct) => (
					<FinancingCard
						title={winningProduct?.name}
						paymentDescription="1 lần thanh toán đầy đủ"
						firstDueDate="1 Tháng 1, 2025"
						installmentAmount={winningProduct?.price || 0}
						arp={13.35}
						total={10000.25}
						paymentIcon={VIETINBANK_QR}
						onFinanceClick={() => console.log("Finance clicked")}
					/>
				))}
				{/* summary total payment */}
				<div className="p-4 bg-gray-200 rounded-lg space-y-2">
					<div className="flex flex-col justify-between gap-4">
						<div className="relative">
							<div className="flex items-center gap-2">
								<Image
									src={I3D_E_INVOICE}
									width={32}
									height={32}
									alt="invoice-e"
									className="scale-110 object-cover"
								/>
								<span className="font-semibold text-lg">
									Thanh Toán & Hóa Đơn
								</span>
							</div>
							<div className="text-sm text-gray-600 font-semibold">
								Để đảm bảo quyền lợi khách hàng, NoobStore sẽ
								giữ và thanh toán cho maker sau khi raffle kết
								thúc. Hóa đơn điện tử sẽ sẵn sàng sau khi thanh
								toán được hoàn tất{" "}
							</div>
						</div>
						<div className="relative">
							<div className="flex items-center gap-2">
								<Image
									src={I3D_STAR_POINT}
									width={32}
									height={32}
									alt="invoice-e"
									className="scale-110 object-cover"
								/>
								<span className="font-semibold text-lg">
									Điểm Thưởng & Ủng hộ
								</span>
							</div>
							<div className="text-sm text-gray-600 font-semibold">
								Với mỗi đơn hàng hoàn tất đều được tích điểm
								thưởng dùng đổi ưu đãi từ nền tảng. Ngoài ra,
								bạn có thể ủng hộ cho maker! 100% tiền ủng hộ
								được chuyển cho maker.
							</div>
						</div>
						<div className="relative">
							<div className="flex items-center gap-2">
								<Image
									src={I3D_STAR_POINT}
									width={32}
									height={32}
									alt="invoice-e"
									className="scale-110 object-cover"
								/>
								<span className="font-semibold text-lg">
									Quy định & Chính sách
								</span>
							</div>
							<div className="text-sm text-gray-600 font-semibold">
								Trước khi thanh toán hãy tham khảo thêm một lần
								nữa về{" "}
								<a
									href="#"
									className="text-sm relative inline-block overflow-hidden group/link -bottom-1.5">
									<span className="relative z-10 group-hover/link:text-white transition-all duration-300 text-blue-600 text-sm group-hover/link:px-1">
										Quy Định & Chính Sách
									</span>
									<span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 translate-y-full group-hover/link:translate-y-0 transition-transform duration-300 ease-out rounded-sm px-1" />
								</a>{" "}
								raffle ở NoobStore.
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="col-span-5 space-y-2 pr-3">
			<div className="relative">
				<div className="font-bold bg-gray-200 p-2 rounded-tl-xl rounded-tr-xl flex items-center text-lg">
					<Image
						src={I3D_NUMBER_RAFFLE_WHEEL}
						alt="Raffle Wheel"
						width={32}
						height={32}
						className="inline-block mr-2 scale-125"
					/>
					Sản phẩm đã chọn
				</div>
				<div className="relative p-2 border-2 border-gray-200 rounded-bl-xl rounded-br-xl">
					<div className="flex flex-wrap items-center gap-2">
						{raffle.productSelections.map((option) => (
							<div
								key={option?.productId ?? option.name}
								className="flex flex-col items-start gap-1 border rounded-md p-2 bg-gray-100 border-gray-400 relative overflow-hidden group cursor-pointer max-w-max">
								<div className="w-24 h-24 relative z-10">
									<Image
										src={option.thumbnail?.path ?? ""}
										alt={
											option.thumbnail?.alt ??
											option.name ??
											"Hình ảnh tùy chọn"
										}
										fill
										className="rounded-md object-cover hover:scale-105 transition-all duration-300"
										draggable={false}
									/>
									<div className="absolute right-1 top-1 bg-gray-50 rounded-full">
										{option.priority === 1 ? (
											<Image
												src={I3D_NUMBER_ONE}
												alt="Số 1"
												width={24}
												height={24}
											/>
										) : option.priority === 2 ? (
											<Image
												src={I3D_NUMBER_TWO}
												alt="Số 2"
												width={24}
												height={24}
											/>
										) : option.priority === 3 ? (
											<Image
												src={I3D_NUMBER_THREE}
												alt="Số 3"
												width={24}
												height={24}
											/>
										) : null}
									</div>
								</div>
								<div className="flex flex-col w-full flex-1 relative z-10 ">
									<div className="text-xs font-bold line-clamp-1 max-w-[96px]">
										{option.name}
									</div>
									<div className="text-xs text-gray-700 font-normal">
										{formatCurrency(option.price)}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
			<div className="relative">
				<div className="font-bold bg-yellow-400 p-2 rounded-tl-xl rounded-tr-xl flex items-center text-lg">
					<Image
						src={I3D_WINNER_CUP}
						alt="Raffle Wheel"
						width={32}
						height={32}
						className="inline-block mr-2 scale-125"
					/>
					Sản phẩm đã trúng
				</div>
				{winningProducts &&
					winningProducts?.map((winningProduct) => (
						<div className="relative p-2 border-2 border-yellow-400 rounded-bl-xl rounded-br-xl">
							<div
								key={winningProduct?.productId}
								className="flex flex-col items-start gap-1 border rounded-md p-2 bg-gray-100 border-gray-400 relative overflow-hidden group cursor-pointer max-w-max">
								<div className="w-24 h-24 relative z-10">
									<Image
										src={
											winningProduct?.thumbnail?.path ??
											""
										}
										alt={
											winningProduct?.thumbnail?.alt ??
											winningProduct?.name ??
											"Hình ảnh tùy chọn"
										}
										fill
										className="rounded-md object-cover hover:scale-105 transition-all duration-300"
										draggable={false}
									/>
								</div>
								<div className="flex flex-col w-full flex-1 relative z-10 ">
									<div className="text-xs font-bold line-clamp-1 max-w-[96px]">
										{winningProduct.name}
									</div>
									<div className="text-xs text-gray-700 font-normal">
										{formatCurrency(winningProduct.price)}
									</div>
								</div>
							</div>
						</div>
					))}
			</div>
			<div className="relative">
				<div className="font-bold bg-gray-200 p-2 rounded-tl-xl rounded-tr-xl flex items-center text-lg ">
					<Image
						src={I3D_INFORMATION}
						alt="submitted information"
						width={32}
						height={32}
						className="inline-block mr-2 scale-125"
					/>
					Thông tin đã đăng ký
				</div>
				<div className="relative border-2 border-gray-200 rounded-bl-xl rounded-br-xl">
					{/* Delivery Info */}
					<div className="p-2 space-y-2">
						<DisplayBlock
							label="Người nhận"
							value={
								<div className="text-sm font-bold">
									{raffle?.name}
								</div>
							}
						/>
						<hr />
						<DisplayBlock
							label="Email"
							value={
								<div className="text-sm font-bold">
									{raffle?.email}
								</div>
							}
						/>
						<hr />
						<DisplayBlock
							label="Giao hàng tại"
							value={
								<div className="text-sm font-bold text-right">
									{raffle?.shipping?.address} <br />
									{raffle?.shipping?.city} <br />
									{raffle?.shipping?.companyName}
								</div>
							}
						/>
						<hr />
						<DisplayBlock
							label="Số điện thoại"
							value={
								<div className="text-sm font-bold">
									{raffle?.phone}
								</div>
							}
						/>
						<hr />
						<DisplayBlock
							label="Vận chuyển bởi"
							value={
								<div className="bg-red-400 text-white rounded-md px-2 py-0.5 max-w-max font-bold w-fit text-sm">
									{raffle?.shipping?.shippingMethod?.name ||
										"Chưa xác định"}
								</div>
							}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default RaffleSubmittedForm;

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
		<div className="flex justify-between items-start gap-4">
			<span className="font-semibold text-gray-600 text-sm">{label}</span>
			{typeof value === "string" || typeof value === "number" ? (
				<span className="font-bold text-sm my-auto">{value}</span>
			) : (
				value
			)}
		</div>
	);
};
