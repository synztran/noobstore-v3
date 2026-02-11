import { Button } from "@/components/ReUIComponent/Button";
import {
	MAKER_DISCORD_ICON,
	MAKER_FB_ICON,
	NEW_MISSING_IMAGE,
} from "@/constants/Images";
import { useAuth } from "@/context/Auth";
import { EnumMakerStatus } from "@/interface/Client/Maker";
import {
	EnumRaffleStatus,
	IBEResponseRaffleInfo,
} from "@/interface/Client/Raffle";
import { IAuthUser } from "@/interface/Context/auth";
import { appQueryKeys } from "@/react-query/root";
import DateUtils from "@/utils/DateUtils";
import { formatCurrency } from "@/utils/FormatNumber";
import useDialogLogin, {
	EnumStatusDialog,
	useDialogLoginAction,
} from "@/zustand/useDialogLogin";
import { useRaffleAction } from "@/zustand/useRaffle";
import { Divider, Tooltip } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import {
	Calendar,
	ChevronLeft,
	ChevronRight,
	Dot,
	ShieldCheck,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import RaffleBadge from "./RaffleBadge";
import RaffleCountDown from "./RaffleCountDown";
import StepConfirmation from "./RaffleEntryModal/Confirm";
import StepDeliveryInfo from "./RaffleEntryModal/Delivery";
import StepInformation from "./RaffleEntryModal/Information";
import StepSecretKey from "./RaffleEntryModal/SecretForm";
import StepSelectProduct from "./RaffleEntryModal/Selection";
import Stepper from "./RaffleModalFancy";
import Step from "./RaffleModalFancy/Stepper/Step";
import RaffleStatus from "./RaffleStatus";

interface IProps {
	raffleData?: IBEResponseRaffleInfo;
	isLoading: boolean;
}

export default function RaffleBlock({ raffleData, isLoading }: IProps) {
	const { user } = useAuth() as unknown as { user: IAuthUser | null };
	const {
		initFromRaffleData,
		handleClearRaffleSubmitForm,
		updateRaffleSubmitForm,
	} = useRaffleAction();
	const { isOpenDialogLogin } = useDialogLogin();
	const { toggleDialogLogin } = useDialogLoginAction();
	const queryClient = useQueryClient();
	const [showRaffleModal, setShowRaffleModal] = useState(false);
	const [selectedOption, setSelectedOption] = useState("");
	const [currentImageIndex, setCurrentImageIndex] = useState(0);

	const [minPrice, maxPrice] = useMemo(() => {
		if (!raffleData?.productOptions?.length) {
			return [0, 0];
		}
		return [
			Math.min(...raffleData?.productOptions?.map((o) => o.price)),
			Math.max(...raffleData?.productOptions?.map((o) => o.price)),
		];
	}, [raffleData]);

	// Find the selected option object for price display
	const selectedOptionObj =
		raffleData?.productOptions?.find((o) => o.id === selectedOption) ||
		raffleData?.productOptions?.[0];

	const statusRaffleBasingTime = useMemo(() => {
		const now = new Date();
		const start = DateUtils.parseServerDate(raffleData?.startAt || "");
		const end = DateUtils.parseServerDate(raffleData?.endAt || "");

		if (now < start) return EnumRaffleStatus.UPCOMING;
		if (now >= start && now <= end) return EnumRaffleStatus.ONGOING;
		if (now > end) return EnumRaffleStatus.ENDED;

		return EnumRaffleStatus.CANCELLED;
	}, [raffleData?.startAt, raffleData?.endAt]);

	// Sync image with option
	useEffect(() => {
		const idx = raffleData?.productOptions?.findIndex(
			(o) => o.id === selectedOption,
		);
		if (!idx) return;
		if (idx !== -1) setCurrentImageIndex(idx);
	}, [selectedOption, raffleData]);

	useEffect(() => {
		if (raffleData) {
			initFromRaffleData(raffleData);
		}
	}, [raffleData]);

	// Sync option with image
	const handleImageChange = (idx: number) => {
		setCurrentImageIndex(idx);
		setSelectedOption(raffleData?.productOptions?.[idx]?.id || "");
	};

	// const progressPercentage =
	// 	(raffleData.joined / raffleData.totalEntries) * 100;

	const resetAndClose = () => {
		handleClearRaffleSubmitForm();
		setShowRaffleModal(false);
		queryClient.invalidateQueries(
			appQueryKeys.raffle.getRaffles({
				featuredOnly: true,
			}),
		);
	};

	const handleOpenRaffleForm = () => {
		if (!user && !isOpenDialogLogin) {
			toggleDialogLogin(
				isOpenDialogLogin
					? Boolean(EnumStatusDialog.CLOSE)
					: Boolean(EnumStatusDialog.OPEN),
			);
		} else {
			setShowRaffleModal(true);
		}
	};

	const handleInputChange =
		(field: string) =>
		(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			const value = e.target.value;
			updateRaffleSubmitForm({
				__field: field,
				__value: value,
			} as any);
		};

	const handleSelectChange = (field: string) => (value: string) => {
		updateRaffleSubmitForm({
			__field: field,
			__value: value,
		} as any);
	};

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

	if (isLoading) {
		return (
			<div className="container max-w-7xl mx-auto py-4">
				<div className="grid grid-cols-1 md:grid-cols-12 gap-4">
					{/* Left: Image Skeleton */}
					<div className="col-span-8 gap-4 h-full flex flex-col">
						<div className=" bg-white rounded-xl shadow p-4 h-2/3 relative">
							<div className="w-full h-full bg-gray-200 animate-pulse rounded-lg"></div>
						</div>
						<div className="col-span-8 bg-white rounded-xl shadow p-4 h-1/3 relative">
							<div className="w-full h-full bg-gray-200 animate-pulse rounded-lg"></div>
						</div>
					</div>

					{/* Right: Info Skeleton */}
					<div className="col-span-4 bg-white rounded-xl shadow p-4 flex flex-col gap-4">
						{/* Badge & Status */}
						<div className="flex items-center gap-2">
							<div className="w-20 h-6 bg-gray-200 animate-pulse rounded"></div>
							<div className="w-24 h-6 bg-gray-200 animate-pulse rounded"></div>
						</div>

						{/* Title */}
						<div className="space-y-2">
							<div className="w-full h-6 bg-gray-200 animate-pulse rounded"></div>
							<div className="w-3/4 h-6 bg-gray-200 animate-pulse rounded"></div>
						</div>

						{/* Description */}
						<div className="space-y-2">
							<div className="w-full h-4 bg-gray-200 animate-pulse rounded"></div>
							<div className="w-full h-4 bg-gray-200 animate-pulse rounded"></div>
							<div className="w-2/3 h-4 bg-gray-200 animate-pulse rounded"></div>
						</div>

						{/* Seller */}
						<div className="flex items-center gap-3">
							<div className="w-12 h-12 bg-gray-200 animate-pulse rounded-full"></div>
							<div className="flex-1 space-y-2">
								<div className="w-32 h-5 bg-gray-200 animate-pulse rounded"></div>
								<div className="w-24 h-4 bg-gray-200 animate-pulse rounded"></div>
							</div>
						</div>

						{/* Countdown */}
						<div className="w-full h-16 bg-gray-200 animate-pulse rounded-lg"></div>

						{/* Options */}
						<div className="space-y-2">
							<div className="w-24 h-5 bg-gray-200 animate-pulse rounded"></div>
							<div className="flex gap-2">
								{[1, 2, 3].map((i) => (
									<div
										key={i}
										className="w-20 h-20 bg-gray-200 animate-pulse rounded-full"></div>
								))}
							</div>
						</div>

						{/* Features */}
						<div className="space-y-2">
							<div className="w-24 h-5 bg-gray-200 animate-pulse rounded"></div>
							{[1, 2, 3, 4].map((i) => (
								<div
									key={i}
									className="w-full h-4 bg-gray-200 animate-pulse rounded"></div>
							))}
						</div>

						{/* Button */}
						<div className="w-full h-12 bg-gray-200 animate-pulse rounded-md"></div>
					</div>
				</div>
			</div>
		);
	}

	if (!raffleData) return null;

	return (
		<div className="container max-w-7xl mx-auto p-4 bg-gray-50 rounded-lg">
			<div className="grid grid-cols-1 md:grid-cols-12 gap-4">
				{/* Left: Image Swiper */}
				<div className="col-span-7 flex flex-col items-center justify-center h-full relative max-h-max gap-4">
					<div className="w-full rounded-xl shadow-md bg-white flex justify-center relative h-full max-h-max p-4">
						<div className="flex-1 flex items-center justify-center relative">
							{raffleData?.productOptions?.length > 1 ? (
								<button
									type="button"
									onClick={() =>
										handleImageChange(
											(currentImageIndex -
												1 +
												raffleData?.productOptions
													?.length) %
												raffleData?.productOptions
													?.length,
										)
									}
									className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 z-10 rounded-full p-1 shadow"
									aria-label="Previous image">
									<ChevronLeft />
								</button>
							) : null}
							{/* Animate image change */}
							<div className="w-full h-136 relative">
								<AnimatePresence mode="wait" initial={false}>
									<motion.div
										key={
											raffleData?.productOptions?.[
												currentImageIndex
											]?.id
										}
										initial={{
											opacity: 0,
											scale: 0.98,
											x: 40,
										}}
										animate={{
											opacity: 1,
											scale: 1,
											x: 0,
										}}
										exit={{
											opacity: 0,
											scale: 0.98,
											x: -40,
										}}
										transition={{
											duration: 0.35,
											ease: "easeInOut",
										}}
										className="w-full h-full absolute top-0 left-0"
										drag="x"
										dragConstraints={{ left: 0, right: 0 }}
										dragElastic={0.2}
										dragMomentum={false}
										onDragEnd={(_, info) => {
											const threshold = 60;
											const length =
												raffleData?.productOptions
													?.length ?? 0;
											if (!length) return;

											// Slide left -> next image
											if (info.offset.x < -threshold) {
												handleImageChange(
													(currentImageIndex + 1) %
														length,
												);
												return;
											}
											// Slide right -> prev image
											if (info.offset.x > threshold) {
												handleImageChange(
													(currentImageIndex -
														1 +
														length) %
														length,
												);
												return;
											}
										}}
										whileTap={{ cursor: "grabbing" }}>
										<Image
											src={
												raffleData?.productOptions?.[
													currentImageIndex
												]?.thumbnail?.path ||
												NEW_MISSING_IMAGE
											}
											alt={
												raffleData?.productOptions?.[
													currentImageIndex
												]?.label || ""
											}
											className="w-full object-cover rounded-md shadow-lg select-none"
											objectFit="cover"
											fill
											draggable={false}
										/>
									</motion.div>
								</AnimatePresence>
							</div>
							{raffleData?.productOptions?.length > 1 ? (
								<button
									type="button"
									onClick={() =>
										handleImageChange(
											(currentImageIndex + 1) %
												raffleData?.productOptions
													?.length,
										)
									}
									className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 z-10 rounded-full p-1 shadow"
									aria-label="Next image">
									<ChevronRight />
								</button>
							) : null}
						</div>
						{/* Swiper Thumbnails on the right */}
						<div className="flex flex-col gap-2 ml-2 items-center justify-start">
							{raffleData?.productOptions?.map((opt, idx) => (
								<div
									className="relative w-20 h-20 rounded-md shadow-sm"
									key={idx}>
									<Image
										key={opt.id}
										src={
											opt.thumbnail?.path ||
											NEW_MISSING_IMAGE
										}
										alt={opt.label || ""}
										fill
										objectFit="cover"
										className={`rounded-lg cursor-pointer border-2 ${
											idx === currentImageIndex
												? "border-red-400"
												: "border-gray-200"
										}`}
										onClick={() => handleImageChange(idx)}
									/>
								</div>
							))}
						</div>
					</div>
					<div className="w-full max-h-max h-full rounded-xl shadow-md bg-white p-4 flex gap-4">
						<div className="flex items-center gap-3 mt-2 w-5/12">
							<div className="min-w-20 h-20 bg-gray-200 rounded-full relative overflow-hidden border border-gray-600">
								<Image
									src={
										raffleData?.makerInfo?.logo?.path ||
										NEW_MISSING_IMAGE
									}
									alt={
										raffleData?.makerInfo?.brandName ||
										"maker Avatar"
									}
									fill
									objectFit="cover"
									className="rounded-full"
								/>
							</div>
							<div className="space-y-1">
								<div className="flex items-center gap-1">
									<span className="font-semibold text-lg">
										{raffleData?.makerInfo?.brandName}
									</span>
									{raffleData?.makerInfo
										?.verificationStatus ===
										EnumMakerStatus.VERIFIED && (
										<Tooltip
											title="Maker đã xác thực thông tin"
											placement="right">
											<ShieldCheck
												className="cursor-pointer"
												size={18}
												color="#48d585"
												strokeWidth={2}
												absoluteStrokeWidth
											/>
										</Tooltip>
									)}
								</div>
								<div className="flex items-center gap-1 font-normal">
									Tổng số raffle:{" "}
									<span className="font-semibold text-sm">
										{raffleData?.makerInfo?.raffleTimes}
									</span>
								</div>
								<div className="flex gap-2">
									<Link href="#">
										<Image
											src={MAKER_FB_ICON}
											width={32}
											height={32}
											alt="Facebook"
											className="hover:scale-110 transition-all duration-150"
										/>
									</Link>
									<Link href={"#"}>
										<Image
											src={MAKER_DISCORD_ICON}
											width={32}
											height={32}
											alt="Discord"
											className="hover:scale-110 transition-all duration-150"
										/>
									</Link>
								</div>
							</div>
						</div>
						<Divider orientation="vertical" />
						<div
							className="w-7/12 font-normal"
							style={{ textIndent: "0.5rem" }}>
							Maker cung cấp những sản phẩm thủ công với độ chi
							tiết đên từ các nguyên liệu tốt nhất. Mỗi sản phẩm
							đều được tạo ra với tâm huyết và sự tận tâm, mang
							đến trải nghiệm độc đáo và giá trị cao cho người sử
							dụng.
						</div>
					</div>
				</div>

				{/* Right: All Information */}
				<div className="col-span-5 bg-white rounded-xl shadow p-4 flex flex-col gap-2 h-full space-y-2">
					{/* Title, Description, Seller */}
					<div className="space-y-4">
						<div className="flex items-center gap-2">
							<RaffleBadge type={raffleData.raffleType} />
							<RaffleStatus
								mode={
									raffleData.status ?? statusRaffleBasingTime
								}
							/>
						</div>
						{/* <RaffleCountDown
							startDate={raffleData.startAt}
							endDate={raffleData.endAt}
							raffleStatus={raffleData.status as EnumRaffleStatus}
							className="text-center"
						/> */}
						<div>
							<div className="text-2xl font-bold line-clamp-1 capitalize">
								{raffleData?.title}
							</div>
							<div
								className="text-gray-700 max-h-60 overflow-y-auto text-sm"
								dangerouslySetInnerHTML={{
									__html: raffleData?.description,
								}}
							/>
						</div>
					</div>

					{/* Option Select (sync with image) */}
					<div className="relative">
						<div className="font-semibold mb-1 flex items-center justify-between overflow-hidden">
							<span className="min-w-22.5 text-lg">Sản phẩm</span>
							<Divider className="border-gray-400 w-[80%]" />
						</div>
						<div className="text-base font-bold flex items-center gap-1">
							<Dot size={20} strokeWidth={2} />
							{selectedOptionObj?.label} -&nbsp;
							{formatCurrency(selectedOptionObj?.price || 0)}
						</div>
						<div className="flex gap-2 flex-wrap mt-2">
							{raffleData?.productOptions?.map((opt) => (
								<button
									key={opt.id}
									type="button"
									onClick={() => {
										setSelectedOption(opt.id);
										setCurrentImageIndex(
											raffleData?.productOptions?.findIndex(
												(o) => o.id === opt.id,
											),
										);
									}}
									className={`relative p-0.5 rounded-full border-2 font-medium transition overflow-hidden w-15 h-15 ${
										selectedOption === opt.id
											? "text-white border-red-600"
											: "text-gray-700 border-gray-300 hover:bg-gray-100"
									} cursor-pointer`}>
									<Image
										src={
											opt.thumbnail?.path ||
											NEW_MISSING_IMAGE
										}
										alt={opt.label}
										objectFit="cover"
										fill
										className="rounded-full cursor-pointer border-2"
									/>
								</button>
							))}
						</div>
					</div>

					{/* Features */}
					<div className="relative">
						<div className="font-semibold mb-1 flex items-center justify-between overflow-hidden">
							<span className="min-w-22.5 text-lg">
								Thông tin
							</span>
							<Divider className="border-gray-400 w-[80%]" />
						</div>
						<div
							className="grid grid-cols-2 gap-1"
							style={{ paddingInlineStart: "0.5rem" }}>
							{raffleData.features.map((feature, idx) => (
								<div
									key={idx}
									className="flex items-center gap-1">
									<Dot
										size={24}
										strokeWidth={2}
										className="scale-150"
									/>
									<span className="text-gray-700 text-base">
										{feature}
									</span>
								</div>
							))}
						</div>
					</div>

					{/* delivery expected */}
					<div className="relative">
						<div className="font-semibold mb-1 flex items-center justify-between overflow-hidden">
							<span className="min-w-[90px] text-lg">
								Giao hàng
							</span>
							<Divider className="border-gray-400 w-[80%]" />
						</div>
						<div
							className="flex items-center gap-1"
							style={{ paddingInlineStart: "0.5rem" }}>
							<Calendar />
							Dự kiến giao hàng:{" "}
							<span className="font-semibold">
								{formatDistanceToNow(
									new Date(raffleData?.endAt || ""),
									{
										addSuffix: true,
									},
								)}{" "}
								~{" "}
								<span className="font-semibold">
									{new Date(
										new Date().getTime() +
											7 * 24 * 60 * 60 * 1000,
									).toLocaleDateString("vi-VN")}
								</span>
							</span>
						</div>
					</div>

					{/* Progress */}
					{/* <div>
						<div className="flex items-center justify-between mb-1">
							<span className="text-base text-black">
								{raffleData.joined} lượt tham gia
							</span>
						</div>
					</div> */}

					<RaffleCountDown
						startDate={raffleData.startAt}
						endDate={raffleData.endAt}
						raffleStatus={raffleData.status as EnumRaffleStatus}
						className="text-center"
					/>

					<Button
						variant={"primary"}
						onClick={handleOpenRaffleForm}
						disabled={
							raffleData?.status !== EnumRaffleStatus.ONGOING ||
							statusRaffleBasingTime !==
								EnumRaffleStatus.ONGOING ||
							raffleData?.isHasJoined
						}
						className={`flex mt-auto items-center justify-center gap-2 w-full py-3 rounded-md text-white font-semibold text-lg transition ${
							raffleData?.status === EnumRaffleStatus.ONGOING ||
							statusRaffleBasingTime === EnumRaffleStatus.ONGOING
								? "bg-red-400 hover:bg-red-500"
								: ""
						} ${raffleData?.isHasJoined ? "bg-gray-400" : ""}`}>
						{labelButton(
							raffleData?.status as EnumRaffleStatus,
							raffleData?.isHasJoined || false,
						)}
					</Button>
				</div>
			</div>
			{/* see more */}
			<motion.button
				whileHover={{ scale: 1.05, background: "#f87171" }}
				whileTap={{ scale: 0.97 }}
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{
					type: "spring",
					stiffness: 300,
					damping: 20,
					delay: 0.2,
				}}
				className="max-w-max mt-4 px-6 py-3 rounded-md bg-gradient-to-r from-pink-500 via-red-400 to-yellow-400 text-white font-bold text-base shadow-lg flex items-center gap-2 group focus:outline-none mx-auto"
				onClick={() => (window.location.href = "/raffles")}>
				<span className="drop-shadow-sm text-white">
					🎉 Xem thêm các raffle khác
				</span>
				<span className="ml-1 flex items-center">
					<ChevronRight className="transition-transform" />
				</span>
			</motion.button>

			{/* Raffle Entry Modal */}
			<Stepper
				raffleId={raffleData?.raffleId}
				raffleData={raffleData}
				open={showRaffleModal}
				onClose={resetAndClose}
				onFinalStepCompleted={resetAndClose}
				onStepChange={(step) => {
					// window.scrollTo({ top: 0, behavior: "smooth" });
				}}>
				{raffleData?.isHaveSecretKey ? (
					<Step name="Khóa bí mật" stepValue="secretKey">
						<StepSecretKey raffleData={raffleData} />
					</Step>
				) : null}
				<Step name="Thông tin" stepValue="information">
					<StepInformation
						raffleData={raffleData}
						minPrice={minPrice}
						maxPrice={maxPrice}
					/>
				</Step>
				<Step name="Lựa chọn" stepValue="productSelection">
					<StepSelectProduct raffleData={raffleData} />
				</Step>
				<Step name="Địa chỉ" stepValue="shippingInfo">
					<StepDeliveryInfo
						handleInputChange={handleInputChange}
						handleSelectChange={handleSelectChange}
					/>
				</Step>
				<Step name="Xác nhận" stepValue="submit">
					<StepConfirmation raffleData={raffleData} />
				</Step>
			</Stepper>
		</div>
	);
}
