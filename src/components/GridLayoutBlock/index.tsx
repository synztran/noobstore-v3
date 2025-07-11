import React from "react";
import Image from "next/image";
import { Info, Star, ThumbsUp, UserRoundCheck } from "lucide-react";
import Tooltip from "@mui/material/Tooltip";

// Import images and owners from your constants
import {
	GROUP_IMAGE_1,
	GROUP_IMAGE_2,
	GROUP_IMAGE_3,
	GROUP_IMAGE_4,
	GROUP_IMAGE_5,
	GROUP_IMAGE_6,
	GROUP_IMAGE_7,
	GROUP_IMAGE_8,
	GROUP_IMAGE_9,
	GROUP_IMAGE_10,
	GROUP_IMAGE_11,
	GROUP_IMAGE_12,
	GROUP_IMAGE_13,
	GROUP_IMAGE_14,
	LOGO_STORE,
} from "@/constants/Images";

interface IPost {
	src: string;
	owner: string;
	info: {
		[x: string]: string;
	};
	isVertical?: boolean;
}

interface IProps {
	images: IPost[];
}

// Example data for the grid
const communityImages = [
	{
		src: GROUP_IMAGE_1,
		owner: "alex.keyboards",
		info: "65% custom build, GMK keycaps, FR4 plate, lubed switches.",
		isVertical: true,
	},
	{
		src: GROUP_IMAGE_2,
		owner: "mech.melody",
		info: "Alice layout, PBT keycaps, gasket mount, silent reds.",
	},
	{
		src: GROUP_IMAGE_3,
		owner: "keebsbykim",
		info: "75% layout, RGB underglow, tactile switches.",
	},
	{
		src: GROUP_IMAGE_4,
		owner: "switch.smith",
		info: "60% compact, handwired, artisan keycap.",
	},
	{
		src: GROUP_IMAGE_5,
		owner: "rgbdreams",
		info: "TKL, polycarbonate case, pudding keycaps.",
	},
	{
		src: GROUP_IMAGE_12,
		owner: "capslockcafe",
		info: "Full size, custom cable, clicky switches.",
		isVertical: true,
	},
	{
		src: GROUP_IMAGE_7,
		owner: "pastelkeebs",
		info: "65% pastel theme, silent linear switches.",
	},
	{
		src: GROUP_IMAGE_8,
		owner: "keebscape",
		info: "Split keyboard, OLED display, hotswap PCB.",
	},
	{
		src: GROUP_IMAGE_9,
		owner: "boardbuilder",
		info: "40% ortho, custom firmware, DSA keycaps.",
	},
	{
		src: GROUP_IMAGE_10,
		owner: "nighttype",
		info: "65% RGB, aluminum case, lubed stabs.",
	},
	{
		src: GROUP_IMAGE_11,
		owner: "nighttype",
		info: "65% RGB, aluminum case, lubed stabs.",
	},
	{
		src: GROUP_IMAGE_6,
		owner: "nighttype",
		info: "65% RGB, aluminum case, lubed stabs.",
	},
	{
		src: GROUP_IMAGE_13,
		owner: "nighttype",
		info: "65% RGB, aluminum case, lubed stabs.",
		isVertical: true,
	},
	{
		src: GROUP_IMAGE_14,
		owner: "nighttype",
		info: "65% RGB, aluminum case, lubed stabs.",
		isVertical: true,
	},
];

const GridLayoutBlock: React.FC<IProps> = ({ images }) => {
	return (
		<div className="w-full">
			<div className="mb-4">
				<span className="font-bold text-2xl text-black">
					As seen on Instagram.
				</span>
				<span className="text-gray-500 text-base font-normal ml-2">
					See endless possibilities.
				</span>
			</div>
			<div
				className="grid gap-4"
				style={{
					gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
					gridAutoRows: "minmax(220px, auto)",
				}}>
				{communityImages.map((item, idx) => (
					<div
						key={idx}
						className="relative rounded-xl overflow-hidden shadow-md group bg-white flex flex-col"
						style={{
							minHeight: item.isVertical ? 320 : 220, // Adjust height based on image orientation
							gridRow: item.isVertical ? "span 2" : undefined, // Make vertical images span 2 rows
						}}>
						<div className="relative w-full h-full min-h-[220px]">
							<Image
								src={item.src}
								alt={`Community build by ${item.owner}`}
								layout="fill"
								objectFit="cover"
								className="transition-transform duration-300 group-hover:scale-105"
								priority={idx < 3}
							/>
							{/* Overlay for owner and info */}
							<div className="absolute bottom-0 left-0 w-full flex items-center justify-between px-3 py-2 bg-gradient-to-t from-black/70 to-transparent">
								<span className="text-white font-semibold text-sm flex items-center gap-1">
									@{item.owner}
								</span>
								<Tooltip title={item.info} arrow>
									<span className="inline-flex items-center justify-center bg-white/80 rounded-full p-1 hover:bg-white transition-colors cursor-pointer">
										<Info className="w-4 h-4 text-gray-700" />
									</span>
								</Tooltip>
							</div>
						</div>
					</div>
				))}
			</div>
			<div className="mt-8 flex flex-col items-center justify-center gap-4">
				<div className="flex items-center gap-4">
					<div className="w-12 h-12 bg-gray-200 rounded-full relative overflow-hidden border border-gray-600  ">
						<Image
							src={LOGO_STORE}
							alt="Noob Assembly"
							objectFit="cover"
							layout="fill"
							className="p-0.5 rounded-full"
						/>
					</div>
					<div className="flex flex-col">
						<span className="text-black text-lg font-bold">
							NoobStore
						</span>
						<div className="flex gap-2">
							<div className="flex items-center gap-1">
								<strong>216</strong>
								likes
							</div>
							<div className="flex items-center gap-1">
								<strong>236</strong>
								followers
							</div>
							<div className="flex items-center gap-1">
								<strong>28</strong>
								<Star className="w-4 h-4 fill-yellow-500" />
							</div>
						</div>
					</div>
					<a
						href="https://www.facebook.com/noobassembly"
						target="_blank"
						rel="noopener noreferrer">
						<button className="bg-blue-600 text-white px-6 py-2 rounded-50 hover:scale-105 transition-all duration-300">
							Follow us
						</button>
					</a>
				</div>

				<div className="text-black text-base max-w-md text-center">
					Chia sẻ ảnh và video on instagram với hashtag{" "}
					<strong className="text-blue-600">#noobstore</strong> hoặc{" "}
					<strong className="text-blue-600">@noobstore</strong> để có
					cơ hội phô diễn ở đây nhé
				</div>
			</div>
		</div>
	);
};

export default GridLayoutBlock;
