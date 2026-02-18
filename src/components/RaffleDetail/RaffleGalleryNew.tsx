import { NEW_MISSING_IMAGE } from "@/constants/Images";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface GalleryImage {
	path: string;
	alt: string;
}

interface RaffleGalleryProps {
	images: GalleryImage[];
}

export const RaffleGallery = ({ images }: RaffleGalleryProps) => {
	const [currentImageIndex, setCurrentImageIndex] = useState(0);

	const handlePrevious = () => {
		setCurrentImageIndex(
			(currentImageIndex - 1 + images.length) % images.length,
		);
	};

	const handleNext = () => {
		setCurrentImageIndex((currentImageIndex + 1) % images.length);
	};

	if (images.length === 0) {
		return (
			<section>
				<h3 className="text-2xl font-bold text-white mb-6">Hình ảnh</h3>
				<div className="w-full h-96 rounded-lg bg-gray-800 border border-white/10 flex items-center justify-center">
					<p className="text-stone-400">Không có hình ảnh</p>
				</div>
			</section>
		);
	}

	return (
		<section>
			<h3 className="text-2xl font-bold text-white mb-6">Hình ảnh</h3>
			<div className="flex gap-6">
				{/* Main Image */}
				<div className="flex-1 relative h-96 rounded-lg overflow-hidden bg-gray-800 group border border-white/10">
					<Image
						src={
							images?.[currentImageIndex]?.path ||
							NEW_MISSING_IMAGE
						}
						alt={images?.[currentImageIndex]?.alt || ""}
						fill
						className="object-cover group-hover:scale-105 transition-transform duration-300"
					/>
					{images.length > 1 && (
						<>
							<button
								onClick={handlePrevious}
								className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors">
								<ChevronLeft size={20} />
							</button>
							<button
								onClick={handleNext}
								className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors">
								<ChevronRight size={20} />
							</button>
						</>
					)}
				</div>

				{/* Thumbnail Gallery */}
				<div className="flex flex-col gap-3 overflow-y-auto max-h-96">
					{images.map((img, idx) => (
						<button
							key={idx}
							onClick={() => setCurrentImageIndex(idx)}
							className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
								currentImageIndex === idx
									? "border-amber-500 ring-2 ring-amber-500/50"
									: "border-white/10 hover:border-white/30"
							}`}>
							<Image
								src={img.path || NEW_MISSING_IMAGE}
								alt={img.alt}
								fill
								className="object-cover"
							/>
						</button>
					))}
				</div>
			</div>
		</section>
	);
};
