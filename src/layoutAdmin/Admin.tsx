// components

import FooterAdmin from "@/adminComponents/Footers/FooterAdmin";
import HeaderStats from "@/adminComponents/Headers/HeaderStats";
import AdminNavbar from "@/adminComponents/Navbars/AdminNavbar";
import Sidebar from "@/adminComponents/Sidebar/Sidebar";

export default function Admin({
	children,
	isHideStats = false,
}: {
	children: React.ReactNode;
	isHideStats?: boolean;
}) {
	return (
		<div className="flex">
			<Sidebar />
			<div className="relative bg-slate-100">
				<AdminNavbar />
				{/* Header */}
				{!isHideStats && <HeaderStats />}
				<div className="relative px-4 mx-auto w-full -m-24 z-[100]">
					{children}
					<FooterAdmin />
				</div>
			</div>
		</div>
	);
}
