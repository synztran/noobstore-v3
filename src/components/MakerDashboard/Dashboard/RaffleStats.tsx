import { Button } from "@/components/ReUIComponent";
import useMakerAnalyticsQuery from "@/react-query/makers/api/useMakerDashboardQueries";
import { CircularProgress } from "@mui/material";
import { Minus, MoveUpRight, TrendingDown, TrendingUp } from "lucide-react";
import React from "react";
import { start } from "repl";

enum EnumStatus {
	positive,
	negative,
	neutral,
}

const mappingStatusIcon = {
	[EnumStatus.positive]: {
		icon: TrendingUp,
		color: "text-green-400",
		border: "border border-green-400",
	},
	[EnumStatus.negative]: {
		icon: TrendingDown,
		color: "text-red-400",
		border: "border border-red-400",
	},
	[EnumStatus.neutral]: {
		icon: Minus,
		color: "text-gray-400",
		border: "border border-gray-400",
	},
};

interface IProps {
	makerId?: string;
}

const RaffleStats = ({ makerId }: IProps) => {
	const { data: dashboardStats, isLoading } = useMakerAnalyticsQuery({
		params: { makerId: makerId || "" },
		enabled: !!makerId,
	});
	const stats = [
		{
			label: "Tổng số Raffles",
			value: dashboardStats?.totalRaffles || 0,
			statusText: "Increased from last month",
			isHighlighted: true,
			status: EnumStatus.positive,
			statusValue: 0,
		},
		{
			label: "Raffles đã kết thúc",
			value: dashboardStats?.endedRaffles || 0,
			statusText: "Increased from last month",
			status: EnumStatus.negative,
			statusValue: 0,
		},
		{
			label: "Raffles đang chạy",
			value: dashboardStats?.runningRaffles || 0,
			statusText: "Increased from last month",
			status: EnumStatus.neutral,
			statusValue: 0,
		},
		{
			label: "Đơn chưa thanh toán",
			value: dashboardStats?.unpaidCustomers || 0,
			statusText: "On Discuss",
			status: EnumStatus.neutral,
			statusValue: 0,
		},
	];

	console.log("dashboardStats", dashboardStats);

	return (
		<div className="w-full flex gap-2">
			{stats.map((stat, index) => (
				<div
					key={index}
					className={`w-1/4 p-4 rounded-lg shadow-md ${stat.isHighlighted ? "bg-linear-to-t from-green-700 to-green-900" : "bg-white"} hover:shadow-lg hover:cursor-pointer transition-shadow duration-200 space-y-2`}>
					<div className={`flex justify-between items-center`}>
						<strong
							className={`${stat.isHighlighted ? "text-white" : "text-black"}`}>
							{stat.label}
						</strong>
						<Button className="w-8 h-8 p-1 bg-white rounded-full border border-black hover:scale-105 transition-transform duration-200">
							<MoveUpRight size={14} />
						</Button>
					</div>
					<div
						className={`text-5xl font-bold ${stat.isHighlighted ? "text-white" : "text-black"}`}>
						{isLoading ? (
							<CircularProgress color="secondary" size={32} />
						) : (
							stat.value
						)}
					</div>
					<div
						className={`text-sm ${stat.isHighlighted ? "text-white" : "text-gray-500"} flex items-center gap-1`}>
						<div
							className={`flex items-center gap-1 ${mappingStatusIcon[stat.status].color} ${mappingStatusIcon[stat.status].border} rounded-sm px-1 py-.5`}>
							<span>{stat.statusValue}</span>
							{mappingStatusIcon[stat.status].icon &&
								React.createElement(
									mappingStatusIcon[stat.status].icon,
									{
										size: 12,
										className: "",
									},
								)}
						</div>
						<span
							className={`${mappingStatusIcon[stat.status].color} text-xs`}>
							{stat.statusText}
						</span>
					</div>
				</div>
			))}
		</div>
	);
};

export default RaffleStats;
