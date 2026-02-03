import MakerDashboardComp from "@/components/MakerDashboard/Dashboard";
import Headerbar from "@/components/MakerDashboard/Headerbar";
import SideMenu from "@/components/MakerDashboard/SideMenu";
import withMakerAuth from "@/HOC";
import { useState } from "react";

const MakerDashboard = () => {
	const [isExpanded, setIsExpanded] = useState(true);

	const handleToggle = () => {
		setIsExpanded(!isExpanded);
	};
	return (
		<div className="flex gap-4 p-4">
			<div className={`${isExpanded ? "w-[22%]" : "w-[8%]"} `}>
				<SideMenu isExpanded={isExpanded} handleToggle={handleToggle} />
			</div>
			<div
				className={`${isExpanded ? "w-[78%]" : "w-[92%]"} flex flex-col gap-4`}>
				<Headerbar />
				<MakerDashboardComp />
			</div>
		</div>
	);
};

export default MakerDashboard;
