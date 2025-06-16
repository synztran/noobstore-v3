import React, { useState, useRef, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";
import { IconButton, TextField } from "@mui/material";
import { TConnectionStatus } from "../interface";
import { SendIcon } from "lucide-react";
import { IRoom, websocketService } from "@/services/ChatWS";
import { IAuthUser } from "@/interface/Context/auth";

interface IProps {
	connectionStatus: TConnectionStatus;
	roomId: string | null;
	user: IAuthUser;
	isAdmin: boolean;
	currentRoom: IRoom | null;
	isModule?: boolean;
}

export default function ChatInput({
	connectionStatus,
	roomId,
	user,
	isAdmin = false,
	currentRoom = null,
	isModule = false,
}: IProps) {
	const [inputValue, setInputValue] = useState("");
	const [showEmoji, setShowEmoji] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const emojiPickerRef = useRef<HTMLDivElement>(null);

	const handleEmojiClick = (emojiData: { emoji: string }) => {
		// Insert emoji at cursor position
		const cursorPos = inputRef?.current?.selectionStart || 0;
		const newText =
			inputValue.slice(0, cursorPos) +
			emojiData.emoji +
			inputValue.slice(cursorPos);
		setInputValue(newText);
		setShowEmoji(false);
		// Refocus input
		setTimeout(() => inputRef.current?.focus(), 0);
	};

	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			// Handle file upload logic here
			console.log("File upload functionality to be implemented");
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			// onSend(inputValue);
			handleSend();
		}
	};

	const handleSend = () => {
		if (!inputValue.trim()) return;
		if (!roomId) return;

		websocketService.send({
			action: "message_send",
			payload: {
				type: "message",
				message: inputValue,
				timestamp: Date.now(),
				roomId,
				sendFrom: user.customerId,
				userRole: user.role as "admin" | "customer",
				sendTo: isAdmin
					? currentRoom?.customerId || undefined
					: currentRoom?.adminId || undefined,
			},
		});

		setInputValue("");
	};

	useEffect(() => {
		if (!showEmoji) return;
		function handleClickOutside(event: MouseEvent) {
			if (
				emojiPickerRef.current &&
				!emojiPickerRef.current.contains(event.target as Node) &&
				(event.target as HTMLElement).getAttribute("aria-label") !==
					"emoji"
			) {
				setShowEmoji(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, [showEmoji]);

	return (
		<div
			className={`${
				isModule ? "p-2" : "p-4"
			} bg-white border-t border-gray-200 flex gap-2`}>
			<div className="flex-1">
				{/* Upload Icon */}
				<div className="flex gap-2 mb-2">
					<div>
						<IconButton
							className="!p-0.5"
							onClick={() =>
								document.getElementById("file-upload")?.click()
							}
							disabled={connectionStatus !== "connected"}
							color="primary">
							<span
								role="img"
								aria-label="upload"
								className="w-6 h-6 text-lg hover:scale-110 transition-all duration-300">
								📎
							</span>
						</IconButton>
						<input
							type="file"
							id="file-upload"
							className="hidden"
							onChange={handleFileUpload}
						/>
					</div>
					{/* Emoji Icon */}
					<IconButton
						className="!p-0.5"
						style={{ color: "unset" }}
						onClick={() => setShowEmoji((v) => !v)}>
						<span className="w-6 h-6 text-lg hover:scale-110 transition-all duration-300">
							😀
						</span>
					</IconButton>
				</div>

				{/* Emoji Picker */}
				{showEmoji && (
					<div
						ref={emojiPickerRef}
						className="absolute bottom-40 left-40 z-10">
						<EmojiPicker onEmojiClick={handleEmojiClick} />
					</div>
				)}

				{/* Message Input */}
				<div className="flex gap-2">
					<div className="border border-gray-200 rounded-lg p-2 w-full">
						<TextField
							fullWidth
							value={inputValue}
							onChange={(e) => setInputValue(e.target.value)}
							onKeyPress={handleKeyPress}
							placeholder="Bạn có thể gửi tin nhắn cho tôi..."
							disabled={connectionStatus !== "connected"}
							multiline
							rows={3}
							sx={{
								"& .MuiInputBase-root": {
									padding: "0!important",
									borderBottom: "none",
									overflowY: "scroll",
									height: "100%",
								},
								"& .MuiOutlinedInput-notchedOutline": {
									border: "none",
								},
								"&:hover .MuiOutlinedInput-notchedOutline": {
									border: "none",
								},
								"&.Mui-focused .MuiOutlinedInput-notchedOutline":
									{
										border: "none",
									},
							}}
						/>
						<div className="flex justify-end">
							<IconButton
								onClick={handleSend}
								disabled={
									connectionStatus !== "connected" ||
									!inputValue.trim()
								}
								className="!p-0.5"
								color="primary">
								<SendIcon className="w-4 h-4" />
							</IconButton>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
