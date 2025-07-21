import React from "react";
import Image from "next/image";
import {
	QUICK_ACCESS_DESKMATS_ICON,
	QUICK_ACCESS_KEYCAPS_ICON,
	QUICK_ACCESS_LUBRICANT_ICON,
	SERVICE_KEYBOARD_ICON,
	SERVICE_NEW_SWITCH_ICON,
	SERVICE_STABILIZER_ICON,
} from "@/constants/Images";
import Link from "next/link";

const categories = [
	{
		label: "Bàn phím",
		icon: SERVICE_KEYBOARD_ICON,
		url: "/products/keyboards",
	},
	{
		label: "Switches",
		icon: SERVICE_NEW_SWITCH_ICON,
		url: "/products/switches",
	},
	{
		label: "Keycaps",
		icon: QUICK_ACCESS_KEYCAPS_ICON,
		url: "/products/keycaps",
	},
	{
		label: "Desk Mats",
		icon: QUICK_ACCESS_DESKMATS_ICON,
		url: "/products/desk-mats",
	},
	{
		label: "Lubricant",
		icon: QUICK_ACCESS_LUBRICANT_ICON,
		url: "/products/lubricant",
	},
	{
		label: "Phụ kiện",
		icon: SERVICE_STABILIZER_ICON,
		url: "/products/accessories",
	},
];

const TitleWithMenuQuickAccess = () => (
	<div className="w-full flex flex-col gap-8 items-center">
		<div
			className="text-4xl font-bold text-center"
			style={{ lineHeight: 1 }}>
			<span className="text-4xl font-bold mb-0">
				Chào mừng bạn đến với
			</span>
			<br />
			<span
				className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent text-4xl font-bold"
				style={{ lineHeight: "52px" }}>
				NoobStore.
			</span>
			{/* <span className="text-zinc-500 text-4xl font-bold">.</span> */}
		</div>
		<div className="flex justify-center gap-10 flex-wrap">
			{categories.map((cat) => (
				<Link
					href={cat.url}
					key={cat.label}
					className="flex flex-col items-center w-28 gap-2 hover:scale-105 transition-all duration-300">
					<div className="rounded-full w-20 h-2w-20 flex items-center justify-center shadow-sm border border-gray-800 p-0.5">
						<Image
							src={cat.icon}
							alt={cat.label}
							width={120}
							height={120}
							className="object-contain rounded-full bg-gray-400"
						/>
					</div>
					<span className="text-base text-gray-800 font-bold">
						{cat.label}
					</span>
				</Link>
			))}
		</div>
	</div>
);

export default TitleWithMenuQuickAccess;
