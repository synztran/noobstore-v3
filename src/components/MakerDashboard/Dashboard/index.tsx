import React from "react";
import RaffleStats from "./RaffleStats";
import RaffleAnalytics from "./RaffleAnalytics";
import RaffleReminders from "./RaffleReminders";
import RaffleList from "./RaffleList";
import TeamCollaboration from "./TeamCollaboration";
import RaffleProgress from "./RaffleProgress";
import TimeTracker from "./TimeTracker";
import { Button } from "@/components/ReUIComponent";
import { Plus } from "lucide-react";
import RaffleClock from "./TimeTracker";
import { useAuth } from "@/context/Auth";
import useMakerQuery from "@/react-query/makers/api/useMakerQuery";

const MakerDashboardComp = () => {
	const auth = useAuth();
	const { user } = auth || {};
	const { data: maker, isLoading } = useMakerQuery({
		params: { makerId: user?.makerId },
		enabled: !!user?.makerId,
	});
	return (
		<div className="p-4 bg-gray-50 rounded-lg shadow-md space-y-4">
			<header className="flex justify-between items-center">
				<div>
					<h1 className="text-2xl font-bold">Bảng thống kê</h1>
					<p className="text-gray-400 text-sm ">
						Thông tin được cập nhật gần đây nhất
					</p>
				</div>
				<div className="flex gap-4 items-center">
					{/* <Button variant="primary" fontSize="sm">
						<Plus />
						&nbsp;Tạo Raffle
					</Button> */}
					<Button variant={"secondary"} fontSize="sm">
						<Plus />
						&nbsp; Tạo Sản phẩm
					</Button>
				</div>
			</header>

			<div className="grid grid-cols-12 gap-2">
				<div className="col-span-12">
					<RaffleStats makerId={user?.makerId} />
				</div>
				<div className="col-span-12 grid grid-cols-12 gap-2">
					<div className="col-span-9 space-y-2">
						<div className="grid grid-cols-12 gap-2">
							<div className="col-span-7 flex h-80">
								<RaffleAnalytics />
							</div>
							<div className="col-span-5 flex h-80">
								<RaffleReminders />
							</div>
						</div>
						<div className="grid grid-cols-12 gap-2">
							<div className="col-span-7 flex h-80">
								<TeamCollaboration />
							</div>
							<div className="col-span-5 flex h-80">
								<RaffleProgress />
							</div>
						</div>
					</div>
					<div className="col-span-3 flex flex-col gap-2">
						<RaffleList />
						<RaffleClock />
					</div>
				</div>
			</div>
		</div>
	);
};

export default MakerDashboardComp;
