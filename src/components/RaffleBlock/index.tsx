import React, { use, useEffect, useMemo, useState } from "react";
import {
	People,
	ChevronLeft,
	ChevronRight,
	Verified,
	VerifiedOutlined,
	VerifiedUser,
	VerifiedTwoTone,
} from "@mui/icons-material";
import RaffleEntryModal from "./RaffleEntryModal";
import Image from "next/image";
import RaffleCountDown from "./RaffleCountDown";
import {
	PaymentMethod,
	ProductSelection,
	RaffleData,
	RaffleSubmitForm,
} from "@/interface/Raffle";
import RaffleBadge from "./RaffleBadge";
import { LOGO_STORE } from "@/constants/Images";
import {
	Check,
	CircleCheck,
	Dot,
	Mail,
	ShieldCheck,
	Sparkles,
} from "lucide-react";
import { Divider, Tooltip } from "@mui/material";
import { formatCurrency } from "@/utils/FormatNumber";
import Stepper, { Step } from "./RaffleModalFancy";
import StepInformation from "./RaffleEntryModal/Information";
import StepSelectProduct from "./RaffleEntryModal/Selection";
import StepDeliveryInfo from "./RaffleEntryModal/Delivery";
import StepConfirmation from "./RaffleEntryModal/Confirm";
import RaffleStatus from "./RaffleStatus";
import { AnimatePresence, motion } from "motion/react";
import CountDownTime from "../CountDownTime";
import { useAuth } from "@/context/Auth";
import { IAuthUser } from "@/interface/Context/auth";
import useDialogLogin, {
	EnumStatusDialog,
	useDialogLoginAction,
} from "@/zustand/useDialogLogin";
import useRaffleSingleQueries from "@/react-query/raffles/api/useRaffleDetailQueries";
import useRaffleFeaturedQueries from "@/react-query/raffles/api/useRaffleDetailQueries";
import {
	EnumRaffleStatus,
	IBEResponseRaffleInfo,
} from "@/interface/Client/Raffle";

// Hardcoded images and options for demo as per your links
const optionImages = [
	{
		id: "blue",
		label: "Blue Switch",
		url: "https://res.cloudinary.com/debnyyphn/image/upload/v1758534963/Facebook_Image_23_bp3ulu.jpg",
		price: 2500000,
	},
	{
		id: "red",
		label: "Red Switch",
		url: "https://res.cloudinary.com/debnyyphn/image/upload/v1758534963/Facebook_Image_22_oxpvxm.jpg",
		price: 2600000,
	},
	{
		id: "brown",
		label: "Brown Switch",
		url: "https://res.cloudinary.com/debnyyphn/image/upload/v1758534963/Facebook_Image_24_ylwk3k.jpg",
		price: 2550000,
	},
];

const sampleRaffleData = {
	id: "raffle-001",
	title: "Premium Mechanical Keyboard - Limited Edition",
	description:
		"Experience ultimate typing comfort with this premium mechanical keyboard featuring custom switches, RGB backlighting, and premium aluminum construction. Perfect for gaming and professional work.",
	// Remove price from here, as each item has its own price now
	// price: 2500000,
	// ticketPrice: 50000,
	totalEntries: 1000,
	joined: 234,
	startDate: "2025-12-01T00:00:00",
	endDate: "2025-12-03T23:59:59",
	status: "active",
	seller: {
		id: "seller-001",
		name: "TechGear Store",
		avatar: LOGO_STORE,
		rating: 4.8,
		totalSales: 1250,
		isVerified: true,
		raffleTimes: 12,
		pastRaffles: 8,
	},
	features: [
		"Premium Cherry MX Switches",
		"RGB Backlighting",
		"Aluminum Construction",
		"Hot-swappable Keys",
		"USB-C Connection",
		"2-Year Warranty",
	],
	images: [
		{
			url: "https://res.cloudinary.com/debnyyphn/image/upload/v1758534963/Facebook_Image_23_bp3ulu.jpg",
			alt: "Premium Mechanical Keyboard - Limited Edition",
		},
		{
			url: "https://res.cloudinary.com/debnyyphn/image/upload/v1758534963/Facebook_Image_22_oxpvxm.jpg",
			alt: "Premium Mechanical Keyboard - Limited Edition",
		},
		{
			url: "https://res.cloudinary.com/debnyyphn/image/upload/v1758534963/Facebook_Image_24_ylwk3k.jpg",
			alt: "Premium Mechanical Keyboard - Limited Edition",
		},
	],
	thumbnail: {
		url: "https://res.cloudinary.com/debnyyphn/image/upload/v1758534963/Facebook_Image_23_bp3ulu.jpg",
		alt: "Premium Mechanical Keyboard - Limited Edition",
	},
	productOptions: optionImages,
};

