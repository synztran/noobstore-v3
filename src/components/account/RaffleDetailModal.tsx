import {
	mappingEnumRafflePaymentStatus,
	mappingRaffleStatusLabel,
} from "@/constants";
import {
	I3D_NUMBER_ONE,
	I3D_NUMBER_RAFFLE_WHEEL,
	I3D_NUMBER_THREE,
	I3D_NUMBER_TWO,
	I3D_WINNER_RANK,
} from "@/constants/Images";
import { TResponseRaffleEntry } from "@/interface/Context/auth";
import { EnumRafflePaymentStatus } from "@/interface/interface";
import DateUtils from "@/utils/DateUtils";
import { formatCurrency } from "@/utils/FormatNumber";
import { Divider, Modal, Tooltip } from "@mui/material";
import { CircleAlert, X } from "lucide-react";
import Image from "next/image";
import React, { useRef } from "react";

interface RaffleDetailModalProps {
	open: boolean;
	onClose: () => void;
	selected: TResponseRaffleEntry | null;
	mapRaffleProductWin: Record<
		string,
		TResponseRaffleEntry["productSelections"][0]
	>;
}

const RaffleDetailModal: React.FC<RaffleDetailModalProps> = ({
	open,
	onClose,
	selected,
}) => {
	const modalDetailRaffle = useRef<HTMLDivElement | null>(null);

	console.log("selected", selected);

	if (!open || !selected) return null;

	return (
		<Modal open={open} onClose={onClose}>
			<div
				ref={modalDetailRaffle}
				className="bg-white rounded-lg shadow-lg max-w-xl w-full p-4 animate-fade-in flex flex-col gap-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-h-[90vh]"
				onMouseDown={(e) => e.stopPropagation()}>
				<button
					className="absolute -top-3 -right-2 bg-gray-400 rounded-full p-1 hover:scale-110 transition-all duration-300 hover:shadow-md"
					onClick={onClose}
					aria-label="Đóng">
					<X size={18} />
				</button>
				<div className="flex gap-4">
					<div className="w-36 h-36 relative flex-shrink-0">
						<Image
							src={selected?.raffleInfo.thumbnail.path}
							alt={selected?.raffleInfo.thumbnail.alt}
							fill
							objectFit="cover"
							className="rounded-md"
						/>
					</div>
					<div className="flex flex-col justify-between flex-1">
						<div>
							<div className="flex items-start gap-2">
								<div className="font-bold text-lg mb-1">
									{selected.raffleInfo.title}
								</div>
							</div>
							<div className="text-sm text-gray-600 mb-2">
								{selected.raffleInfo.productOptions
									.map((option) => option.label)
									.join(" | ")}
							</div>
						</div>
						<div className="flex flex-col">
							<span className="text-gray-600">
								Maker:{" "}
								<span className="font-semibold">
									{selected?.makerInfo?.brandName || ""}
								</span>
							</span>
							<span className="text-gray-600">
								Thời gian:{" "}
								<span className="font-semibold">
									{DateUtils.formatVietNamDate(
										selected.raffleInfo?.createdAt || ""
									)}
								</span>
							</span>
						</div>
					</div>
				</div>
				<Divider />
				<div className="overflow-y-auto h-auto space-y-4 pb-2">
					<div className="relative flex flex-col bg-gray-100 shadow-md rounded-md col-span-3">
						<div className="bg-gray-300 p-2 rounded-tl-md rounded-tr-md font-bold flex items-center justify-between">
							<span className="text-lg">Thông tin đăng ký</span>
						</div>
						<div className="flex flex-col gap-4 p-2">
							<div className="space-y-2">
								<div className="flex gap-4 items-center">
									<strong className="w-[155px]">ID</strong>
									<div className="bg-neutral-200 text-gray-700 rounded-md px-2 py-0.5 max-w-max font-bold">
										{selected.entryId || ""}
									</div>
								</div>
								<div className="flex gap-4 items-start">
									<strong className="w-[155px]">
										Liên hệ
									</strong>
									<div className="pl-1">
										<span className="capitalize">
											{selected.name} - {selected.phone}
										</span>{" "}
										<br />
										{selected.email}
									</div>
								</div>
								<div className="flex gap-4 items-start">
									<strong className="w-[155px]">
										Địa chỉ giao hàng
									</strong>
									<div className="p-1">
										{selected?.shipping?.address}
										&nbsp;
										{selected?.shipping?.city} <br />
										{selected?.shipping?.companyName}
									</div>
								</div>
								<div className="flex gap-4 items-center">
									<strong className="w-[155px]">
										Đơn vị vận chuyển
									</strong>
									<div className="bg-red-400 text-white rounded-md px-2 py-0.5 max-w-max font-bold">
										{selected.shipping.shippingMethod
											.name || "Chưa xác định"}
									</div>
								</div>
								<div className="flex gap-4 items-center">
									<strong className="w-[155px]">
										Thời gian
									</strong>
									<div className="">
										{DateUtils.formatVietNamDate(
											selected.createdAt
										) || "Chưa xác định"}
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="bg-gray-100 shadow-md rounded-md">
						<div className="font-semibold text-lg bg-gray-300 p-2 rounded-tl-md rounded-tr-md flex items-center">
							Sản phẩm đã chọn
						</div>
						<div className="grid grid-cols-2 items-center gap-2 p-2">
							{selected.productSelections.map((option) => (
								<div
									key={option?.productId ?? option.name}
									className="flex items-start gap-2 border rounded-md p-2 bg-gray-100 border-gray-400 max-w-max">
									<div className="w-20 h-20 relative">
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
									<div className="flex flex-col w-full flex-1">
										<div className="flex justify-between items-center gap-2">
											<div className="font-bold text-sm">
												{option.name}
											</div>
										</div>
										<div className="text text-gray-700 font-semibold">
											{formatCurrency(option.price)}
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
				{selected?.secretKey ? (
					<div className="relative flex flex-col bg-gray-100 shadow-md rounded-md col-span-3">
						<div className="bg-gray-300 p-2 rounded-tl-md rounded-tr-md font-bold flex items-center justify-between">
							<span className="text-lg">Mã bí mật</span>
						</div>
						<div className="text-gray-600 font-semibold text-sm p-2">
							{selected?.secretKey || ""}
						</div>
					</div>
				) : null}
			</div>
		</Modal>
	);
};

export default RaffleDetailModal;
