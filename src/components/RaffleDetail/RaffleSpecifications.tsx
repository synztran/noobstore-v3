import { IBEResponseRaffleInfo } from "@/interface/Client/Raffle";

interface RaffleSpecificationsProps {
	raffle: IBEResponseRaffleInfo;
}

interface SpecItem {
	label: string;
	value: string | number;
	icon: string;
}

export const RaffleSpecifications = ({ raffle }: RaffleSpecificationsProps) => {
	const specs: SpecItem[] = [
		{
			label: "Kích Thước Lô",
			value: "Chỉ 50 Cái",
			icon: "📦",
		},
		{
			label: "Ngày Phát Hành",
			value: raffle.endAt
				? new Date(raffle.endAt).toLocaleDateString("vi-VN", {
						year: "numeric",
						month: "short",
						day: "numeric",
					})
				: "TBD",
			icon: "📅",
		},
		{
			label: "Loại Trục",
			value: "Tương Thích MX",
			icon: "⌨️",
		},
		{
			label: "Kiểu Dáng",
			value: "Cherry R1 (Hàng Esc)",
			icon: "📏",
		},
	];

	return (
		<section>
			<h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2">
				<span>⚙️</span> Specifications
			</h3>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{specs.map((spec, idx) => (
					<div
						key={idx}
						className="flex items-center p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-amber-400/40 transition-all group shadow-sm">
						<div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mr-4 group-hover:bg-amber-200 transition-colors">
							<span className="text-lg">{spec.icon}</span>
						</div>
						<div>
							<p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-0.5">
								{spec.label}
							</p>
							<p className="text-sm font-bold text-slate-900">
								{spec.value}
							</p>
						</div>
					</div>
				))}
			</div>
		</section>
	);
};
