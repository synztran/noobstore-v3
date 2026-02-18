import { IBEResponseRaffleInfo } from "@/interface/Client/Raffle";

interface RaffleRulesProps {
	raffle: IBEResponseRaffleInfo;
}

export const RaffleRules = ({ raffle }: RaffleRulesProps) => {
	if (!raffle.rules) {
		return null;
	}

	return (
		<section>
			<h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
				� Rules & Terms
			</h3>
			<div className="bg-black/40 border border-amber-900/20 rounded-xl p-6 space-y-4">
				<div className="prose prose-invert max-w-none">
					<p className="text-stone-300 whitespace-pre-wrap leading-relaxed text-sm">
						{raffle.rules}
					</p>
				</div>
			</div>
		</section>
	);
};
