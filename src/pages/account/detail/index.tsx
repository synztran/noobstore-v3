import AccountInfo from "@/components/account/AccountInfo";
import Addresses from "@/components/account/Addresses";
import Orders from "@/components/account/Orders";
import Preferences from "@/components/account/Preferences";
import RaffleHistory from "@/components/account/RaffleHistory";
import Rewards from "@/components/account/Rewards";
import Wishlist from "@/components/account/Wishlist";
import Breadcumb from "@/components/breadcumb";
import MakerDashboard from "@/components/maker/MakerDashboard";
import MakerRaffle from "@/components/maker/MakerRaffle";
import UserSideMenu from "@/components/userSideMenu";
import { BreadcumbTitle } from "@/constants";
import { EnumSideMenu } from "@/constants/Enums";
import { useAuth } from "@/context/Auth";
import { Base } from "@/templates/Base";
import { Divider } from "@material-ui/core";
import React, { useState } from "react";

const COMPONENT_MAP: Record<string, React.ReactNode> = {
	[EnumSideMenu.DETAIL]: <AccountInfo />,
	[EnumSideMenu.ORDERS]: <Orders />,
	wishlist: <Wishlist />,
	[EnumSideMenu.ADDRESSES]: <Addresses />,
	raffleHistory: <RaffleHistory />,
	rewards: <Rewards />,
	preferences: <Preferences />,
	makerDashboard: <MakerDashboard />,
	makerRaffle: <MakerRaffle />,
};

const UserDetailPage: React.FC = () => {
	const auth = useAuth();
	const { isAuthenticated } = auth || {};
	const [selectedMenu, setSelectedMenu] = useState<string>(
		EnumSideMenu.DETAIL
	);

	if (!isAuthenticated) return null;

	return (
		<Base>
			<div className="mx-w-full p-6 sm:py-6 lg:px-8 relative z-1">
				<Breadcumb
					mainRoot={BreadcumbTitle["account.detail"] as string}
					subRoot="Thông tin tài khoản"
				/>
				<article className="flex mt-4 gap-4">
					<div className="flex-initial w-1/4">
						<UserSideMenu
							selectedMenu={selectedMenu}
							onSelectMenu={setSelectedMenu}
						/>
					</div>
					<Divider orientation="vertical" flexItem />
					<div className="flex-initial w-3/4 pl-4 pt-5">
						{COMPONENT_MAP[selectedMenu] || <AccountInfo />}
					</div>
				</article>
			</div>
		</Base>
	);
};

export default UserDetailPage;
