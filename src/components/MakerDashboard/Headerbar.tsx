import React, { use } from "react";
import { Search, Bell, Mail } from "lucide-react";
import Image from "next/image";
import { NEW_MISSING_IMAGE } from "@/constants/Images";
import { useAuth } from "@/context/Auth";
import useMakerQuery from "@/react-query/makers/api/useMakerQuery";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "../ReUIComponent/Popover";
import { Button } from "../ReUIComponent";

const Headerbar = () => {
	const auth = useAuth();
	const { user } = auth || {};
	const { data: maker } = useMakerQuery({
		params: { makerId: user?.makerId },
		enabled: !!user?.makerId,
	});

	return (
		<div className="flex items-center justify-between bg-gray-50 p-4 shadow-md rounded-lg">
			{/* Search Bar */}
			<div className="flex items-center bg-white rounded-full shadow-md px-4 py-2 w-1/3">
				<Search className="text-gray-500" />
				<input
					type="text"
					placeholder="Search task"
					className="ml-2 w-full focus:outline-none text-sm text-gray-700"
				/>
				<span className="text-gray-400 text-xs ml-2">⌘F</span>
			</div>

			{/* Action Buttons */}
			<div className="flex items-center gap-4">
				<Popover>
					<PopoverTrigger asChild>
						<Button className="w-8 h-8 p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
							<Mail className="" size={16} />
						</Button>
					</PopoverTrigger>
					<PopoverContent
						className="max-w-75 text-sm space-y-2"
						side="top">
						{/* Title */}
						<p className="font-medium">Premium Plan</p>
						{/* Description */}
						<p className="text-muted-foreground">
							Advanced analytics provides deeper insights into
							your data, including trends, predictions, and
							detailed user behavior.
						</p>
					</PopoverContent>
				</Popover>
				<Popover>
					<PopoverTrigger asChild>
						<Button className="w-8 h-8 p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
							<Bell className="" size={16} />
						</Button>
					</PopoverTrigger>
					<PopoverContent
						className="max-w-75 text-sm space-y-2"
						side="top">
						{/* Title */}
						<p className="font-medium">Premium Plan</p>
						{/* Description */}
						<p className="text-muted-foreground">
							Advanced analytics provides deeper insights into
							your data, including trends, predictions, and
							detailed user behavior.
						</p>
					</PopoverContent>
				</Popover>

				{/* Maker Dropdown */}
				<div className="flex items-center gap-2 cursor-pointer">
					<div className="relative w-10 h-10 rounded-full overflow-hidden">
						<Image
							src={NEW_MISSING_IMAGE}
							alt="Maker Avatar"
							fill
							style={{ objectFit: "cover" }}
						/>
					</div>
					<div className="text-sm">
						<p className="font-semibold capitalize text-sm">
							{maker?.ownerName}
						</p>
						<p className="text-gray-400 text-xs">{maker?.email}</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Headerbar;
