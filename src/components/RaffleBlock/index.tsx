import React, { useEffect, useMemo, useState } from "react";
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
import { FormData, PaymentMethod, RaffleData } from "@/interface/Raffle";
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
	startDate: "2025-10-01T00:00:00",
	endDate: "2025-10-15T23:59:59",
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

export default function RaffleBlock({ raffleData = sampleRaffleData }) {
	const [showRaffleModal, setShowRaffleModal] = useState(false);
	const [selectedOption, setSelectedOption] = useState(
		optionImages?.[0]?.id || ""
	);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [raffleStatus, setRaffleStatus] = useState("running");
	const [raffleFormData, setRaffleFormData] = useState<FormData>({
		...raffleData,
		fullName: "",
		email: "",
		phone: "",
		address: "",
		city: "",
		paymentMethod: PaymentMethod.CREDIT_CARD,
		companyName: "",
		zipCode: "",
		cardNumber: "",
		expiryDate: "",
		cvv: "",
		cardName: "",
		productSelections:
			raffleData.productOptions?.map((option, index) => ({
				productId: option.id,
				name: option.label,
				priority: null,
				selected: false,
				price: option.price,
				thumbnail: option.url, // Add the required thumbnail property
			})) || [],
		note: "",
		shippingMethod: { brand: "", price: 0 },
	});
	console.log("raffleFormData", raffleFormData);
	const [minPrice, maxPrice] = useMemo(() => {
		return [
			Math.min(...optionImages.map((o) => o.price)),
			Math.max(...optionImages.map((o) => o.price)),
		];
	}, [optionImages]);

	// Find the selected option object for price display
	const selectedOptionObj =
		optionImages.find((o) => o.id === selectedOption) || optionImages[0];

	// Sync image with option
	useEffect(() => {
		const idx = optionImages.findIndex((o) => o.id === selectedOption);
		if (idx !== -1) setCurrentImageIndex(idx);
	}, [selectedOption]);

	// Sync option with image
	const handleImageChange = (idx: number) => {
		setCurrentImageIndex(idx);
		setSelectedOption(optionImages[idx]?.id || "");
	};

	const progressPercentage =
		(raffleData.joined / raffleData.totalEntries) * 100;

	const resetAndClose = () => {
		setRaffleFormData({
			fullName: "",
			email: "",
			phone: "",
			address: "",
			city: "",
			paymentMethod: PaymentMethod.CREDIT_CARD,
			cardNumber: "",
			expiryDate: "",
			cvv: "",
			cardName: "",
			productSelections:
				raffleData.productOptions?.map((option, index) => ({
					productId: option.id,
					name: option.label,
					price: option.price,
					thumbnail: option.url,
					priority: null,
					selected: false,
				})) || [],
			companyName: "",
			zipCode: "",
			shippingMethod: { brand: "VNPost", price: 0 },
			note: "",
		});
		setShowRaffleModal(false);
	};

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
							<RaffleBadge type="raffle" />
							<RaffleStatus mode="upcoming" />
						</div>
						<div className="text-lg font-bold mt-2">
							{raffleData.title}
						</div>
						<p
							className="text-gray-700 text-sm mb-2"
							style={{ textIndent: "0.5rem" }}>
							{raffleData.description}
						</p>
						<Divider className="border-gray-400 my-2" />
						<div className="flex items-center gap-3 mt-2">
							<div className="w-12 h-12 bg-gray-200 rounded-full relative overflow-hidden border border-gray-600">
								<Image
									src={raffleData.seller.avatar}
									alt={raffleData.seller.name}
									fill
									objectFit="cover"
									className="w-12 h-12 rounded-full"
								/>
							</div>
							<div>
								<div className="flex items-center gap-1">
									<span className="font-semibold text-lg">
										{raffleData.seller.name}
									</span>
									{raffleData.seller.isVerified && (
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
											{raffleData.seller.raffleTimes}
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
						raffleStatus={
							raffleStatus as "upcoming" | "running" | "ended"
						}
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
						onClick={() => setShowRaffleModal(true)}
						disabled={raffleStatus !== "running"}
						className={`flex items-center justify-center gap-2 w-full py-3 rounded-50 text-white font-semibold text-base transition ${
							raffleStatus === "running"
								? "bg-red-400 hover:bg-red-500"
								: "bg-gray-400 cursor-not-allowed"
						}`}>
						{raffleStatus === "running"
							? "Tham gia Raffle"
							: raffleStatus === "upcoming"
								? "Chưa bắt đầu"
								: "Đã kết thúc"}
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
				raffleData={raffleFormData as unknown as RaffleData}
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
						formData={raffleFormData}
						raffleData={raffleData as unknown as RaffleData}
						minPrice={minPrice}
						maxPrice={maxPrice}
					/>
				</Step>
				<Step name="Lựa chọn">
					<StepSelectProduct
						formData={raffleFormData}
						setFormData={setRaffleFormData}
						raffleData={raffleData as unknown as RaffleData}
					/>
				</Step>
				<Step name="Địa chỉ">
					<StepDeliveryInfo
						formData={raffleFormData}
						setFormData={setRaffleFormData}
						raffleData={raffleData as unknown as RaffleData}
					/>
				</Step>
				<Step name="Xác nhận">
					<StepConfirmation formData={raffleFormData} />
				</Step>
			</Stepper>
		</div>
	);
}
