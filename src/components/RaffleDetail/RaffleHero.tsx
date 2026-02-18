import { NEW_MISSING_IMAGE } from "@/constants/Images";
import { IBEResponseRaffleInfo } from "@/interface/Client/Raffle";
import Image from "next/image";
import { useState } from "react";
import type { Swiper as SwiperInstance } from "swiper";
import "swiper/css";
import "swiper/css/effect-fade";
import { Autoplay, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

interface RaffleHeroProps {
	raffle: IBEResponseRaffleInfo;
	thumbnailImages?: { path: string; alt: string }[];
	onThumbnailClick?: (index: number) => void;
	selectedImageIndex?: number;
}

export const RaffleHero = ({
	raffle,
	thumbnailImages = [],
	onThumbnailClick,
	selectedImageIndex = 0,
}: RaffleHeroProps) => {
	const [swiperInstance, setSwiperInstance] = useState<SwiperInstance | null>(
		null,
	);
	const heroImage =
		raffle.thumbnail?.path || raffle.images?.[0]?.path || NEW_MISSING_IMAGE;
	const heroSlides =
		thumbnailImages.length > 0
			? thumbnailImages
			: [{ path: heroImage, alt: raffle.title }];
	const clampedIndex = Math.min(
		Math.max(selectedImageIndex, 0),
		heroSlides.length - 1,
	);
	const handleThumbnailClick = (index: number) => {
		swiperInstance?.slideTo(index);
		onThumbnailClick?.(index);
	};
	const galleryIndex = Math.min(2, heroSlides.length - 1);

	return (
		<div className="w-full h-[50vh] relative overflow-hidden group">
			{/* Gradient Overlays */}

			{/* Background Slider */}
			<div className="absolute inset-0 z-0">
				<Swiper
					className="h-full w-full"
					modules={[Autoplay, EffectFade]}
					effect="fade"
					slidesPerView={1}
					initialSlide={clampedIndex}
					autoplay={{
						delay: 5000,
						disableOnInteraction: false,
					}}
					speed={1000}
					allowTouchMove
					onSwiper={setSwiperInstance}
					onSlideChange={(swiper) =>
						onThumbnailClick?.(swiper.activeIndex)
					}>
					{heroSlides.map((img, idx) => (
						<SwiperSlide key={`hero-${idx}`}>
							<Image
								key={idx}
								src={img.path || NEW_MISSING_IMAGE}
								alt={img.alt || raffle.title}
								className="w-1/2 h-fit object-cover transform group-hover:scale-105 transition-transform duration-2000"
								fill
								priority={idx === 0}
							/>
						</SwiperSlide>
					))}
				</Swiper>
			</div>

			{/* Bottom Section with Content & Thumbnails */}
			<div className="absolute left-0 w-full z-20 bottom-8">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end justify-between">
					{/* Left: Title & Badges */}
					<div className="flex-1">
						<div className="flex gap-3 mb-4">
							<span className="bg-amber-500 text-white px-3 py-1 rounded text-xs font-black uppercase tracking-widest shadow-lg">
								★ Small Batch
							</span>
							<span className="bg-white/80 backdrop-blur-md text-slate-800 px-3 py-1 rounded text-xs font-bold uppercase tracking-widest border border-white/60">
								Hand-Cast
							</span>
						</div>
						<h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-none tracking-tight mb-2 drop-shadow-sm">
							{raffle.title}
						</h1>
						<p className="text-xl text-slate-600 font-medium max-w-2xl drop-shadow-sm">
							{raffle.description}
						</p>
					</div>

					{/* Right: Thumbnail Gallery */}
					<div className="hidden md:flex gap-3">
						{heroSlides.slice(0, 2).map((img, idx) => (
							<button
								key={idx}
								onClick={() => handleThumbnailClick(idx)}
								className={`w-20 h-20 rounded-lg border-2 overflow-hidden cursor-pointer transition-all shadow-lg ${
									idx === clampedIndex
										? "border-amber-500"
										: "border-white/60 hover:border-amber-400"
								}`}>
								<Image
									src={img.path || NEW_MISSING_IMAGE}
									alt={img.alt}
									width={80}
									height={80}
									className="w-full h-full object-cover"
								/>
							</button>
						))}
						<button
							onClick={() => handleThumbnailClick(galleryIndex)}
							className="w-20 h-20 rounded-lg border-2 border-white/60 overflow-hidden cursor-pointer hover:border-amber-400 transition-all shadow-lg bg-white flex items-center justify-center">
							<div className="text-center">
								<div className="text-amber-500 text-lg">🖼️</div>
								<span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
									Gallery
								</span>
							</div>
						</button>
					</div>
				</div>
			</div>
			<div className="absolute w-full bg-linear-to-t from-slate-50 via-slate-50/60 to-transparent z-10 h-40 bottom-0" />
			{/* <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-amber-200/40 via-transparent to-transparent z-0" /> */}
		</div>
	);
};
