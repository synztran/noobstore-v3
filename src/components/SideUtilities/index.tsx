import React from "react";
import { Tooltip, Avatar, IconButton } from "@material-ui/core";
import { BookmarkBorder, OpenInNew } from "@material-ui/icons";
import { classNames } from "@/utils/AppConfig";

interface SideUtilitiesProps {
	showAvatar?: boolean;
	avatarUrl?: string;
	avatarBadge?: React.ReactNode;
	onOpen?: () => void;
	onSave?: () => void;
	isSaved?: boolean;
}

const SideUtilities: React.FC<SideUtilitiesProps> = ({
	showAvatar = false,
	avatarUrl,
	avatarBadge,
	onOpen,
	onSave,
	isSaved = false,
}) => {
	return (
		<div
			className={classNames(
				"flex flex-col items-center gap-2 bg-white rounded-2xl p-2 shadow-md max-h-max",
				"w-full"
			)}>
			<Tooltip title="Thông tin từ hãng" placement="left">
				<button
					onClick={onOpen}
					className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-300 hover:border-black transition-all duration-300">
					<OpenInNew fontSize="small" />
				</button>
			</Tooltip>

			{/* Save/Bookmark Button */}
			<Tooltip title="Quan tâm" placement="left">
				<button
					onClick={onSave}
					className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-300 hover:border-black transition-all duration-300">
					<BookmarkBorder fontSize="small" />
				</button>
			</Tooltip>

			{/* Optional Avatar */}
			{showAvatar && (
				<div className="relative mt-2">
					<Avatar
						src={avatarUrl}
						className="w-[36px] h-[36px] border border-[#fff] shadow-sm"
					/>
					{avatarBadge !== undefined ? (
						<span className="absolute -bottom-1 -right-1">
							{avatarBadge}
						</span>
					) : (
						<span className="absolute -bottom-1 -right-1 flex items-center justify-center w-5 h-5 bg-pink-500 rounded-full border-2 border-white text-white text-xs font-bold">
							+
						</span>
					)}
				</div>
			)}
		</div>
	);
};

export default SideUtilities;
