// components

import CardProfile from "@/adminComponents/Cards/CardProfile";
import CardSettings from "@/adminComponents/Cards/CardSettings";

// layout for page

import Admin from "@/layoutAdmin/Admin";

export default function Settings() {
	return (
		<div className="flex flex-wrap">
			<div className="w-full lg:w-8/12 px-4">
				<CardSettings />
			</div>
			<div className="w-full lg:w-4/12 px-4">
				<CardProfile />
			</div>
		</div>
	);
}

Settings.layout = Admin;
