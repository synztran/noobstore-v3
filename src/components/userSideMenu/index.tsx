import { PAGE_LINK } from "@/constants";
import { EnumSideMenu } from "@/constants/Enums";
import { useAuth } from "@/context/Auth";
import { classNames } from "@/utils/AppConfig";
import {
	ArrowRightOnRectangleIcon,
	BuildingStorefrontIcon,
	Cog6ToothIcon,
	GiftIcon,
	HeartIcon,
	MapPinIcon,
	ShoppingCartIcon,
	StarIcon,
	UserIcon,
	WalletIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import PopupLogOut from "../PopupLogout";

// Account block
const AccountMenu = [
	{
		icon: UserIcon,
		href: PAGE_LINK.USER_DETAIL,
		label: "Thông tin cá nhân",
		sublabel: "Quản lý tài khoản, thông tin cá nhân",
		id: EnumSideMenu.DETAIL,
	},
	{
		icon: ShoppingCartIcon,
		href: PAGE_LINK.USER_ORDERS,
		label: "Đơn hàng",
		sublabel: "Quản lý, chỉnh sửa đơn hàng",
		id: EnumSideMenu.ORDERS,
	},
	{
		icon: HeartIcon,
		href: "#",
		label: "Yêu thích",
		sublabel: "Sản phẩm đã lưu",
		id: "wishlist",
	},
	{
		icon: MapPinIcon,
		href: PAGE_LINK.USER_ADDRESSES,
		label: "Sổ địa chỉ",
		sublabel: "Quản lý địa chỉ giao hàng",
		id: EnumSideMenu.ADDRESSES,
	},
	{
		icon: StarIcon,
		href: "#",
		label: "Lịch sử tham gia raffle",
		sublabel: "Xem các raffle đã tham gia",
		id: "raffleHistory",
	},
];

// Maker block (only show if user.role === 'Maker')
const MakerMenu = [
	{
		icon: BuildingStorefrontIcon,
		href: "#",
		label: "Maker dashboard",
		sublabel: "Quản lý sản phẩm, đơn hàng của bạn",
		id: "makerDashboard",
	},
	{
		icon: GiftIcon,
		href: "#",
		label: "Quản lý raffle",
		sublabel: "Tạo và quản lý các raffle",
		id: "makerRaffle",
	},
];

// Reward/Preferences block
const OtherMenu = [
	{
		icon: WalletIcon,
		href: "#",
		label: "Rewards",
		sublabel: "Điểm thưởng, hoàn tiền, ưu đãi",
		id: "rewards",
	},
	{
		icon: Cog6ToothIcon,
		href: "#",
		label: "Cài đặt & ưu tiên",
		sublabel: "Cài đặt tài khoản, thông báo",
		id: "preferences",
	},
];

import React from "react";

interface UserSideMenuProps {
	selectedMenu: string;
	onSelectMenu: (id: string) => void;
}

const UserSideMenu: React.FC<UserSideMenuProps> = ({
	selectedMenu,
	onSelectMenu,
}) => {
	const { user } = useAuth() || {};
	const [openLogout, setOpenLogout] = useState(false);

	const handleClick = (menu: any) => {
		if (menu.id === EnumSideMenu.LOGOUT) {
			setOpenLogout(true);
		} else {
			onSelectMenu(menu.id);
		}
	};

	const handleClose = () => {
		setOpenLogout(false);
	};

	return (
		<div className="w-full">
			<main className="mx-auto max-w-7xl">
				{/* Account Block */}
				<section className="mb-6">
					<div className="mb-2 text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">
						Account
					</div>
					<div className="rounded-xl bg-white shadow p-2 space-y-2">
						{AccountMenu.map((menu, idx) => (
							<div
								key={menu.id}
								className={classNames(
									"flex items-center gap-3 py-3 px-2 cursor-pointer hover:bg-gray-200 rounded-md group transition",
									selectedMenu === menu.id
										? "!bg-red-50 border-r-4 !border-red-400"
										: ""
								)}
								onClick={() => handleClick(menu)}>
								<menu.icon className="w-7 h-7 text-gray-500 group-hover:text-red-400" />
								<div className="flex flex-col flex-1 min-w-0">
									<span className="font-semibold text-base text-gray-900 truncate">
										{menu.label}
									</span>
									<span className="text-xs text-gray-700 truncate">
										{menu.sublabel}
									</span>
								</div>
							</div>
						))}
					</div>
				</section>

				{/* Maker Block: always show. If not Maker, show register button. */}
				<section className="mb-6">
					<div className="mb-2 text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">
						Maker
					</div>
					<div className="rounded-xl bg-white shadow p-2 divide-y divide-gray-100">
						{user?.role === "Maker" ? (
							MakerMenu.map((menu, idx) => (
								<div
									key={menu.id}
									className={classNames(
										"flex items-center gap-3 py-3 px-2 cursor-pointer hover:bg-gray-50 group transition",
										selectedMenu === menu.id
											? "bg-blue-50 border-r-4 border-blue-400"
											: ""
									)}
									onClick={() => handleClick(menu)}>
									<menu.icon className="w-7 h-7 text-gray-500 group-hover:text-blue-500" />
									<div className="flex flex-col flex-1 min-w-0">
										<span className="font-semibold text-base text-gray-900 truncate">
											{menu.label}
										</span>
										<span className="text-xs text-gray-500 truncate">
											{menu.sublabel}
										</span>
									</div>
								</div>
							))
						) : (
							<div className="flex flex-col items-center py-6">
								<span className="text-gray-500 mb-2">
									Bạn chưa phải là Maker.
								</span>
								<button
									className="px-4 py-2 rounded bg-blue-500 text-white font-bold hover:bg-blue-600 transition"
									onClick={() =>
										alert("Hiển thị form đăng ký Maker")
									}>
									Đăng ký trở thành Maker
								</button>
							</div>
						)}
					</div>
				</section>

				{/* Other Block */}
				<section>
					<div className="mb-2 text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">
						Thông tin
					</div>
					<div className="rounded-xl bg-white shadow p-2 divide-y divide-gray-100">
						{OtherMenu.map((menu, idx) => (
							<div
								key={menu.id}
								className={classNames(
									"flex items-center gap-3 py-3 px-2 cursor-pointer hover:bg-gray-50 group transition",
									selectedMenu === menu.id
										? "bg-yellow-50 border-r-4 border-yellow-400"
										: ""
								)}
								onClick={() => handleClick(menu)}>
								<menu.icon className="w-7 h-7 text-gray-500 group-hover:text-yellow-500" />
								<div className="flex flex-col flex-1 min-w-0">
									<span className="font-semibold text-base text-gray-900 truncate">
										{menu.label}
									</span>
									<span className="text-xs text-gray-500 truncate">
										{menu.sublabel}
									</span>
								</div>
							</div>
						))}
						{/* Logout always at the end */}
						<div
							className={classNames(
								"flex items-center gap-3 py-3 px-2 cursor-pointer hover:bg-gray-50 group transition",
								selectedMenu === EnumSideMenu.LOGOUT
									? "bg-red-50 border-r-4 border-red-400"
									: ""
							)}
							onClick={() =>
								handleClick({ id: EnumSideMenu.LOGOUT })
							}>
							<ArrowRightOnRectangleIcon className="w-7 h-7 text-gray-500 group-hover:text-red-500" />
							<div className="flex flex-col flex-1 min-w-0">
								<span className="font-semibold text-base text-gray-900 truncate">
									Đăng xuất
								</span>
								<span className="text-xs text-gray-500 truncate">
									Thoát khỏi tài khoản
								</span>
							</div>
						</div>
					</div>
				</section>
			</main>
			<PopupLogOut open={openLogout} handleClose={handleClose} />
		</div>
	);
};

export default UserSideMenu;
