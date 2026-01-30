import { NEW_MISSING_IMAGE } from "@/constants/Images";
import { TResponseRaffleEntry } from "@/interface/Context/auth";
import Image from "next/image";
import { memo } from "react";

interface IProps {
	maker: TResponseRaffleEntry["makerInfo"];
}
const RafflePaidMaker: React.FC<IProps> = ({ maker }) => {
	return (
		<div className="rounded-lg p-4 border border-gray-200 space-y-4 shadow-sm max-h-max">
			<div className="text-lg font-semibold text-gray-500 tracking-wide">
				Thông tin maker
			</div>
			<div className="oveflow-y-auto">
				<div className="flex items-center justify-between gap-8">
					<div className="font-bold">{maker?.brandName}</div>
					<div className="min-w-12 max-w-12 w-12 h-12 relative overflow-hidden">
						<Image
							src={maker?.logo?.path || NEW_MISSING_IMAGE}
							alt={maker?.brandName || "Maker Logo"}
							fill
							objectFit="cover"
							className="rounded-full"
						/>
					</div>
				</div>
				<div className="space-y-2">
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
		</div>
	);
};

export default memo(RafflePaidMaker);
