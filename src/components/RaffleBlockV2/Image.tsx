import { NEW_MISSING_IMAGE } from "@/constants/Images";
import { EnumRaffleStatus } from "@/interface/Client/Raffle";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { memo } from "react";
import { Button } from "../ReUIComponent";

interface IProps {
	productOptions: any[];
	currentImageIndex: number;
	onChange: (index: number) => void;
	status: string;
}

const RaffleBlockV2Image = ({
	productOptions,
	currentImageIndex,
	onChange,
	status,
}: IProps) => {
	console.log(status);
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
				{productOptions?.length > 1 ? (
					<button
						type="button"
						onClick={() =>
							onChange(
								(currentImageIndex -
									1 +
									productOptions?.length) %
									productOptions?.length,
							)
						}
						className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 z-10 rounded-full p-1 shadow"
						aria-label="Previous image">
						<ChevronLeft />
					</button>
				) : null}
				{/* Animate image change */}
				<div className="w-full h-full relative">
					<AnimatePresence mode="wait" initial={false}>
						<motion.div
							key={productOptions?.[currentImageIndex]?.id}
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
								const length = productOptions?.length ?? 0;
								if (!length) return;

								// Slide left -> next image
								if (info.offset.x < -threshold) {
									onChange((currentImageIndex + 1) % length);
									return;
								}
								// Slide right -> prev image
								if (info.offset.x > threshold) {
									onChange(
										(currentImageIndex - 1 + length) %
											length,
									);
									return;
								}
							}}
							whileTap={{ cursor: "grabbing" }}>
							<Image
								src={
									productOptions?.[currentImageIndex]
										?.thumbnail?.path || NEW_MISSING_IMAGE
								}
								alt={
									productOptions?.[currentImageIndex]
										?.label || ""
								}
								className="w-full object-cover rounded-tl-md rounded-bl-md shadow-lg select-none"
								objectFit="cover"
								fill
								draggable={false}
							/>
						</motion.div>
					</AnimatePresence>
				</div>
				{productOptions?.length > 1 ? (
					<Button
						type="button"
						onClick={() =>
							onChange(
								(currentImageIndex + 1) %
									productOptions?.length,
							)
						}
						className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 z-10 rounded-full p-1 shadow"
						aria-label="Next image">
						<ChevronRight />
					</Button>
				) : null}
			</div>
			{/* Swiper Thumbnails on the right */}
			<div className="flex flex-col gap-2 mx-2 items-center justify-start">
				{productOptions?.map((opt, idx) => (
					<div
						className="relative w-20 h-20 rounded-md shadow-sm"
						key={idx}>
						<Image
							key={opt.id}
							src={opt.thumbnail?.path || NEW_MISSING_IMAGE}
							alt={opt.label || ""}
							fill
							objectFit="cover"
							className={`rounded-lg cursor-pointer border-2 ${
								idx === currentImageIndex
									? "border-red-400"
									: "border-gray-200"
							}`}
							onClick={() => onChange(idx)}
						/>
					</div>
				))}
			</div>
		</div>
	);
};

export default memo(RaffleBlockV2Image);
