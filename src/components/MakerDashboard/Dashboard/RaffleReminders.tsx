import { Button } from "@/components/ReUIComponent";
import { Headset, Plus } from "lucide-react";
import React from "react";

const RaffleReminders = () => {
	const reminders = [
		{
			title: "Trao đổi với NoobStore",
			time: "29/02/2026, 02:00 pm - 04:00 pm",
			description:
				"Tham gia cuộc họp để thảo luận về các cơ hội hợp tác và phát triển dự án.",
		},
		{
			title: "Trao đổi với NoobStore",
			time: "31/02/2026, 02:00 pm - 04:00 pm",
			description:
				"Tham gia cuộc họp để thảo luận về các cơ hội hợp tác và phát triển dự án.",
		},
	];

	return (
		<div className="p-4 bg-white rounded-lg shadow-md h-full space-y-4 flex-1 flex flex-col">
			<div className="flex items-center justify-between">
				<div className="text-lg font-bold">Hỗ trợ và góp ý</div>
				<Button className="" variant="secondary" size="icon">
					<Plus size={16} />
				</Button>
			</div>
			<div className="flex-1 min-h-0 overflow-y-auto space-y-4">
				{reminders.map((reminder, index) => (
					<div
						key={index}
						className="rounded-lg flex flex-col items-start gap-4 bg-gray-100 p-4">
						<div className="space-y-1">
							<p className="text-lg font-semibold text-green-800 leading-tight line-clamp-2">
								{reminder.title}
							</p>
							<p className="text-gray-500 text-sm">
								{reminder.time}
							</p>
							<span className="text-xs tracking-tight italic line-clamp-2">
								{reminder.description}
							</span>
						</div>
						<Button
							variant="primary"
							fontSize="lg"
							className="w-full">
							<Headset />
							&nbsp;&nbsp;Tham gia
						</Button>
					</div>
				))}
			</div>
		</div>
	);
};

export default RaffleReminders;
