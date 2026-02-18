import { IBEResponseRaffleInfo } from "@/interface/Client/Raffle";
import Image from "next/image";

interface RaffleMakerProps {
	raffle: IBEResponseRaffleInfo;
}

export const RaffleMaker = ({ raffle }: RaffleMakerProps) => {
	const makerInfo = raffle.makerInfo;
	if (!makerInfo) return null;

	return (
		<section className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-8 border-b border-slate-200">
			<div className="relative group cursor-pointer">
				<Image
					src={
						makerInfo.logo?.path || "https://via.placeholder.com/96"
					}
					alt={makerInfo.brandName || "Maker"}
					width={96}
					height={96}
					className="w-24 h-24 rounded-2xl border-2 border-amber-500/30 shadow-md group-hover:border-amber-500 transition-colors object-cover"
				/>
				<div className="absolute -bottom-2 -right-2 bg-white text-amber-600 p-1.5 rounded-full border border-amber-200 group-hover:scale-110 transition-transform shadow-sm">
					<span className="text-base">✓</span>
				</div>
			</div>
			<div className="flex-1">
				<p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-1 flex items-center gap-1">
					🎨 Nghệ Nhân Tạo Tác
				</p>
				<h3 className="text-3xl font-black text-slate-900">
					{makerInfo.brandName || "Artisan"}
				</h3>
				<p className="text-sm text-slate-600 mt-2 leading-relaxed">
					{makerInfo.bio ||
						"Crafting unique artisan pieces with passion and precision."}
				</p>
			</div>
		</section>
	);
};
