// components

import CardBarChart from "@/adminComponents/Cards/CardBarChart";
import CardLineChart from "@/adminComponents/Cards/CardLineChart";
import CardPageVisits from "@/adminComponents/Cards/CardPageVisits";
import CardSocialTraffic from "@/adminComponents/Cards/CardSocialTraffic";

// layout for page

import Admin from "@/layoutAdmin/Admin";

export default function Dashboard() {
	return (
		<div>
			<div className="flex flex-wrap">
				<div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
					<CardLineChart />
				</div>
				<div className="w-full xl:w-4/12 px-4">
					<CardBarChart />
				</div>
			</div>
			<div className="flex flex-wrap mt-4">
				<div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
					<CardPageVisits />
				</div>
				<div className="w-full xl:w-4/12 px-4">
					<CardSocialTraffic />
				</div>
			</div>
		</div>
	);
}

Dashboard.layout = Admin;
