import { useEffect, useState, useRef } from "react";
import { IMessage, IRoom, websocketService } from "@/services/ChatWS";
import { Drawer, IconButton, Tooltip } from "@mui/material";
import { useAuth } from "@/context/Auth";
import Image from "next/image";
import { MappingConnectionStatus, TConnectionStatus } from "./interface";
import { CircleHelp, X } from "lucide-react";
import { useCalcBodyHeight } from "@/hook/useConfig";
import ChatInput from "./ChatInput";
import { IAuthUser } from "@/interface/Context/auth";
import useMessageChat from "@/hook/useChat";

interface IProps {
	isAdmin?: boolean;
	isModule?: boolean;
}

const ChatComponent = ({ isAdmin = false, isModule = false }: IProps) => {
	const { user } = useAuth() as unknown as { user: IAuthUser };
	const [isOpen, setIsOpen] = useState(false);
	const [isInitializing, setInitializing] = useState(true);
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

	const handleToggleChat = () => {
		setIsOpen(!isOpen);
		setTimeout(() => {
			setInitializing(true);
		}, 300);
	};

	console.log("isInitializing", isInitializing);

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
						<div className="flex items-center space-x-2">
							<div
								className={`w-3 h-3 rounded-full ${getStatusColor(
									connectionStatus
								)}`}
							/>
							<span className="text-sm font-medium capitalize">
								{MappingConnectionStatus[connectionStatus]}
							</span>
							<div className="flex items-center justify-center">
								<Tooltip
									arrow
									title={
										<a
											href="https://www.facebook.com/noobassembly"
											target="_blank"
											className="text-white hover:text-blue-300">
											Lỗi kết nối? Ấn vào đây để được hỗ
											trợ ngay
										</a>
									}
									placement="top">
									<CircleHelp className="w-4 h-4 cursor-pointer" />
								</Tooltip>
							</div>
						</div>
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
										msg.senderRole === user?.role
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
											msg.senderRole === user?.role
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
			<div className="gap-4">
				<div className="p-4 rounded-lg text-black bg-gray-200">
					<div className="text-sm flex flex-col gap-2">
						<div className="flex items-center justify-between space-x-2">
							<span>Trạng thái: </span>
							<div className="flex items-center">
								<div className="flex items-center space-x-2">
									<div
										className={`w-3 h-3 rounded-full ${getStatusColor(
											connectionStatus
										)}`}
									/>
									<span className="text-sm font-medium capitalize">
										{
											MappingConnectionStatus[
												connectionStatus
											]
										}
									</span>
									<div className="flex items-center justify-center">
										<Tooltip
											arrow
											title={
												<a
													href="https://www.facebook.com/noobassembly"
													target="_blank"
													className="text-white hover:text-blue-300">
													Lỗi kết nối? Ấn vào đây để
													được hỗ trợ ngay
												</a>
											}
											placement="top">
											<CircleHelp className="w-4 h-4 cursor-pointer" />
										</Tooltip>
									</div>
								</div>
							</div>
						</div>
						{connectionStats && (
							<div className="flex items-center justify-between">
								Mã phòng:{" "}
								<span className="font-medium py-0.5 px-2 bg-gray-600 rounded-sm text-white">
									{connectionStats.roomId}
								</span>
							</div>
						)}
						{user && (
							<div className="flex items-center justify-between">
								Mã khách hàng:{" "}
								<span className="font-medium py-0.5 px-2 bg-gray-600 rounded-sm text-white">
									{user.customerId}
								</span>
							</div>
						)}
					</div>
				</div>
				<div className="p-4 border-r border-gray-200 rounded-lg bg-gray-200">
					{isAdmin ? (
						<div className="flex flex-col gap-2">
							{listRoom.map((room) => (
								<div
									onClick={() => {
										websocketService.send({
											action: "admin_selected_room",
											payload: {
												roomId: room.id,
												sendFrom: user?.customerId,
												userRole: user?.role as
													| "admin"
													| "customer",
											},
										});
									}}
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
											className="rounded-full"
											fill
											sizes="100vw"
											style={{
												objectFit: "cover",
											}}
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
			<div className="flex flex-col bg-gray-100 h-[inherit]">
				<div
					ref={messageListRef}
					className="flex-1 p-4 overflow-y-auto shadow-lg bg-gray-200"
					style={{ flex: "1 1 auto", overflowY: "auto" }}>
					{messages.map((msg, index) => (
						<div
							key={index}
							className={`flex gap-3 mb-2 ${
								msg.senderRole === user?.role
									? "flex-row"
									: "flex-row-reverse"
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
									msg.senderRole === user?.role
										? "items-start"
										: "items-end"
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
