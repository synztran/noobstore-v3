import React, { useState } from "react";
import Image from "next/image";
import { NEW_MISSING_IMAGE } from "@/constants/Images";
import { Divider } from "@mui/material";
import Link from "next/link";

const guides: {
	title: string;
	author: string;
	date: string;
	image: string;
	avatar: string;
	emoji?: string;
	url?: string;
}[] = [
	{
		title: "Hướng dẫn cơ bản về build bàn phím cơ",
		author: "Thành Phạm",
		date: "November 3, 2025",
		image: "/images/guide1.jpg",
		avatar: NEW_MISSING_IMAGE,
		emoji: "🛠️",
		url: "/guides/build-keyboard",
	},
	{
		title: "Why are Custom Mechanical Keyboards So Expensive?",
		author: "keycap-admiral",
		date: "November 3, 2025",
		image: "/images/guide2.jpg",
		avatar: NEW_MISSING_IMAGE,
		emoji: "🛠️",
		url: "/guides/build-keyboard",
	},
	{
		title: "Why are Custom Mechanical Keyboards So Expensive?",
		author: "KeygeekMedia",
		date: "November 3, 2025",
		image: "/images/guide1.jpg",
		avatar: NEW_MISSING_IMAGE,
		emoji: "🛠️",
		url: "/guides/build-keyboard",
	},
	{
		title: "Why are Custom Mechanical Keyboards So Expensive?",
		author: "KeygeekMedia",
		date: "November 3, 2025",
		image: "/images/guide1.jpg",
		avatar: NEW_MISSING_IMAGE,
		emoji: "🛠️",
		url: "/guides/build-keyboard",
	},
];

const GuildAndTutorials = () => {
	const [email, setEmail] = useState("");

	const handleSubmitMail = () => {
		console.log("submit mail");
	};

	return (
		<div className="w-full flex flex-col gap-2">
			{/* Header */}
			<div className="mb-2 flex justify-between items-center">
				<span className="font-bold text-xl">
					Hướng dẫn and chia sẻ.
					<span className="text-gray-600 ml-1 text-xl font-bold">
						Được viết và chia sẻ bởi cộng đồng
					</span>
				</span>
				<div>
					<button className="bg-transparent text-gray-600 text-sm font-semibold hover:underline px-2">
						Xem thêm
					</button>
				</div>
			</div>
			{/* Main Card */}
			<div className="bg-black rounded-2xl p-4 flex flex-col gap-4">
				{/* Guides Row */}
				<div className="flex flex-row gap-2">
					{guides.map((guide, idx) => (
						<Link
							href={guide.url || ""}
							key={idx}
							className="bg-[#18181b] rounded-xl p-3 flex flex-row w-[340px] min-w-[260px] max-w-[360px] shadow-md items-center hover:shadow-sm hover:shadow-white transition-all duration-300">
							<div className="relative w-[72px] h-[72px] rounded-lg overflow-hidden flex-shrink-0">
								{guide.emoji ? (
									<div className="flex items-center justify-center w-full h-full text-4xl">
										{guide.emoji}
									</div>
								) : (
									<Image
										src={guide.image || NEW_MISSING_IMAGE}
										alt={guide.title}
										fill
										className="rounded-lg object-cover"
									/>
								)}
							</div>
							{/* Right: Content */}
							<div className="flex flex-col justify-center ml-4 flex-1">
								<div className="flex items-center gap-2 mb-1">
									<div className="relative w-6 h-6 rounded-full overflow-hidden">
										<Image
											src={
												guide.avatar ||
												NEW_MISSING_IMAGE
											}
											alt={guide.author}
											fill
											className="object-cover"
										/>
									</div>
									<span className="text-xs text-gray-300 font-normal">
										{guide.author}
									</span>
								</div>
								<div className="font-semibold text-white text-base leading-tight mb-1">
									{guide.title}
								</div>
								<div className="text-xs text-gray-400">
									{guide.date}
								</div>
							</div>
						</Link>
					))}
				</div>
				<Divider className="bg-gray-700 mx-2" />
				{/* Newsletter Section */}
				<div className="rounded-xl flex md:flex-row items-center justify-between gap-4 mx-2">
					<div className="max-w-lg">
						<div className="text-white font-bold text-lg mb-1">
							Đăng ký nhận tin!
						</div>
						<span className="text-zinc-200 text-sm opacity-80">
							Nhận được các ưu đãi đặc biệt, cập nhật sản phẩm, và
							thông tin bên trong về sản phẩm sắp tới!
						</span>
					</div>

					<form
						onSubmit={(e) => {
							e.preventDefault();
							handleSubmitMail();
						}}
						className="max-w-md">
						<div className="flex items-center bg-[#232323] rounded-50 px-2 py-1 w-full max-w-md">
							<input
								id="email"
								type="email"
								className="flex-1 bg-transparent outline-none border-none text-white placeholder-gray-300 px-2 py-2 rounded-full"
								placeholder="Email của bạn"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
							<button
								type="submit"
								disabled={!email.trim()}
								className={`ml-2 px-6 py-2 text-xs rounded-50 font-semibold text-white bg-[#1769ff] transition-all duration-200 ${
									email.trim()
										? "hover:scale-105 hover:bg-[#155be6] cursor-pointer"
										: "opacity-60 cursor-not-allowed"
								}`}>
								Đăng ký
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default GuildAndTutorials;
