import MakerDashboardComp from "@/components/MakerDashboard/Dashboard";
import Headerbar from "@/components/MakerDashboard/Headerbar";
import MakerOrdersComp from "@/components/MakerDashboard/Orders";
import MakerRafflesComp from "@/components/MakerDashboard/Raffles";
import SideMenu from "@/components/MakerDashboard/SideMenu";
import { EnumMakerSideMenu } from "@/constants/Enums";
import { useCallback, useState } from "react";

const COMPONENT_MAP: Record<EnumMakerSideMenu, React.ReactNode> = {
	[EnumMakerSideMenu.DASHBOARD]: <MakerDashboardComp />,
	[EnumMakerSideMenu.RAFFLES]: <MakerRafflesComp />,
	[EnumMakerSideMenu.CUSTOMERS]: <div>Maker Orders Component</div>,
	[EnumMakerSideMenu.SCHEDULE]: <div>Maker Orders Component</div>,
	[EnumMakerSideMenu.TEAM]: <div>Maker Customers Component</div>,
	[EnumMakerSideMenu.SETTINGS]: <div>Maker Rewards Component</div>,
	[EnumMakerSideMenu.SUPPORT]: <div>Maker Preferences Component</div>,
	[EnumMakerSideMenu.ORDERS]: <MakerOrdersComp />,
};

const MakerDashboard = () => {
	const [selectedMenu, setSelectedMenu] = useState<EnumMakerSideMenu>(
		EnumMakerSideMenu.DASHBOARD,
	);
	const [isExpanded, setIsExpanded] = useState(true);

	const handleToggle = useCallback(() => {
		setIsExpanded(!isExpanded);
	}, [isExpanded]);

	const handleSelectMenu = useCallback((id: string) => {
		setSelectedMenu(id as EnumMakerSideMenu);
	}, []);

	return (
		<div className="flex gap-4 p-4">
			<div className={`${isExpanded ? "w-[22%]" : "w-[8%]"} `}>
				<SideMenu
					selectedMenu={selectedMenu}
					onSelectMenu={handleSelectMenu}
					isExpanded={isExpanded}
					handleToggle={handleToggle}
				/>
			</div>
			<div
				className={`${isExpanded ? "w-[78%]" : "w-[92%]"} flex flex-col gap-4`}>
				<Headerbar />
				{COMPONENT_MAP[selectedMenu]}
			</div>
		</div>
	);
};

export default MakerDashboard;
