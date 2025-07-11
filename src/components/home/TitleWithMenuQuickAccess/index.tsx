import React from "react";
import Image from "next/image";
import { NEW_MISSING_IMAGE } from "@/constants/Images";

const categories = [
	{ label: "Keyboards", icon: NEW_MISSING_IMAGE },
	{ label: "Switches", icon: NEW_MISSING_IMAGE },
	{ label: "Keycaps", icon: NEW_MISSING_IMAGE },
	{ label: "Desk Mats", icon: NEW_MISSING_IMAGE },
	{ label: "Lube", icon: NEW_MISSING_IMAGE },
	{ label: "Accesories", icon: NEW_MISSING_IMAGE },
];

const defaultText = {
	header: "Những bàn phím tốt ",
};

const TitleWithMenuQuickAccess = () => (
	<div className="w-full flex flex-col gap-8 items-center">
		<div
			className="text-4xl font-bold text-center"
			style={{ lineHeight: "55px" }}>
			<span className="text-4xl font-bold mb-0">The best mechanical</span>
			<br />
			<span className="text-zinc-500 text-4xl font-bold">keyboards </span>
			<span
				className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent text-4xl font-bold"
				style={{ lineHeight: "52px" }}>
				for you
			</span>
		</div>
		<div className="flex justify-center gap-10 flex-wrap">
			{categories.map((cat) => (
				<div
					key={cat.label}
					className="flex flex-col items-center w-25 gap-2">
					<div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center shadow-sm">
						<Image
							src={cat.icon}
							alt={cat.label}
							width={48}
							height={48}
							className="object-contain"
						/>
					</div>
					<span className="text-sm text-gray-800 font-bold">
						{cat.label}
					</span>
				</div>
			))}
		</div>
	</div>
);

export default TitleWithMenuQuickAccess;
