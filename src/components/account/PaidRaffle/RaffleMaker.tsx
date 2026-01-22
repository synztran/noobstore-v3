import { NEW_MISSING_IMAGE } from "@/constants/Images";
import { TResponseRaffleEntry } from "@/interface/Context/auth";
import Image from "next/image";
import { memo } from "react";

interface IProps {
	maker: TResponseRaffleEntry["makerInfo"];
}
const RafflePaidMaker: React.FC<IProps> = ({ maker }) => {
	return (
		<div className="rounded-lg p-4 border border-gray-200 shadow-sm space-y-8 max-h-max">
			<div className="flex items-center justify-between gap-16">
				<div className="font-bold text-lg">{maker?.brandName}</div>
				<div className="min-w-14 max-w-14 w-14 h-14 relative overflow-hidden">
					<Image
						src={maker?.logo?.path || NEW_MISSING_IMAGE}
						alt={maker?.brandName || "Maker Logo"}
						fill
						objectFit="cover"
						className="rounded-md"
					/>
				</div>
			</div>
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<span>Số lượt host</span>
					<span>xxx</span>
				</div>
				<div className="flex items-center justify-between">
					<span>Ngày tham gia</span>
					<span>xxx</span>
				</div>
			</div>
		</div>
	);
};

export default memo(RafflePaidMaker);