function RatingStars({ value = 0, max = 5 }) {
	const full = Math.floor(value);
	const half = value % 1 >= 0.5;
	return (
		<div className="flex items-center">
			{Array.from({ length: max }).map((_, i) => (
				<svg
					key={i}
					className={`w-4 h-4 ${
						i < full
							? "text-yellow-400"
							: half && i === full
							? "text-yellow-300"
							: "text-gray-300"
					}`}
					fill="currentColor"
					viewBox="0 0 20 20">
					<polygon points="9.9,1.1 12.3,6.9 18.6,7.6 13.7,11.9 15.2,18.1 9.9,14.7 4.6,18.1 6.1,11.9 1.2,7.6 7.5,6.9 " />
				</svg>
			))}
		</div>
	);
}

interface IProps {
	raffleData?: IBEResponseRaffleInfo;
	isLoading: boolean;
}

export default function RaffleBlock({ raffleData, isLoading }: IProps) {
	const { user } = useAuth() as unknown as { user: IAuthUser | null };
	const { data: raffleInfo, isPending: isFetching } =
		useRaffleFeaturedQueries({
			enabled: Boolean(user),
		});

	console.log("raffleIno", raffleInfo, isFetching);
	const { isOpenDialogLogin } = useDialogLogin();
	const { toggleDialogLogin } = useDialogLoginAction();
	const [showRaffleModal, setShowRaffleModal] = useState(false);
	const [selectedOption, setSelectedOption] = useState(
		optionImages?.[0]?.id || ""
	);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [raffleFormData, setRaffleFormData] = useState<RaffleSubmitForm>({
		fullName: "",
		email: "",
		phone: "",
		address: "",
		city: "",
		// paymentMethod: PaymentMethod.TBD,
		companyName: "",
		zipCode: "",
		// cardNumber: "",
		// expiryDate: "",
		// cvv: "",
		// cardName: "",
		productSelections: (raffleData?.productOptions?.map(
			(option, index) => ({
				productId: option.id,
				name: option.label,
				priority: null,
				selected: false,
				price: option.price,
				thumbnail: option.thumbnail, // Add the required thumbnail property
			})
		) || []) as ProductSelection[],
		note: "",
		shippingMethod: { name: "", price: null },
		raffleId: raffleData?.raffleId || "",
	});

	const [minPrice, maxPrice] = useMemo(() => {
		return [
			Math.min(...optionImages.map((o) => o.price)),
			Math.max(...optionImages.map((o) => o.price)),
		];
	}, [optionImages]);

	// Find the selected option object for price display
	const selectedOptionObj =
		optionImages.find((o) => o.id === selectedOption) || optionImages[0];

	const statusRaffleBasingTime = useMemo(() => {
		const now = new Date();
		const start = new Date(raffleData?.startDate || "");
		const end = new Date(raffleData?.endDate || "");

		if (now < start) return EnumRaffleStatus.UPCOMING;
		if (now >= start && now <= end) return EnumRaffleStatus.ACTIVE;
		if (now > end) return EnumRaffleStatus.COMPLETED;

		return EnumRaffleStatus.CANCELLED;
	}, [raffleData?.startDate, raffleData?.endDate]);

	// Sync image with option
	useEffect(() => {
		const idx = optionImages.findIndex((o) => o.id === selectedOption);
		if (idx !== -1) setCurrentImageIndex(idx);
	}, [selectedOption]);

	useEffect(() => {
		// Reset selected option when raffle data changes
		console.log("raffleData", raffleData);
		if (raffleData) {
			setRaffleFormData((prev) => ({
				...prev,
				raffleId: raffleData.raffleId || "",
				productSelections:
					raffleData?.productOptions?.map((option, index) => ({
						productId: option.id,
						name: option.label,
						price: option.price,
						thumbnail: option?.thumbnail || {
							path: "",
							alt: "",
						},
						priority: null,
						selected: false,
					})) || ([] as ProductSelection[]),
			}));
		}
	}, [raffleData]);
	// Sync option with image
	const handleImageChange = (idx: number) => {
		setCurrentImageIndex(idx);
		setSelectedOption(optionImages[idx]?.id || "");
	};

	// const progressPercentage =
	// 	(raffleData.joined / raffleData.totalEntries) * 100;

	const resetAndClose = () => {
		setRaffleFormData({
			fullName: "",
			email: "",
			phone: "",
			address: "",
			city: "",
			productSelections:
				raffleData?.productOptions?.map((option, index) => ({
					productId: option.id,
					name: option.label,
					price: option.price,
					thumbnail: option.thumbnail || {
						path: "",
						alt: "",
					},
					priority: null,
					selected: false,
				})) || ([] as ProductSelection[]),
			companyName: "",
			zipCode: "",
			shippingMethod: { name: "", price: null },
			note: "",
			raffleId: raffleData?.raffleId || "",
		});
		setShowRaffleModal(false);
	};

	const handleOpenRaffleForm = () => {
		if (!user && !isOpenDialogLogin) {
			toggleDialogLogin(
				isOpenDialogLogin
					? Boolean(EnumStatusDialog.CLOSE)
					: Boolean(EnumStatusDialog.OPEN)
			);
		} else {
			setShowRaffleModal(true);
		}
	};

	const handleInputChange =
		(field: keyof RaffleSubmitForm) =>
		(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			setRaffleFormData((prev) => ({
				...prev,
				[field]: e.target.value,
			}));
		};

	if (isLoading) {
		return (
			<div className="container max-w-7xl mx-auto py-4 !px-0">
				<div className="grid grid-cols-1 md:grid-cols-12 gap-4">
					{/* Left: Image Skeleton */}
					<div className="col-span-8 bg-white rounded-xl shadow p-4 h-[500px] relative">
						<div className="w-full h-full bg-gray-200 animate-pulse rounded-lg"></div>
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
						<div className="w-full h-12 bg-gray-200 animate-pulse rounded-50"></div>
					</div>
				</div>
			</div>
		);
	}

	if (
		!raffleData
		// ||
		// ![EnumRaffleStatus.ACTIVE, EnumRaffleStatus.UPCOMING].includes(
		// 	raffleData.status as EnumRaffleStatus
		// )
	)
		return null;

	return (
		<div className="container max-w-7xl mx-auto py-4 !px-0">
			<div className="grid grid-cols-1 md:grid-cols-12 gap-4">
				{/* Left: Image Swiper */}
				<div className="col-span-8 bg-white rounded-xl shadow flex flex-col items-center justify-center p-4 h-full relative">
					<div className="relative w-full flex items-center justify-center h-full">
						<div className="w-full flex justify-center relative h-full">
							{/* Main Image with thumbnails on the right */}
							<div className="flex w-full h-full">
								<div className="flex-1 flex items-center justify-center relative">
									{optionImages.length ? (
										<button
											type="button"
											onClick={() =>
												handleImageChange(
													(currentImageIndex -
														1 +
														optionImages.length) %
														optionImages.length
												)
											}
											className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 z-10 rounded-full p-1 shadow"
											aria-label="Previous image">
											<ChevronLeft />
										</button>
									) : null}
									{/* Animate image change */}
									<div className="w-full h-full relative">
										{/* Use a key to trigger animation on image change */}
										{/*
											You need to have framer-motion installed and imported:
											import { motion, AnimatePresence } from "framer-motion";
										*/}
										<AnimatePresence
											mode="wait"
											initial={false}>
											<motion.div
												key={
													optionImages[
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
												style={{
													position: "absolute",
												}}>
												<Image
													src={
														optionImages[
															currentImageIndex
														]?.url || ""
													}
													alt={
														optionImages[
															currentImageIndex
														]?.label || ""
													}
													className="w-full object-cover rounded shadow"
													objectFit="cover"
													fill
												/>
											</motion.div>
										</AnimatePresence>
									</div>
									{optionImages.length ? (
										<button
											type="button"
											onClick={() =>
												handleImageChange(
													(currentImageIndex + 1) %
														optionImages.length
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
									{optionImages.map((img, idx) => (
										<img
											key={img.id}
											src={img.url}
											alt={img.label}
											className={`w-16 h-16 object-cover rounded cursor-pointer border-2 ${
												idx === currentImageIndex
													? "border-blue-500"
													: "border-gray-200"
											}`}
											onClick={() =>
												handleImageChange(idx)
											}
										/>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Right: All Information */}
				<div className="col-span-4 bg-white rounded-xl shadow p-4 flex flex-col gap-2 h-full">
					{/* Title, Description, Seller */}
					<div>
						<div className="flex items-center gap-2">
							<RaffleBadge type={raffleData.raffleType} />
							<RaffleStatus
								mode={
									raffleData.status ?? statusRaffleBasingTime
								}
							/>
						</div>
						<div className="text-lg font-bold mt-2">
							{raffleData?.title}
						</div>
						<p
							className="text-gray-700 text-sm mb-2"
							style={{ textIndent: "0.5rem" }}>
							{raffleData?.description}
						</p>
						<Divider className="border-gray-400 my-2" />
						<div className="flex items-center gap-3 mt-2">
							<div className="w-12 h-12 bg-gray-200 rounded-full relative overflow-hidden border border-gray-600">
								<Image
									src={
										raffleData?.seller?.avatar || LOGO_STORE
									}
									alt={
										raffleData?.seller?.name ||
										"Seller Avatar"
									}
									fill
									objectFit="cover"
									className="w-12 h-12 rounded-full"
								/>
							</div>
							<div>
								<div className="flex items-center gap-1">
									<span className="font-semibold text-lg">
										{raffleData?.seller?.name}
									</span>
									{raffleData?.seller?.isVerified && (
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
								<div className="flex items-center gap-1 text-gray-700 text-sm">
									<span className="text-sm">
										Tổng số raffle:{" "}
										<span className="font-semibold text-sm">
											{raffleData?.seller?.raffleTimes}
										</span>
									</span>
								</div>
							</div>
						</div>
					</div>
					<Divider className="border-gray-400 my-2" />
					{/* Countdown */}
					<RaffleCountDown
						startDate={raffleData.startDate}
						endDate={raffleData.endDate}
						raffleStatus={raffleData.status as EnumRaffleStatus}
						className="text-center"
					/>
					{/* <Divider className="border-gray-400 my-2" /> */}

					{/* Option Select (sync with image) */}
					<div>
						<div className="font-semibold mb-1 flex items-center justify-between overflow-hidden">
							<span className="min-w-[90px] text-lg">
								Sản phẩm
							</span>
							<Divider className="border-gray-400 w-[80%]" />
						</div>
						<div className="text-base font-bold flex items-center gap-1">
							<Dot size={20} strokeWidth={2} />
							{selectedOptionObj?.label} -&nbsp;
							{formatCurrency(selectedOptionObj?.price || 0)}
						</div>
						<div className="flex gap-2 flex-wrap mt-2">
							{optionImages.map((opt) => (
								<button
									key={opt.id}
									type="button"
									onClick={() => {
										setSelectedOption(opt.id);
										setCurrentImageIndex(
											optionImages.findIndex(
												(o) => o.id === opt.id
											)
										);
									}}
									className={`relative p-0.5 rounded-full border font-medium transition overflow-hidden w-[80px] h-[80px] ${
										selectedOption === opt.id
											? "text-white border-blue-600"
											: "text-gray-700 border-gray-300 hover:bg-gray-100"
									} cursor-pointer`}>
									<Image
										src={opt.url}
										alt={opt.label}
										objectFit="cover"
										fill
										className="w-[80px] h-[80px] rounded-full cursor-pointer border-2"
									/>
								</button>
							))}
						</div>
					</div>

					{/* Features */}
					<div>
						<div className="font-semibold mb-1 flex items-center justify-between overflow-hidden">
							<span className="min-w-[90px] text-lg">
								Thông tin
							</span>
							<Divider className="border-gray-400 w-[80%]" />
						</div>
						<div className="flex flex-col gap-1">
							{raffleData.features
								.slice(0, 4)
								.map((feature, idx) => (
									<div
										key={idx}
										className="flex items-center gap-1">
										<Dot size={20} strokeWidth={2} />
										<span className="text-gray-700 text-base">
											{feature}
										</span>
									</div>
								))}
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

					{/* Join Button */}
					<button
						type="button"
						onClick={handleOpenRaffleForm}
						disabled={
							raffleData?.status !== EnumRaffleStatus.ACTIVE ||
							statusRaffleBasingTime !== EnumRaffleStatus.ACTIVE
						}
						className={`flex items-center justify-center gap-2 w-full py-3 rounded-50 text-white font-semibold text-base transition ${
							raffleData?.status === EnumRaffleStatus.ACTIVE ||
							statusRaffleBasingTime === EnumRaffleStatus.ACTIVE
								? "bg-red-400 hover:bg-red-500"
								: "bg-gray-400 cursor-not-allowed"
						}`}>
						{raffleData.status === EnumRaffleStatus.UPCOMING ||
						statusRaffleBasingTime === EnumRaffleStatus.UPCOMING
							? "Chưa bắt đầu"
							: null}
						{raffleData.status === EnumRaffleStatus.ACTIVE ||
						statusRaffleBasingTime === EnumRaffleStatus.ACTIVE
							? "Tham gia Raffle"
							: null}
						{raffleData.status === EnumRaffleStatus.COMPLETED ||
						statusRaffleBasingTime === EnumRaffleStatus.COMPLETED
							? "Đã kết thúc"
							: null}
					</button>
				</div>
			</div>
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
				className="max-w-max mt-4 px-6 py-3 rounded-50 bg-gradient-to-r from-pink-500 via-red-400 to-yellow-400 text-white font-bold text-base shadow-lg flex items-center gap-2 group focus:outline-none mx-auto"
				onClick={() => (window.location.href = "/raffles")}>
				<motion.span
					animate={{
						rotate: [0, 15, -15, 0],
						scale: [1, 1.2, 1.2, 1],
					}}
					transition={{
						repeat: Infinity,
						repeatType: "loop",
						duration: 1.2,
						ease: "easeInOut",
					}}
					className="transition-transform group-hover:scale-110">
					🎉
				</motion.span>
				<motion.span
					initial={{ opacity: 0, x: 10 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.4, duration: 0.4 }}
					className="drop-shadow-sm text-white">
					Xem thêm các raffle khác
				</motion.span>
				<motion.span
					initial={{ x: 0 }}
					whileHover={{ x: 8 }}
					transition={{ type: "spring", stiffness: 300, damping: 18 }}
					className="ml-1 flex items-center">
					<ChevronRight className="transition-transform" />
				</motion.span>
			</motion.button>

			{/* Raffle Entry Modal */}
			<Stepper
				raffleId={raffleData?.raffleId}
				raffleFormSubmit={raffleFormData}
				open={showRaffleModal}
				onClose={() => setShowRaffleModal(false)}
				initialStep={1}
				onStepChange={(step) => {
					console.log(step);
				}}
				onFinalStepCompleted={resetAndClose}
				backButtonText="Quay lại"
				nextButtonText="Tiếp theo">
				<Step name="Thông tin">
					<StepInformation
						raffleData={raffleData}
						minPrice={minPrice}
						maxPrice={maxPrice}
					/>
				</Step>
				<Step name="Lựa chọn">
					<StepSelectProduct
						raffleFormSubmit={raffleFormData}
						setRaffleFormSubmit={setRaffleFormData}
						raffleData={raffleData}
					/>
				</Step>
				<Step name="Địa chỉ">
					<StepDeliveryInfo
						raffleFormSubmit={raffleFormData}
						setRaffleFormSubmit={setRaffleFormData}
						raffleData={raffleData}
						handleInputChange={handleInputChange}
					/>
				</Step>
				<Step name="Xác nhận">
					<StepConfirmation raffleFormSubmit={raffleFormData} />
				</Step>
			</Stepper>
		</div>
	);
}
