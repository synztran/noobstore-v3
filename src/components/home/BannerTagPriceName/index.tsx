import React from "react";
import Image from "next/image";
import {
	KEYBOARD_FILCO,
	KEYBOARD_TGR_910,
	LOGO_STORE,
	NEW_MISSING_IMAGE,
	SWITCH_BCP,
} from "@/constants/Images";
import { Hammer, Star } from "lucide-react";
import { formatCurrency } from "@/utils/FormatNumber";

// You can replace the below image constants with your actual images from storage/constants/images/index.js
const KEYCAPS_V3_IMAGE = NEW_MISSING_IMAGE;
const CUSTOMIZE_KEYBOARD_IMAGE = NEW_MISSING_IMAGE;

// Data for the cards, easy to change later
const featuredProduct = {
	tag: "NEW",
	title: "TGR 910 ME V2",
	price: "$450.99",
	image: KEYBOARD_TGR_910,
};

const featuredSwitches = [
	{
		brand: "Kailh",
		name: "Moon V2 Linear Switches",
		price: 6000,
		image: SWITCH_BCP,
		rating: {
			stars: 4.5,
			reviews: 100,
		},
	},
	{
		brand: "Kailh",
		name: "Salmon Tactile Switch",
		price: 6000,
		image: SWITCH_BCP,
		rating: {
			stars: 4.5,
			reviews: 100,
		},
	},
	{
		brand: "Kailh",
		name: "Hippo Linear Switches",
		price: 6000,
		image: SWITCH_BCP,
		rating: {
			stars: 4.5,
			reviews: 100,
		},
	},
];

const customizeSection = {
	title: (
		<div className="text-center text-2xl" style={{ lineHeight: 1 }}>
			<span
				className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent text-2xl font-bold"
				style={{ lineHeight: 1 }}>
				Customize
			</span>
			&nbsp;your dream keyboard
		</div>
	),
	description: "Choose from various layouts, switches and keycaps.",
	buttonText: "Start building",
	image: CUSTOMIZE_KEYBOARD_IMAGE,
};

const BannerTagPriceName = () => {
	return (
		<div className="w-full grid grid-cols-3 gap-4 justify-center items-stretch">
			<div
				className="flex-1 rounded-2xl shadow-md px-4 pt-4 flex flex-col items-center relative min-w-[260px] max-w-[340px] gap-2"
				style={{
					background:
						"linear-gradient(135deg, #fee2e2 0%, #fef2f2 60%, #fee2e2 100%)",
				}}>
				<div className="relative mr-auto">
					<span className="bg-white text-black text-[10px] font-bold px-3 py-1 rounded-lg shadow-sm border border-gray-400">
						{featuredProduct.tag}
					</span>
				</div>
				<div
					className="text-2xl font-semibold text-center px-8"
					style={{ lineHeight: 1 }}>
					{featuredProduct.title}
				</div>
				<div className="text-gray-500 font-bold text-base">
					{featuredProduct.price}
				</div>

				<div className="w-full flex-1 flex items-end justify-center relative mt-6">
					<Image
						src={featuredProduct.image}
						alt={featuredProduct.title}
						layout="fill"
						objectFit="conver"
					/>
				</div>
			</div>

			{/* Middle Card: Featured Switches */}
			<div className="bg-[#f6f5f8] rounded-2xl shadow-md p-4 gap-2 grid">
				<div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold w-fit opacity-0 h-[24px]" />
				<div className="flex flex-col items-center">
					<span
						className="text-2xl font-bold text-gray-600"
						style={{ lineHeight: 1 }}>
						Featured
					</span>
					<span
						className="text-2xl font-bold text-black"
						style={{ lineHeight: 1 }}>
						Switches
					</span>
				</div>

				{/* Container for switches */}
				<div className="grid grid-rows-3 gap-3 my-4">
					{featuredSwitches.map((sw, idx) => (
						<div
							key={idx}
							className="grid grid-cols-[60px_1fr] items-center bg-white rounded-md shadow-sm p-1 gap-2 cursor-pointer hover:shadow-lg transition-all duration-300">
							<div className="relative rounded-md bg-gray-200 p-2 w-full h-full min-h-[60px]">
								<Image
									src={sw.image}
									alt={sw.name}
									objectFit="cover"
									layout="fill"
									className="object-contain rounded"
								/>
							</div>
							<div className="flex-1">
								<div className="flex items-center gap-2">
									<div className="text-xs text-gray-500 font-bold">
										{sw.brand}
									</div>
									<div
										className="flex items-center gap-1 text-[10px]"
										style={{ lineHeight: 1 }}>
										<Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
										<span className="text-[10px]">
											{sw.rating.stars}
										</span>
										<span className="text-[10px]">
											({sw.rating.reviews})
										</span>
									</div>
								</div>
								<div className="font-medium text-sm">
									{sw.name}
								</div>
								<div className="text-xs text-gray-700 font-bold">
									{formatCurrency(sw.price)}
								</div>
							</div>
						</div>
					))}
				</div>

				{/* Help section */}
				<div className="flex items-center justify-center gap-4 my-4">
					<div className="relative w-10 h-10">
						<Image
							src={LOGO_STORE}
							alt="help"
							objectFit="cover"
							layout="fill"
							className="rounded-full"
						/>
					</div>
					<div className="flex flex-col">
						<span className="font-semibold">Need some help?</span>
						<a
							href="#"
							className="decoration-none text-blue-500 font-bold text-sm"
							style={{ lineHeight: 1 }}>
							We're here to help
						</a>
					</div>
				</div>
			</div>

			{/* Right Card: Customize Section */}
			<div className="flex-1 bg-white rounded-2xl shadow-md p-6 flex flex-col items-center min-w-[260px] max-w-[340px] relative">
				<div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold w-fit opacity-0 h-[24px]" />
				<div
					aria-hidden
					className="pointer-events-none absolute inset-0 rounded-2xl"
					style={{
						padding: 2,
						background:
							"linear-gradient(135deg, #5B8CFF 0%, #C26EFF 100%)",
						WebkitMask:
							"linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
						WebkitMaskComposite: "xor",
						maskComposite: "exclude",
					}}
				/>
				<div className="relative z-10 w-full">
					<div className="text-xl font-bold mb-4 text-center">
						{customizeSection.title}
					</div>
					<div className="text-center text-gray-600 mb-4">
						{customizeSection.description}
					</div>
					<div className="flex justify-center">
						<button
							className="inline-flex items-center gap-2 px-4 py-2 rounded-50 font-semibold text-blue-600 bg-white relative transition"
							style={{
								border: "2px solid transparent",
								backgroundImage:
									"linear-gradient(white, white), linear-gradient(90deg, #5B8CFF 0%, #C26EFF 100%)",
								backgroundOrigin: "border-box",
								backgroundClip: "padding-box, border-box",
							}}>
							<Hammer />
							{customizeSection.buttonText}
						</button>
					</div>
					<div className="relative w-full h-full">
						<Image
							src={KEYBOARD_FILCO}
							alt="keyboard"
							objectFit="cover"
							layout="fill"
							className="object-contain"
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default BannerTagPriceName;
