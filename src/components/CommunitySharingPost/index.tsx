import React from "react";
import Image from "next/image";
import {
	COMMUNITY_POST_1,
	COMMUNITY_POST_2,
	COMMUNITY_POST_3,
	COMMUNITY_POST_4,
	LOGO_STORE,
} from "@/constants/Images";
import { Hammer, Heart } from "lucide-react";

type User = {
	name: string;
	avatar: string;
};

type Post = {
	id: string | number;
	title: string;
	image: string;
	likes: number;
	user: User;
	createdAt: string;
};

type CommunitySharingPostProps = {
	title: React.ReactNode;
	posts: Post[];
	onStartBuilding?: () => void;
	onSeeMore?: () => void;
};
const fakePosts: Post[] = [
	{
		id: 1,
		title: "My Custom 65% Build",
		image: COMMUNITY_POST_1,
		likes: 128,
		user: {
			name: "Alex Chen",
			avatar: LOGO_STORE,
		},
		createdAt: "3 Nov 2025",
	},
	{
		id: 2,
		title: "First Time Building - 75% Layout",
		image: COMMUNITY_POST_2,
		likes: 89,
		user: {
			name: "Sarah Kim",
			avatar: LOGO_STORE,
		},
		createdAt: "3 Nov 2025",
	},
	{
		id: 3,
		title: "Minimalist 60% Setup",
		image: COMMUNITY_POST_3,
		likes: 256,
		user: {
			name: "Mike Johnson",
			avatar: LOGO_STORE,
		},
		createdAt: "3 Nov 2025",
	},
	{
		id: 4,
		title: "RGB Gaming Build",
		image: COMMUNITY_POST_4,
		likes: 167,
		user: {
			name: "Emma Wilson",
			avatar: LOGO_STORE,
		},
		createdAt: "3 Nov 2025",
	},
];

const CommunitySharingPost: React.FC<CommunitySharingPostProps> = ({
	title,
	posts,
	onStartBuilding,
	onSeeMore,
}) => {
	return (
		<div className="w-full mt-4 mb-8">
			{/* Header */}
			<div className="flex items-center justify-between mb-3">
				<div>
					<span className="font-bold text-xl text-black">
						{title}
					</span>
					<span className="text-gray-500 text-base font-normal ml-2">
						Created by community members
					</span>
				</div>
				<div className="flex gap-2">
					{onStartBuilding && (
						<button
							className="inline-flex items-center gap-2 px-2 py-1 rounded-50 font-semibold text-blue-600 bg-white relative transition-all duration-300 text-sm hover:scale-105 hover:shadow-lg hover:shadow-blue-200 group"
							style={{
								border: "2px solid transparent",
								backgroundImage:
									"linear-gradient(white, white), linear-gradient(90deg, #5B8CFF 0%, #C26EFF 100%)",
								backgroundOrigin: "border-box",
								backgroundClip: "padding-box, border-box",
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.backgroundImage =
									"linear-gradient(white, white), linear-gradient(90deg, #C26EFF 0%, #5B8CFF 100%)";
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.backgroundImage =
									"linear-gradient(white, white), linear-gradient(90deg, #5B8CFF 0%, #C26EFF 100%)";
							}}>
							<Hammer className="transition-transform duration-300 group-hover:rotate-12" />
							Build ngay
						</button>
					)}
					{onSeeMore && (
						<button
							className="bg-transparent text-gray-600 text-sm font-semibold hover:underline px-2"
							onClick={onSeeMore}>
							See more
						</button>
					)}
				</div>
			</div>
			{/* Posts */}
			<div className="grid grid-cols-4 gap-4">
				{fakePosts.map((post) => (
					<div
						key={post.id}
						className="bg-white rounded-xl shadow-md flex flex-col relative group">
						{/* Header: User name and color circles */}
						<div className="absolute top-0 left-0 p-2  w-full max-w-m z-10 whitespace-normal flex flex-col justify-start items-start">
							{/* Post Title */}
							<span className="text-white text-sm drop-shadow-md line-clamp-1 flex-1 font-bold">
								{post.title}
							</span>
							{/* Color Circles */}
							<div className="flex items-center mr-2">
								{Array.from({ length: 3 }, (_, index) => {
									const colors = [
										"bg-black",
										"bg-purple-400",
										"bg-pink-400",
									];
									return (
										<span
											key={index}
											className={`w-5 h-5 rounded-full ${
												colors[index]
											} border-2 border-white ${
												index > 0 ? "-ml-1" : ""
											}`}
										/>
									);
								})}
							</div>
						</div>
						{/* Post Image */}
						<div className="relative w-full min-h-[360px] rounded-lg">
							<Image
								src={post.image}
								alt={post.title}
								fill
								className="group-hover:scale-[1.02] transition-all duration-300 rounded-lg object-cover"
							/>
						</div>
						{/* Footer: Likes */}
						<div className="flex items-center p-2 absolute bottom-0 left-0 w-full">
							<Heart className="w-4 h-4 fill-red-500" />
							&nbsp;
							<span className="text-xs text-white font-medium drop-shadow-md">
								{post.likes}
							</span>
						</div>
						<div className="absolute bottom-0 right-0 p-2">
							<span className="text-xs text-white font-medium drop-shadow-md">
								{post.createdAt}
							</span>
						</div>
						{/* User Avatar */}
						<div className="absolute left-1/2 -bottom-7 -translate-x-1/2 z-20">
							<div className="w-12 h-12 rounded-full border-2 border-white bg-white shadow-md relative overflow-hidden">
								<Image
									src={post.user.avatar}
									alt={post.user.name}
									fill
									className="rounded-full object-cover"
								/>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default CommunitySharingPost;
