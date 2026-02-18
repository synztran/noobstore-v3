import { IBEResponseRaffleInfo } from "@/interface/Client/Raffle";

interface RaffleShippingProps {
	raffle: IBEResponseRaffleInfo;
}

export const RaffleShipping = ({ raffle }: RaffleShippingProps) => {
	const expectedDate = raffle.expectedDeliveryAt
		? new Date(raffle.expectedDeliveryAt).toLocaleDateString("en-US", {
				year: "numeric",
				month: "short",
				day: "numeric",
			})
		: "To be announced";

	return (
		<div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm">
			<div className="flex gap-4 items-start">
				<div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
					🚚
				</div>
				<div className="flex-1">
					<h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-1">
						Estimated Delivery
					</h4>
					<p className="text-sm text-amber-600 font-semibold">
						{expectedDate}
					</p>
					<p className="text-xs text-slate-500 mt-2">
						Winners will be notified via email with shipping details
					</p>
				</div>
			</div>
		</div>
	);
};
