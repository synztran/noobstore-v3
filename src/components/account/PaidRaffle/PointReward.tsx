import CountUp from "@/components/CountingNumber";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ReUIComponent/Tooltip";
import { STORE_POINT_ICON } from "@/constants/Images";
import Image from "next/image";

interface IProps {
	points: number;
	makerName?: string;
}

const RafflePaidPointReward: React.FC<IProps> = ({ points, makerName }) => {
	if (points <= 0) return null;
	return (
		<div className="border-2 border-gray-200 p-4 rounded-lg space-y-4">
			<div className="text-lg font-semibold text-gray-500 tracking-wide mb-4">
				Điểm thưởng
			</div>
			<div className="flex items-start justify-between gap-4 ">
				<div className="flex flex-col">
					<strong className="">Hoàn thành raffle</strong>
					<small className="text-xs">
						Bạn đã hoàn thành đơn hàng raffle từ{" "}
						<strong className="text-black">{makerName}</strong>
					</small>
				</div>
				<div className="flex items-center gap-1 max-w-max flex-nowrap text-sm">
					<strong className="text-green-600 inline-flex">
						+
						<CountUp
							to={points}
							duration={1}
							className="inline-block"
						/>
					</strong>

					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<div className="relative w-6 h-6">
									<Image
										src={STORE_POINT_ICON}
										objectFit="cover"
										alt="noobstore point"
										fill
									/>
								</div>
							</TooltipTrigger>
							<TooltipContent side="top">
								<p>Dùng điểm NoobStore để đổi lấy các ưu đãi</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
			</div>
		</div>
	);
};

export default RafflePaidPointReward;
