import {
	I3D_CONFETTI_POPPER,
	I3D_FIREWORK_GUN,
	I3D_FIREWORKS_SHOW,
	I3D_PAPER_STAR,
	I3D_SHERIFF_STAR,
	I3D_WINNER_CUP,
} from "@/constants/Images";
import { IBEResponseRaffleProductSelection } from "@/interface/Client/Raffle";
import { formatCurrency } from "@/utils/FormatNumber";
import Image from "next/image";

interface IProps {
	winningProduct: IBEResponseRaffleProductSelection;
}

const RaffleProductWin = ({ winningProduct }: IProps) => {
	return (
		<div className="px-4 py-3 h-fit bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 rounded-lg border-2 border-yellow-300 shadow-lg relative overflow-hidden">
			{/* Animated background shine effect */}
			<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse pointer-events-none" />

			<div className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 via-orange-600 to-pink-600 relative z-10">
				🎉 Chúc mừng! Bạn đã trúng raffle 🎉
			</div>

			<div className="flex gap-4 relative z-10 mt-2">
				{/* Winning Product Image with glow */}
				<div className="relative">
					<div className="absolute -inset-2 bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-400 rounded-lg opacity-75 animate-glowPulse blur-sm " />
					<div className="w-20 h-20 relative">
						<Image
							src={winningProduct?.thumbnail?.path || ""}
							alt={
								winningProduct?.thumbnail?.alt ||
								"Winning product"
							}
							fill
							className="object-cover rounded-lg hover:scale-110 transition-all duration-300 shadow-xl scale-105"
						/>
					</div>

					{/* Floating sparkles around image */}
					<div className="absolute -top-3 -left-3 text-xl animate-rotateLoop">
						<Image
							src={I3D_PAPER_STAR}
							alt="sparkle"
							width={22}
							height={22}
						/>
					</div>
					<div
						className="absolute -bottom-4 -right-5 text-xl animate-scaleUpDown"
						style={{ animationDelay: "0.3s" }}>
						<Image
							src={I3D_FIREWORK_GUN}
							alt="sparkle"
							width={40}
							height={40}
							className="scale-110"
						/>
					</div>
					<div
						className="absolute -top-2 -right-3 text-xl animate-bounce"
						style={{ animationDelay: "0.6s" }}>
						<Image
							src={I3D_SHERIFF_STAR}
							alt="sparkle"
							width={24}
							height={24}
						/>
					</div>
					<div
						className="absolute -bottom-4 -left-5 text-xl animate-scaleUpDown"
						style={{ animationDelay: "0.6s" }}>
						<Image
							src={I3D_CONFETTI_POPPER}
							alt="sparkle"
							width={40}
							height={40}
						/>
					</div>
				</div>
				{/* Product Info */}
				<div className="flex flex-col justify-between relative z-10">
					<div className="block">
						<div className="font-bold text-gray-800 text-sm">
							{winningProduct?.name}
						</div>
						<div className="text-black font-bold text-xs w-fit">
							{formatCurrency(winningProduct?.price)}
						</div>
					</div>
					<div className="text-sm mt-auto text-gray-700 font-semibold">
						Dự kiến giao:&nbsp;
						<strong className="text-lg text-orange-600">
							24 tháng 5 2025
						</strong>
					</div>
				</div>
			</div>

			{/* Trophy Icon */}
			<div
				className="absolute top-2 right-2 text-3xl animate-bounce"
				style={{ animationDelay: "0.2s" }}>
				<Image
					src={I3D_WINNER_CUP}
					alt="trophy"
					width={40}
					height={40}
				/>
			</div>
		</div>
	);
};

export default RaffleProductWin;
