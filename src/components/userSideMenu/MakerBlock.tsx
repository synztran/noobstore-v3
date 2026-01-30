import { mapLabelEnumMakerStatus } from "@/constants";
import { NEW_MISSING_IMAGE } from "@/constants/Images";
import {
	EnumMakerStatus,
	IBEResponseMaker,
	IPayloadVerifyEmailMaker,
} from "@/interface/Client/Maker";
import { useMakerSendVerifyEmailMutation } from "@/react-query/makers/api/useMakerSendVerifyMutation";
import { classNames } from "@/utils/AppConfig";
import { BuildingStorefrontIcon, GiftIcon } from "@heroicons/react/24/outline";
import { Skeleton } from "@mui/material";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Button } from "../ReUIComponent";

interface IProps {
	isLoading: boolean;
	maker: IBEResponseMaker;
	selectedMenu: string;
	onSelectMenu: (id: string) => void;
	onVerifyAgain: () => void;
}

const MakerMenu = [
	{
		icon: BuildingStorefrontIcon,
		label: "Maker dashboard",
		sublabel: "Quản lý sản phẩm, đơn hàng của bạn",
		id: "makerDashboard",
		redirectLink: "/maker/dashboard",
	},
	{
		icon: GiftIcon,
		label: "Quản lý raffle",
		sublabel: "Tạo và quản lý các raffle",
		id: "makerRaffle",
		redirectLink: "/maker/raffles",
	},
];

const MakerBlock: React.FC<IProps> = ({
	isLoading,
	maker,
	selectedMenu,
	onSelectMenu,
}) => {
	const { mutateAsync, isPending } = useMakerSendVerifyEmailMutation();
	const [countdown, setCountdown] = useState(0);

	useEffect(() => {
		if (countdown > 0) {
			const timer = setTimeout(() => {
				setCountdown(countdown - 1);
			}, 1000);
			return () => clearTimeout(timer);
		}
	}, [countdown]);

	const handleSendVerify = async () => {
		try {
			if (!maker) return;
			const payload: IPayloadVerifyEmailMaker = {
				brandName: maker.brandName,
				email: maker.email,
				makerId: maker.makerId,
				ownerName: maker.ownerName,
			};
			const resp = await mutateAsync({ payload });
			if (resp.status === "OK") {
				setCountdown(30);
			}
		} catch (error) {
			console.error("Error sending verify email:", error);
		}
	};

	if (isLoading) {
		return (
			<div className="rounded-xl bg-white shadow p-4 space-y-2">
				{/* Header Skeleton */}
				<div className="flex items-center gap-3">
					<Skeleton variant="circular" width={60} height={60} />
					<div className="flex-1">
						<Skeleton variant="text" width="70%" height={20} />
						<Skeleton variant="text" width="50%" height={16} />
					</div>
				</div>

				{/* Menu Items Skeleton */}
				<div className="space-y-2 pt-2 border-t">
					{[...Array(2)].map((_, idx) => (
						<div key={idx} className="flex items-center gap-3 py-2">
							<Skeleton
								variant="circular"
								width={28}
								height={28}
							/>
							<div className="flex-1">
								<Skeleton
									variant="text"
									width="60%"
									height={18}
								/>
								<Skeleton
									variant="text"
									width="80%"
									height={14}
								/>
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}

	if (!maker) {
		return null;
	}

	return (
		<div className="rounded-xl bg-white p-2 space-y-2">
			<div className="relative">
				<div className="flex items-start gap-2">
					<div className="relative w-10 h-10 shrink-0 rounded-lg overflow-hidden">
						<Image
							src={maker?.logo?.path || NEW_MISSING_IMAGE}
							alt={maker?.logo?.alt || "Maker Logo"}
							fill
							className="object-cover"
							sizes="56px"
						/>
					</div>

					{/* Brand Info */}
					<div className="flex-1 min-w-0 space-y-1">
						<div className="flex justify-between items-center">
							<h3 className="font-semibold text-sm text-gray-900 truncate capitalize">
								{maker?.brandName || "N/a"}
							</h3>
							<span
								className={`inline-block font-semibold text-xs px-2 py-0.5 rounded-full ${
									mapLabelEnumMakerStatus?.[
										maker.verificationStatus
									]?.color
								} ${mapLabelEnumMakerStatus?.[maker.verificationStatus]?.bgColor}`}>
								{mapLabelEnumMakerStatus?.[
									maker.verificationStatus
								]?.label || "N/A"}
							</span>
						</div>
						<p className="text-xs text-gray-500 line-clamp-2">
							{maker?.bio || "Chưa có thông tin Bio"}
						</p>
					</div>
				</div>
			</div>
			<hr />
			{/* Not Verified Alert */}
			{maker?.verificationStatus !== EnumMakerStatus.VERIFIED && (
				<div className="p-2 bg-gray-200 rounded-lg">
					<p className="text-xs mb-2">
						Bạn cần xác thức tài khoản để sử dụng tính năng của
						Maker. Bạn có thể ấn vào nút bên dưới để tiến hành xác
						thực
					</p>
					<Button
						variant="primary"
						size="sm"
						fontSize="xs"
						className="w-full"
						isLoading={isPending}
						disabled={countdown > 0 || isPending}
						onClick={handleSendVerify}>
						{countdown > 0
							? `Gửi lại sau ${countdown}s`
							: "Gửi xác thực"}
					</Button>
				</div>
			)}

			{/* Maker Menu Items */}
			<div
				className={classNames(
					"space-y-2",
					maker?.verificationStatus !== EnumMakerStatus.VERIFIED
						? "blur-xs"
						: "",
				)}>
				{MakerMenu.map((menu) => (
					<div
						key={menu.id}
						className={classNames(
							"flex items-center gap-3 py-3 px-3 rounded-lg group transition",
							maker?.verificationStatus !==
								EnumMakerStatus.VERIFIED
								? "cursor-not-allowed bg-gray-50"
								: "cursor-pointer hover:bg-gray-50",
							selectedMenu === menu.id &&
								maker?.verificationStatus ===
									EnumMakerStatus.VERIFIED
								? "bg-blue-50 border-l-4 border-blue-400"
								: "",
						)}
						onClick={() => {
							if (
								maker?.verificationStatus ===
								EnumMakerStatus.VERIFIED
							) {
								onSelectMenu(menu.id);
							}
						}}>
						<menu.icon
							className={classNames(
								"w-6 h-6 shrink-0",
								maker?.verificationStatus !==
									EnumMakerStatus.VERIFIED
									? "text-gray-400"
									: "text-gray-500 group-hover:text-blue-500",
							)}
						/>
						<div className="flex flex-col flex-1 min-w-0">
							<span className="font-semibold text-sm text-gray-900">
								{menu.label}
							</span>
							<span className="text-xs text-gray-600 line-clamp-1">
								{menu.sublabel}
							</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default MakerBlock;
