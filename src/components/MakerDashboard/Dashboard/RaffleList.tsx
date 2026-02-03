import { Button } from "@/components/ReUIComponent";
import { NEW_MISSING_IMAGE } from "@/constants/Images";
import { Plus } from "lucide-react";
import Image from "next/image";
import React from "react";

const RaffleList = () => {
	const raffles = [
		{
			name: "Develop API Endpoints",
			dueDate: "Nov 25, 2024",
			thumbnail: "",
		},
		{ name: "Onboarding Flow", dueDate: "Nov 30, 2024 - 11:00 AM" },
		{ name: "Build Dashboard", dueDate: "Dec 1, 2024" },
		{ name: "Optimize Page Load", dueDate: "Dec 5, 2024" },
		{ name: "Cross-Browser Testing", dueDate: "Dec 6, 2024" },
	];

	return (
		<div className="p-4 bg-white rounded-lg shadow-md flex-2 space-y-4">
			<div className="flex items-center justify-between gap-4">
				<div className="text-lg font-bold">Raffles</div>
				<Button variant="primary" size="sm" fontSize="xs">
					<Plus size={16} />
					&nbsp;Tạo mới
				</Button>
			</div>
			<ul className="relative clear-both space-y-2">
				{raffles.map((raffle, index) => (
					<li key={index} className="flex items-center gap-2">
						<div className="w-12 h-12 relative">
							<Image
								src={raffle.thumbnail || NEW_MISSING_IMAGE}
								alt={raffle.name}
								className="rounded-full"
								fill
								objectFit="cover"
							/>
						</div>
						<div className="flex flex-col">
							<span className="text-sm font-semibold line-clamp-1">
								{raffle.name}
							</span>
							<span className="text-xs text-gray-500">
								{raffle.dueDate}
							</span>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};

export default RaffleList;
