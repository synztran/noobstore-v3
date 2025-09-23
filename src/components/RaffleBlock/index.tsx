import React, { useEffect, useMemo, useState } from "react";
import {
	AccessTime,
	People,
	Star,
	ChevronLeft,
	ChevronRight,
	ShoppingBag,
	Verified,
} from "@mui/icons-material";
import RaffleEntryModal from "./RaffleEntryModal";
import Image from "next/image";
import RaffleCountDown from "./RaffleCountDown";
import { RaffleData } from "@/interface/Raffle";
import RaffleBadge from "./RaffleBadge";
import { LOGO_STORE } from "@/constants/Images";
import { Check, CircleCheck, Dot, Mail, Sparkles } from "lucide-react";
import { Divider } from "@mui/material";
import { formatCurrency } from "@/utils/FormatNumber";

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
	const [timeLeft, setTimeLeft] = useState({
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
	});
	const [raffleStatus, setRaffleStatus] = useState("running");
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

	return (
		<div className="container mx-auto py-4 !px-0">
			<div className="grid grid-cols-1 md:grid-cols-12 gap-4">
				{/* Block 1: Title, Description, Seller */}
				<div className="md:col-span-3">
					<div className="bg-white rounded-xl shadow p-4 flex flex-col gap-4 h-full">
						<div>
							<h2 className="text-2xl font-bold mb-2">
								<RaffleBadge type="raffle" />
								&nbsp;
								{raffleData.title}
							</h2>
							<p
								className="text-gray-700 text-lg mb-2 leading-relaxed"
								style={{ textIndent: "0.5rem" }}>
								{raffleData.description}
							</p>
						</div>
						<Divider className="border-gray-400" />
						<div className="flex items-center gap-3">
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
										<Verified className="stroke-green-600 fill-green-600 w-6 h-6" />
									)}
								</div>
								<RatingStars value={raffleData.seller.rating} />
							</div>
						</div>
						<div className="flex flex-col gap-1 mt-2">
							<div className="flex items-center gap-1 text-gray-700 text-sm">
								<People className="w-6 h-6" />
								<span className="text-base">
									Tổng số raffle:{" "}
									<span className="font-semibold text-base">
										{raffleData.seller.raffleTimes}
									</span>
								</span>
							</div>
							{/* <div className="flex items-center gap-1 text-gray-700 text-sm">
								<AccessTime fontSize="small" />
								<span className="text-lg">
									Số raffles: {raffleData.seller.pastRaffles}
								</span>
							</div> */}
							{/* <div className="flex items-center gap-1 text-gray-700 text-sm">
								<Mail className="w-6 h-6" />
								<div className="text-lg flex items-center gap-1">
									Mail:{" "}
									<div className="inline-flex items-center gap-1 border border-white bg-green-600 rounded-md px-2 py-1 font-bold text-white text-base">
										Đã xác thực
										<CircleCheck className="w-6 h-6 stroke-white" />
									</div>
								</div>
							</div> */}
						</div>
					</div>
				</div>

				{/* Block 2: Center Image Swiper */}
				<div className="md:col-span-6">
					<div className="bg-white rounded-xl shadow flex flex-col items-center justify-center p-4 h-full relative">
						<div className="relative w-full flex items-center justify-center h-full">
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
							<div className="w-full flex justify-center relative h-full">
								<Image
									src={
										optionImages[currentImageIndex]?.url ||
										""
									}
									alt={
										optionImages[currentImageIndex]
											?.label || ""
									}
									className="w-full object-cover rounded shadow"
									objectFit="cover"
									fill
								/>
							</div>
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
						</div>
						{/* Swiper Thumbnails */}
						<div className="flex gap-2 mt-4">
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
									onClick={() => handleImageChange(idx)}
								/>
							))}
						</div>
					</div>
				</div>

				{/* Block 3: Countdown, Options, Price, Features, Join */}
				<div className="md:col-span-3">
					<div className="bg-white rounded-xl shadow p-4 flex flex-col gap-4 h-full">
						{/* Countdown */}
						<RaffleCountDown
							startDate={raffleData.startDate}
							endDate={raffleData.endDate}
							raffleStatus={
								raffleStatus as "upcoming" | "running" | "ended"
							}
							className="text-center"
						/>
						<Divider className="border-gray-400" />

						{/* Option Select (sync with image) */}
						<div>
							<span className="text-xl font-medium mb-1 block">
								Lựa chọn
							</span>
							<div className="flex gap-2 flex-wrap">
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
										{/* Show price on each option */}
										{/* <span
											className="absolute bottom-1 left-1 right-1 bg-white bg-opacity-80 text-xs text-green-700 font-semibold rounded px-1 py-0.5 text-center pointer-events-none"
											style={{
												fontSize: "12px",
												lineHeight: "1.1",
											}}>
											{formatPrice(opt.price)}
										</span> */}
									</button>
								))}
							</div>
						</div>

						{/* Price */}
						<div>
							<div className="text-lg font-bold text-green-600">
								{formatCurrency(selectedOptionObj?.price || 0)}
							</div>
							{/* <div className="text-gray-500 text-sm">
								Prize Value
							</div>
							<div className="text-gray-500 text-sm">
								Ticket Price:{" "}
								{formatPrice(raffleData.ticketPrice)}
							</div> */}
						</div>

						{/* Features */}
						<>
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
											<Sparkles className="w-4 h-4" />
											<span className="text-gray-700 text-base">
												{feature}
											</span>
										</div>
									))}
							</div>
						</>

						{/* Progress */}
						<div>
							<div className="flex items-center justify-between mb-1">
								<span className="text-base text-black">
									{/* {raffleData.soldTickets} /{" "}
									{raffleData.totalTickets} lượt tham gia */}
									{raffleData.joined} lượt tham gia
								</span>
								{/* <span className="text-sm font-semibold">
									{progressPercentage.toFixed(1)}%
								</span> */}
							</div>
							{/* <div className="w-full bg-gray-200 rounded-sm h-2">
								<div
									className="bg-red-400 h-2 rounded-sm transition-all duration-300"
									style={{ width: `${progressPercentage}%` }}
								/>
							</div> */}
						</div>

						{/* Join Button */}
						<button
							type="button"
							onClick={() => setShowRaffleModal(true)}
							disabled={raffleStatus !== "running"}
							className={`flex items-center justify-center gap-2 w-full py-3 mt-2 rounded-50 text-white font-semibold text-base transition ${
								raffleStatus === "running"
									? "bg-red-400 hover:bg-red-500"
									: "bg-gray-400 cursor-not-allowed"
							}`}>
							{/* <ShoppingBag /> */}
							{raffleStatus === "running"
								? "Tham gia Raffle"
								: raffleStatus === "upcoming"
								? "Chưa bắt đầu"
								: "Đã kết thúc"}
						</button>
					</div>
				</div>
			</div>

			{/* Raffle Entry Modal */}
			<RaffleEntryModal
				open={showRaffleModal}
				onClose={() => setShowRaffleModal(false)}
				raffleData={raffleData as unknown as RaffleData}
				minPrice={minPrice}
				maxPrice={maxPrice}
			/>
		</div>
	);
}
