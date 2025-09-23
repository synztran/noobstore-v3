import React from "react";
import { IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight, FavoriteBorder } from "@mui/icons-material";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Image from "next/image";
import clsx from "classnames";
import { formatCurrency } from "@/utils/FormatNumber";
import RatingComponent from "../productCard/rating";

interface CategoryItem {
	id: string | number;
	brand: string;
	name: string;
	price: number;
	image: string;
	rating: {
		stars: number;
		reviews: number;
	};
	reviews: number;
	quantity: number;
}

interface CategoryWithTitleAndActionProps {
	title: React.ReactNode;
	action?: React.ReactNode;
	items: CategoryItem[];
}

const fakeItems: CategoryItem[] = [
	{
		id: 1,
		brand: "Kinetic Labs",
		name: "Gecko Silent Linear",
		price: 6000,
		image: "/images/bcp.webp",
		reviews: 24,
		quantity: 4,
		rating: {
			stars: 5,
			reviews: 24,
		},
	},
	{
		id: 2,
		brand: "Kinetic Labs",
		name: "Gecko Silent Linear",
		price: 6000,
		image: "/images/karina65.webp",
		rating: {
			stars: 5,
			reviews: 24,
		},
		reviews: 24,
		quantity: 4,
	},
	{
		id: 3,
		brand: "Kinetic Labs",
		name: "Gecko Silent Linear",
		price: 7500,
		image: "/images/tgr_910.webp",
		rating: {
			stars: 5,
			reviews: 24,
		},
		reviews: 24,
		quantity: 4,
	},
	{
		id: 4,
		brand: "Kinetic Labs",
		name: "Gecko Silent Linear",
		price: 8000,
		image: "/images/filco.webp",
		rating: {
			stars: 5,
			reviews: 24,
		},
		reviews: 24,
		quantity: 4,
	},
	{
		id: 5,
		brand: "Kinetic Labs",
		name: "Gecko Silent Linear",
		price: 5500,
		image: "/images/filco.webp",
		rating: {
			stars: 5,
			reviews: 24,
		},
		reviews: 24,
		quantity: 4,
	},
	{
		id: 6,
		brand: "Kinetic Labs",
		name: "Gecko Silent Linear",
		price: 5500,
		image: "/images/filco.webp",
		rating: {
			stars: 5,
			reviews: 24,
		},
		reviews: 24,
		quantity: 4,
	},
];

const CategoryWithTitleAndAction: React.FC<CategoryWithTitleAndActionProps> = ({
	title,
	action,
	items,
}) => {
	const swiperRef = React.useRef<any>(null);

	return (
		<div className="w-full bg-white rounded-xl shadow-none p-4">
			{/* Header */}
			<div className="flex items-center justify-between mb-2 px-2">
				<div className="flex items-center gap-2">
					<span className="font-semibold text-xl text-black">
						{title}
					</span>
					<span className="text-gray-500 text-lg font-normal">
						from each category
					</span>
				</div>
				<div>
					{action ? (
						action
					) : (
						<button className="text-sm px-3 py-1 rounded-50 border border-gray-200 text-gray-700 hover:bg-gray-100 transition">
							Shop all
						</button>
					)}
				</div>
			</div>
			{/* Swiper Controls */}
			<div className="relative">
				<IconButton
					className={clsx(
						"absolute z-10 top-1/2 -left-3.5 -translate-y-1/2 bg-white shadow border border-gray-200",
						"hover:shadow-lg"
					)}
					onClick={() => swiperRef.current?.slidePrev()}
					size="small"
					aria-label="Previous">
					<ChevronLeft />
				</IconButton>
				<IconButton
					className={clsx(
						"absolute z-10 top-1/2 -right-3.5 -translate-y-1/2 bg-white shadow border border-gray-200",
						"hover:bg-gray-100"
					)}
					onClick={() => swiperRef.current?.slideNext()}
					size="small"
					aria-label="Next">
					<ChevronRight />
				</IconButton>
				{/* Swiper */}
				<Swiper
					breakpoints={{
						320: { slidesPerView: 1.2 },
						480: { slidesPerView: 2 },
						640: { slidesPerView: 2.5 },
						768: { slidesPerView: 3.5 },
						1440: { slidesPerView: 5 },
					}}
					spaceBetween={8}
					loop={true}
					onSwiper={(swiper) => {
						swiperRef.current = swiper;
					}}
					className="mt-3">
					{fakeItems.map((item) => (
						<SwiperSlide key={item.id} className="p-0.5">
							<div className="bg-[#f6f5f8] rounded-xl p-2 flex flex-col gap-3 relative group hover:shadow-md hover:shadow-gray-300 transition min-h-[420px] cursor-pointer">
								<div>
									<div className="flex items-center justify-between">
										<span className="text-sm text-gray-500 font-bold">
											{item.brand}
										</span>
										<button className="rounded-full">
											<FavoriteBorder
												fontSize="small"
												className="text-gray-400"
											/>
										</button>
									</div>
									<span className="text-base font-semibold text-black leading-tight">
										{item.name}
									</span>
									<RatingComponent
										star={item.rating.stars}
										reviewer={item.rating.reviews || 0}
									/>
								</div>

								{/* Product Image */}
								<div className="flex justify-center items-center flex-1 relative">
									<Image
										src={item.image}
										alt={item.name}
										fill
										className="object-contain"
									/>
								</div>
								<div className="flex flex-col">
									{item.quantity && (
										<span className="text-sm text-gray-600">
											{item.quantity} stocks
										</span>
									)}
									<span className="text-lg font-bold text-black mt-auto">
										{formatCurrency(item.price)}
									</span>
								</div>
							</div>
						</SwiperSlide>
					))}
				</Swiper>
			</div>
		</div>
	);
};

export default CategoryWithTitleAndAction;
