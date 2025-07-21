import { useEffect, useState, useRef, useMemo } from "react";
import { websocketService } from "@/services/ChatWS";
import { Drawer, IconButton } from "@mui/material";
import { useAuth } from "@/context/Auth";
import Image from "next/image";
import { X } from "lucide-react";
import { useCalcBodyHeight } from "@/hook/useConfig";
import ChatInput from "./ChatInput";
import { IAuthUser } from "@/interface/Context/auth";
import useMessageChat from "@/hook/useChat";
import ChatConnectionStatus from "./connectionStatus";

interface IProps {
	isModule?: boolean;
}

const ChatComponent = ({ isModule = false }: IProps) => {
	const { user } = useAuth() as unknown as { user: IAuthUser };
	const [isOpen, setIsOpen] = useState(false);
	const [isInitializing, setInitializing] = useState(true);
	const [isSwichCustomer, setSwichCustomer] = useState(false);
	const {
		listRoom,
		messages,
		currentRoom,
		connectionStatus,
		connectionStats,
		getStatusColor,
	} = useMessageChat({ user, isModule, isOpen });
	const { bodyHeight } = useCalcBodyHeight({});
	const messageListRef = useRef<HTMLDivElement>(null);

	const isAdmin =
		useMemo(() => user && user.role === "admin", [user]) ?? false;

	const handleToggleChat = () => {
		setIsOpen(!isOpen);
		setTimeout(() => {
			setInitializing(false);
		}, 300);
	};

	const scrollToBottom = () => {
		if (messageListRef.current) {
			messageListRef.current.scrollTop =
				messageListRef.current.scrollHeight;
		}
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages, isSwichCustomer]);

	const handleAdminSelectRoom = (roomId: string) => {
		if (currentRoom?.id === roomId) return; // if the room is already selected, do nothing
		setSwichCustomer(true);
		websocketService.send({
			action: "admin_selected_room",
			payload: {
				roomId,
				sendFrom: user?.customerId,
				userRole: user?.role as "admin" | "customer",
			},
		});
		setTimeout(() => {
			setSwichCustomer(false);
		}, 300);
	};

	if (isModule && isAdmin) {
		return null;
	}

	if (isModule) {
		return (
			<div className="fixed bottom-0 right-0 z-[13]">
				<button
					className="bg-black text-white w-[min(25vw,300px)] px-8 py-2 rounded-tl-lg"
					onClick={handleToggleChat}>
					Liên hệ hỗ trợ 👋
				</button>
				<Drawer
					anchor="bottom"
					open={isOpen}
					onClose={handleToggleChat}
					disableScrollLock
					classes={{
						paper: "w-[min(35vw,400px)] ml-auto border border-black rounded-tr-lg rounded-tl-lg shadow-lg bottom-0 right-0 bg-gray-100",
					}}
					BackdropComponent={() => (
						<div className="bg-transparent" />
					)}>
					<div className="flex items-center justify-between p-3 sticky top-0">
						<ChatConnectionStatus
							isModule={isModule}
							connectionStatus={connectionStatus}
							getStatusColor={getStatusColor}
						/>
						<div className="flex items-center gap-2">
							<IconButton
								className="!p-0.5 bg-gray-600 hover:bg-gray-700"
								onClick={handleToggleChat}>
								<X className="text-white w-4 h-4" />
							</IconButton>
						</div>
					</div>
					<div className="flex flex-col bg-gray-100 h-full relative">
						{isInitializing ? (
							<div className="absolute flex items-center justify-center h-full w-full bg-white z-[11]">
								<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
							</div>
						) : null}
						<div
							ref={messageListRef}
							className={`flex-1 p-4 overflow-y-auto shadow-lg bg-gray-200 relative `}
							style={{ maxHeight: "calc(100vh - 300px)" }}>
							{messages.map((msg, index) => (
								<div
									key={index}
									className={`flex gap-2 mb-2 ${
										msg.senderRole
											? "flex-row"
											: "flex-row-reverse"
									}`}>
									<Image
										src={
											msg.senderRole === "admin"
												? currentRoom?.adminInfo
														?.avatar || ""
												: currentRoom?.customerInfo
														?.avatar || user?.avatar
										}
										alt="avatar"
										width={32}
										height={32}
										className="w-8 h-8 rounded-full"
									/>
									<div
										className={`flex flex-col w-full max-w-[80%] ${
											msg.senderRole
												? "items-start"
												: "items-end"
										}`}>
										<div
											className={`px-4 py-2 rounded-lg max-w-[95%] break-words ${
												msg.senderRole === "admin"
													? "bg-blue-500 text-white"
													: "bg-white text-gray-800"
											}`}>
											{msg.message}
										</div>
										<span className="text-xs text-gray-500 mt-1">
											{new Date(
												msg.timestamp
											).toLocaleTimeString()}
										</span>
									</div>
								</div>
							))}
						</div>

						{/* Input Area */}
						<ChatInput
							connectionStatus={connectionStatus}
							roomId={websocketService.getRoomId()}
							user={user}
							isAdmin={isAdmin}
							currentRoom={currentRoom}
							isModule={isModule}
						/>
					</div>
				</Drawer>
			</div>
		);
	}

	return (
		<div
			className="grid grid-cols-[280px_1fr] bg-gray-100 gap-4"
			style={{
				height: `${bodyHeight}px`,
				maxHeight: `${bodyHeight}px`,
			}}>
			<div className="flex flex-col gap-4">
				{/* connection status */}
				<ChatConnectionStatus
					connectionStats={connectionStats}
					connectionStatus={connectionStatus}
					getStatusColor={getStatusColor}
				/>
				{/* list room, only available for admin */}
				<div className="p-4 border-r border-gray-200 rounded-lg bg-gray-200">
					{isAdmin ? (
						<div className="flex flex-col gap-2">
							{listRoom.map((room) => (
								<div
									onClick={() =>
										handleAdminSelectRoom(room.id)
									}
									key={room.customerId}
									className="p-3 bg-blue-50 rounded-lg cursor-pointer hover:scale-105 transition-all duration-300 grid grid-cols-4 gap-2 relative">
									<span className="absolute top-2 right-2 text-[10px]">
										{new Date(
											room.updatedAt
										).toLocaleTimeString()}
									</span>
									<div className="w-12 h-12 rounded-full relative col-span-1">
										<Image
											src={room.customerInfo.avatar}
											alt="avatar"
											className="rounded-full object-cover"
											fill
											sizes="100vw"
										/>
									</div>
									<div className="col-span-3 flex flex-col">
										<span className="text-base font-bold">
											{room.customerInfo.name ||
												"Khách hàng"}
										</span>
										<span className="text-sm truncate">
											{
												room.messages[
													room.messages.length - 1
												]?.message
											}
										</span>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="p-2 bg-white rounded-lg cursor-pointer">
							Admin Support
						</div>
					)}
				</div>
			</div>

			{/* Chat Area */}
			<div className="flex flex-col bg-gray-100 h-[inherit] relative">
				{isSwichCustomer ? (
					<div className="absolute flex items-center h-full w-full bg-white/80 backdrop-blur-2xl z-[11]">
						<div className="flex flex-col items-center gap-4 w-full">
							<div className="flex flex-col gap-4 w-full max-w-full p-4">
								{Array.from({ length: 3 }).map((_, i) => (
									<div
										key={`admin-${i}`}
										className="flex gap-3">
										<div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
										<div className="flex flex-col gap-2">
											<div className="h-12 w-48 bg-gray-200 rounded-lg animate-pulse" />
											<div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
										</div>
									</div>
								))}

								{/* Customer skeleton messages */}
								{Array.from({ length: 3 }).map((_, i) => (
									<div
										key={`customer-${i}`}
										className="flex gap-3 flex-row-reverse">
										<div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
										<div className="flex flex-col gap-2 items-end">
											<div className="h-12 w-48 bg-gray-200 rounded-lg animate-pulse" />
											<div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				) : null}
				<div
					ref={messageListRef}
					className="p-4 overflow-y-auto shadow-lg bg-gray-200"
					style={{ flex: "1 1 auto" }}>
					{messages.map((msg, index) => (
						<div
							key={index}
							className={`flex gap-3 mb-2 ${
								msg.senderRole ? "flex-row" : "flex-row-reverse"
							}`}>
							<Image
								src={
									msg.senderRole === "admin"
										? currentRoom?.adminInfo?.avatar || ""
										: currentRoom?.customerInfo?.avatar ||
										  user?.avatar
								}
								alt="avatar"
								width={40}
								height={40}
								className="w-10 h-10 rounded-full flex-shrink-0"
							/>
							<div
								className={`flex flex-col w-full min-w-0 ${
									msg.senderRole ? "items-start" : "items-end"
								}`}>
								<div
									className={`px-4 py-2 rounded-lg max-w-[85%] overflow-hidden  ${
										msg.senderRole === "admin"
											? "bg-blue-500 text-white"
											: "bg-white text-gray-800"
									}`}
									style={{
										wordBreak: "break-word",
									}}>
									{msg.message}
								</div>
								<span className="text-xs text-gray-500 mt-1">
									{new Date(
										msg.timestamp
									).toLocaleTimeString()}
								</span>
							</div>
						</div>
					))}
				</div>

				{/* Input Area */}
				<ChatInput
					connectionStatus={connectionStatus}
					roomId={websocketService.getRoomId()}
					user={user}
					isAdmin={isAdmin}
					currentRoom={currentRoom}
				/>
			</div>
		</div>
	);
};

export default ChatComponent;
