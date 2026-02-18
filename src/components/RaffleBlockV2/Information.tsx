import { NEW_MISSING_IMAGE } from "@/constants/Images";
import {
	EnumRaffleStatus,
	IBEResponseProductOption,
	IBEResponseRaffleInfo,
} from "@/interface/Client/Raffle";
import { formatCurrency } from "@/utils/FormatNumber";
import {
	CheckCircleIcon,
	CircleCheckIcon,
	Ticket,
	TruckIcon,
} from "lucide-react";
import Image from "next/image";
import { memo } from "react";
import { Button } from "../ReUIComponent";
import RaffleV2Countdown from "./Countdown";

interface IProps {
	raffle: IBEResponseRaffleInfo;
	combinedProductImages: {
		productId?: string;
		index: number;
		path: string;
		alt: string;
	}[];
	statusRaffleBasingTime: string;
	selectedOption: IBEResponseProductOption | null;
	setSelectedOption: (option: IBEResponseProductOption | null) => void;
	setCurrentImageIndex: (index: number) => void;
	handleOpenRaffleForm: () => void;
}

const RaffleBlockV2Information = ({
	raffle,
	combinedProductImages,
	statusRaffleBasingTime,
	selectedOption,
	setSelectedOption,
	setCurrentImageIndex,
	handleOpenRaffleForm,
}: IProps) => {
	const labelButton = (status: EnumRaffleStatus, isHasJoined: boolean) => {
		if (isHasJoined) return "Đã tham gia";
		if (
			status === EnumRaffleStatus.UPCOMING ||
			statusRaffleBasingTime === EnumRaffleStatus.UPCOMING
		)
			return "Chưa bắt đầu";
		if (
			status === EnumRaffleStatus.ONGOING ||
			statusRaffleBasingTime === EnumRaffleStatus.ONGOING
		)
			return "Tham gia Raffle";
		if (
			status === EnumRaffleStatus.ENDED ||
			statusRaffleBasingTime === EnumRaffleStatus.ENDED
		)
			return "Raffle đã kết thúc";
		return "Raffle không khả dụng";
	};

	if (!raffle) return null;

	return (
		<div className="flex flex-col gap-2 h-full space-y-2 bg-gray-100 p-4 rounded-tr-lg rounded-br-lg">
			{/* Title, Description, Seller */}
			<div className="clear-both space-y-2">
				<div className="flex items-center gap-2">
					<div className="relative w-8 h-8 rounded-full">
						<Image
							src={
								raffle?.makerInfo?.logo?.path ||
								NEW_MISSING_IMAGE
							}
							alt={raffle?.makerInfo?.brandName || "maker logo"}
							width={40}
							height={40}
							className="rounded-full object-cover"
						/>
					</div>
					<span className="uppercase font-semibold text-gray-500">
						{raffle?.makerInfo?.brandName}
					</span>
				</div>
				<div className="flex items-center justify-between gap-4">
					<div className="text-2xl font-bold line-clamp-1 capitalize">
						{raffle.title}
					</div>
					<span className="text-xl font-bold text-red-600">
						{formatCurrency(selectedOption?.price || 0)}
					</span>
				</div>
				<div className="flex gap-2 flex-wrap empty:hidden">
					{/* TODO: build selected option for product have gather than one variant */}
				</div>
				<div
					className="text-gray-500 line-clamp-4 text-lg"
					dangerouslySetInnerHTML={{
						__html: raffle.description,
					}}
				/>
			</div>

			<RaffleV2Countdown
				startDate={raffle.startAt}
				endDate={raffle.endAt}
				raffleStatus={raffle.status as EnumRaffleStatus}
				className="text-center"
			/>

			{/* Option Select (sync with image) */}
			<div className="relative space-y-1">
				<div className="font-semibold mb-1 flex items-center justify-between overflow-hidden">
					<span className="min-w-22.5 text-base">Phiên bản</span>
				</div>
				<div className="grid grid-cols-4 gap-2">
					{raffle?.productOptions?.map((opt) => (
						<Button
							key={opt.productId}
							type="button"
							className={`w-full h-full flex flex-col items-center col-span-1 rounded-lg border-2 border-gray-200 p-2 relative transition-all duration-200 ${
								selectedOption?.productId === opt.productId
									? "text-white border-blue-600 bg-gray-100"
									: "text-gray-700"
							}`}
							onClick={() => {
								setSelectedOption(opt);
								setCurrentImageIndex(
									combinedProductImages?.findIndex(
										(o) => o.productId === opt.productId,
									),
								);
							}}>
							{selectedOption?.productId === opt.productId ? (
								<CircleCheckIcon
									size={32}
									className="fill-blue-600 absolute -top-3 -right-3"
								/>
							) : null}
							<div
								className={`relative rounded-sm w-15 h-15 cursor-pointer bg-transparent`}>
								<Image
									src={
										opt.thumbnail?.path || NEW_MISSING_IMAGE
									}
									alt={opt.label}
									objectFit="cover"
									fill
									className="rounded-full cursor-pointer p-0.5"
								/>
							</div>
							<div className="capitalize text-sm text-center max-w-15 truncate text-gray-500 font-semibold">
								{opt.label}
							</div>
						</Button>
					))}
				</div>
			</div>

			{/* Features */}
			<div className="relative">
				<div className="font-semibold mb-1 flex items-center justify-between overflow-hidden">
					<span className="min-w-22.5 text-base uppercase tracking-wider">
						Thông tin
					</span>
				</div>
				<div
					className="grid grid-cols-1 gap-1"
					style={{ paddingInlineStart: "0.5rem" }}>
					{raffle.features.map((feature, idx) => (
						<div key={idx} className="flex items-center gap-1">
							<CheckCircleIcon
								size={16}
								strokeWidth={3}
								className="text-blue-600"
							/>
							<span className="text-gray-600 text-sm">
								{feature}
							</span>
						</div>
					))}
				</div>
			</div>

			{/* delivery expected */}
			<div className="relative mt-auto space-y-2">
				<div className="flex items-center gap-1 justify-center text-gray-500 font-semibold">
					<TruckIcon />
					Dự kiến giao hàng:{" "}
					<span className="">
						{/* {formatDistanceToNow(new Date(raffle?.endAt || ""), {
							addSuffix: true,
						})}{" "}
						~{" "} */}
						{new Date(
							new Date().getTime() + 7 * 24 * 60 * 60 * 1000,
						).toLocaleDateString("vi-VN")}
					</span>
				</div>
				<>
					<Button
						variant={"primary"}
						onClick={handleOpenRaffleForm}
						disabled={
							raffle?.status !== EnumRaffleStatus.ONGOING ||
							statusRaffleBasingTime !==
								EnumRaffleStatus.ONGOING ||
							raffle?.isHasJoined
						}
						className={`flex items-center justify-center gap-2 w-full py-3 rounded-md text-white font-semibold text-xl transition h-16 ${
							raffle?.status === EnumRaffleStatus.ONGOING ||
							statusRaffleBasingTime === EnumRaffleStatus.ONGOING
								? "bg-red-400 hover:bg-red-500"
								: ""
						} ${raffle?.isHasJoined ? "bg-gray-400" : ""}`}>
						<Ticket />
						{labelButton(
							raffle?.status as EnumRaffleStatus,
							raffle?.isHasJoined || false,
						)}
					</Button>
					<div className="text-center text-xs text-gray-500">
						Bằng việc tham gia, bạn đồng ý với các điều khoản và
						điều kiện cuả Maker và NoobStore
					</div>
				</>
			</div>

			{/* Progress */}
			{/* <div>
						<div className="flex items-center justify-between mb-1">
							<span className="text-base text-black">
								{raffleData.joined} lượt tham gia
							</span>
						</div>
					</div> */}
		</div>
	);
};

export default memo(RaffleBlockV2Information);
