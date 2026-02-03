import React, { useState } from "react";
import {
	ListChecks,
	CalendarDays,
	BarChart,
	Users,
	Settings,
	HelpCircle,
	LogOut,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";
import useMakerQuery from "@/react-query/makers/api/useMakerQuery";
import { Button } from "../ReUIComponent";
import { useAuth } from "@/context/Auth";
import {
	I3D_NUMBER_RAFFLE_WHEEL,
	MAKER_CALENDAR_ICON,
	MAKER_CUSTOMER_ICON,
	MAKER_DASHBOARD_ICON,
	MAKER_EXIST_ICON,
	MAKER_GROUP_ICON,
	MAKER_QUESTION_ICON,
	MAKER_SETTING_ICON,
	NEW_MISSING_IMAGE,
} from "@/constants/Images";
import Image from "next/image";

interface IProps {
	isExpanded?: boolean;
	handleToggle?: () => void;
}

const SideMenu = ({ isExpanded, handleToggle }: IProps) => {
	const auth = useAuth();
	const { user } = auth || {};
	const [selectedItem, setSelectedItem] = useState("dashboard");
	const { data: maker, isLoading } = useMakerQuery({
		params: { makerId: user?.makerId },
		enabled: !!user?.makerId,
	});

	const menuItems = [
		{ icon: MAKER_DASHBOARD_ICON, label: "Thông kê", id: "dashboard" },
		{
			icon: I3D_NUMBER_RAFFLE_WHEEL,
			label: "Danh sách raffle",
			id: "list",
		},
		{ icon: MAKER_CUSTOMER_ICON, label: "Khách hàng", id: "raffles" },
		{ icon: MAKER_CALENDAR_ICON, label: "Lịch trình", id: "calendar" },
		{ icon: MAKER_GROUP_ICON, label: "Team", id: "team" },
	];

	const generalItems = [
		{ icon: MAKER_SETTING_ICON, label: "Thiết lập", id: "settings" },
		{ icon: MAKER_QUESTION_ICON, label: "Trợ giúp", id: "help" },
		{ icon: MAKER_EXIST_ICON, label: "Đăng xuất", id: "logout" },
	];

	const handleItemClick = (id: string) => {
		setSelectedItem(id);
	};

	return (
		<div
			className={`bg-gray-100 rounded-xl h-screen p-4 flex flex-col justify-between ${
				isExpanded ? "w-full" : "w-20"
			} transition-all duration-300`}>
			{/* Header */}
			<div className="flex items-center justify-between gap-1">
				<div className="flex items-center gap-2">
					<div className="relative w-12 h-12 rounded-full overflow-hidden">
						<Image
							src={maker?.logo?.path || NEW_MISSING_IMAGE}
							alt={maker?.logo?.alt || "Maker Logo"}
							fill
							objectFit="cover"
						/>
					</div>
					{isExpanded && (
						<h1 className="text-lg font-bold capitalize">
							{maker?.brandName}
						</h1>
					)}
				</div>
				<Button onClick={handleToggle} className="px-1">
					{isExpanded ? <ChevronLeft /> : <ChevronRight />}
				</Button>
			</div>

			{/* Menu */}
			<div className="mt-4">
				<div className="text-lg font-semibold text-gray-500 mb-2 uppercase">
					Danh mục
				</div>
				<ul className="space-y-2">
					{menuItems.map((item, index) => (
						<li
							key={index}
							onClick={() => handleItemClick(item.id)}
							className={`relative flex items-center gap-2 cursor-pointer ${
								selectedItem === item.id
									? "font-semibold"
									: "text-gray-500 hover:text-green-600"
							} `}>
							{item.id === selectedItem ? (
								<div className="absolute -left-4 w-1.5 h-[110%] rounded-tr-2xl rounded-br-2xl bg-linear-to-l from-green-600 to-green-700" />
							) : null}
							<div
								className={`w-8 h-8 relative ${!isExpanded ? "mx-auto" : ""}`}>
								<Image
									src={item.icon}
									alt={item.label}
									objectFit="cover"
									fill
									className={`${selectedItem === item.id ? "" : "grayscale-100"}`}
								/>
							</div>
							{isExpanded && <span>{item.label}</span>}
						</li>
					))}
				</ul>

				<div className="text-lg font-semibold text-gray-500 mt-6 mb-2 uppercase">
					Chung
				</div>
				<ul className="space-y-2">
					{generalItems.map((item, index) => (
						<li
							key={index}
							onClick={() => handleItemClick(item.id)}
							className={`flex items-center gap-2  cursor-pointer ${
								selectedItem === item.id
									? "font-semibold"
									: "text-gray-500 hover:text-green-600"
							} `}>
							<div
								className={`w-8 h-8 relative ${!isExpanded ? "mx-auto" : ""}`}>
								<Image
									src={item.icon}
									alt={item.label}
									objectFit="cover"
									fill
									className={`${selectedItem === item.id ? "" : "grayscale-100"}`}
								/>
							</div>
							{isExpanded && <span>{item.label}</span>}
						</li>
					))}
				</ul>
			</div>

			{/* Footer */}
			<div className="mt-auto">
				{/* <div className="bg-green-100 p-4 rounded-lg flex items-center gap-2">
					<Download className="text-green-600" />
					{isExpanded && (
						<div>
							<p className="text-sm font-semibold">
								Download our Mobile App
							</p>
							<button className="text-green-600 font-bold">
								Download
							</button>
						</div>
					)}
				</div> */}
			</div>
		</div>
	);
};

export default SideMenu;
