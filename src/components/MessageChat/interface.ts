export type TConnectionStatus =
	| "connecting"
	| "connected"
	| "disconnected"
	| "error";

export interface IConnectionDetails {
	connectionId: string;
	connectionType: string;
	connectionStatus: TConnectionStatus;
	connectionStats: any;
}

export type TConnectionStats = {
	totalConnections: number;
	activeConnections: number;
	totalMessages: number;
	totalFiles: number;
	totalErrors: number;
	totalTime: number;
	totalTimeConnected: number;
	totalTimeDisconnected: number;
};

export const MappingConnectionStatus: Record<TConnectionStatus, string> = {
	connecting: "Đang kết nối...",
	connected: "Đã kết nối",
	disconnected: "Đã ngắt kết nối",
	error: "Lỗi kết nối",
};
