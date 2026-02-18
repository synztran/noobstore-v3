import { NEW_MISSING_IMAGE } from "@/constants/Images";
import {
	EnumRaffleStatus,
	IBEResponseProductOption,
} from "@/interface/Client/Raffle";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { memo } from "react";
import { Button } from "../ReUIComponent";

interface IProps {
	productOptions: IBEResponseProductOption[];
	combinedProductImages: {
		productId?: string;
		index: number;
		path: string;
		alt: string;
	}[];
	currentImageIndex: number;
	onChange: (imageIndex: number, productId?: string) => void;
	status: string;
}

const RaffleBlockV2Image = ({
	productOptions,
	combinedProductImages,
	currentImageIndex,
	onChange,
	status,
}: IProps) => {
	console.log("currentImageIndexcurrentImageIndex", currentImageIndex);

	return (
		<div className="w-full flex justify-center relative h-full max-h-max">
			<div className="flex-1 flex items-center justify-center relative">
				<div className="absolute top-4 left-4 z-10">
					<span
						className={`px-2 py-1 text-lg font-semibold rounded ${
							status === EnumRaffleStatus.ONGOING
								? "bg-green-100 text-green-800"
								: status === EnumRaffleStatus.UPCOMING
									? "bg-yellow-100 text-yellow-800"
									: "bg-gray-100 text-gray-800"
						}`}>
						{status === EnumRaffleStatus.ONGOING
							? "Đang diễn ra"
							: status === EnumRaffleStatus.UPCOMING
								? "Sắp diễn ra"
								: "Đã kết thúc"}
					</span>
				</div>
				{combinedProductImages?.length > 1 ? (
					<Button
						variant="icon"
						size="icon"
						onClick={() =>
							onChange(
								(currentImageIndex -
									1 +
									combinedProductImages?.length) %
									combinedProductImages?.length,
							)
						}
						className="absolute left-2 top-1/2 -translate-y-1/2"
						aria-label="Previous image">
						<ChevronLeft />
					</Button>
				) : null}
				{/* Animate image change */}
				<div className="w-full h-full relative">
					<AnimatePresence mode="wait" initial={false}>
						<motion.div
							key={
								combinedProductImages?.[currentImageIndex]
									?.index
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
									combinedProductImages?.length ?? 0;
								if (!length) return;

								// Slide left -> next image
								if (info.offset.x < -threshold) {
									const nextIndex =
										(currentImageIndex + 1) % length;
									const nextImage =
										combinedProductImages[nextIndex];
									console.log("next", nextIndex);
									onChange(nextIndex, nextImage?.productId);
									return;
								}
								// Slide right -> prev image
								if (info.offset.x > threshold) {
									const prevIndex =
										(currentImageIndex - 1 + length) %
										length;
									const prevImage =
										combinedProductImages[prevIndex];
									console.log("prev", prevIndex);
									onChange(prevIndex, prevImage?.productId);
									return;
								}
							}}
							whileTap={{ cursor: "grabbing" }}>
							<Image
								src={
									combinedProductImages?.[currentImageIndex]
										?.path || NEW_MISSING_IMAGE
								}
								alt={
									combinedProductImages?.[currentImageIndex]
										?.path || ""
								}
								className="w-full object-left rounded-tl-md rounded-bl-md shadow-lg select-none"
								fill
								draggable={false}
							/>
						</motion.div>
					</AnimatePresence>
				</div>
				{combinedProductImages?.length > 1 ? (
					<Button
						size="icon"
						variant="icon"
						onClick={() =>
							onChange(
								(currentImageIndex + 1) %
									combinedProductImages?.length,
							)
						}
						className="absolute right-2 top-1/2 -translate-y-1/2"
						aria-label="Next image">
						<ChevronRight />
					</Button>
				) : null}
			</div>
			{/* Swiper Thumbnails on the right */}
			<div className="flex flex-col gap-2 mx-2 items-center justify-start">
				{combinedProductImages?.map((opt) => (
					<div
						className="relative w-20 h-20 rounded-md shadow-sm"
						key={opt.index}>
						<Image
							src={opt?.path || NEW_MISSING_IMAGE}
							alt={opt?.alt || ""}
							fill
							objectFit="contain"
							className={`rounded-lg cursor-pointer border-2 ${
								opt.index === currentImageIndex
									? "border-blue-600"
									: "border-gray-200"
							}`}
							onClick={() => onChange(opt.index, opt.productId)}
						/>
					</div>
				))}
			</div>
		</div>
	);
};

export default memo(RaffleBlockV2Image);
