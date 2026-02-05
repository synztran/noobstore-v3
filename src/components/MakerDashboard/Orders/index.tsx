import { Badge } from "@/components/ReUIComponent/Badge";
import { Button } from "@/components/ReUIComponent/Button";
import { AccessTime, Search as SearchIcon } from "@mui/icons-material";
import {
	FormControl,
	InputAdornment,
	MenuItem,
	Select,
	TextField,
} from "@mui/material";
import React, { useState } from "react";

// Mock data
const mockOrders = [
	{
		id: "1",
		customerName: "David Moore",
		phone: "+1 9876543210",
		address: "123 Main St, Springfield",
		status: "new",
		time: "11:00 AM, 08 Feb, 2024",
		table: "Table 1",
		paymentBy: "Chuyển khoản ngân hàng",
		items: [
			{ name: "Spaghetti Bolognese", quantity: 1, price: 12.5 },
			{ name: "Garlic Bread", quantity: 1, price: 3.5 },
			{ name: "Caesar Salad", quantity: 1, price: 3.5 },
		],
		totalAmount: 22.5,
	},
	{
		id: "2",
		customerName: "Esther Howard",
		phone: "+1 9876543210",
		status: "new",
		time: "11:30 AM, 08 Feb, 2024",
		table: "Table 2",
		items: [
			{ name: "Grilled Chicken Sandwiches", quantity: 2, price: 14.0 },
			{ name: "Greek Salad", quantity: 1, price: 8.0 },
		],
		totalAmount: 22.0,
	},
	{
		id: "3",
		customerName: "Jacob Jones",
		phone: "+1 9876543210",
		status: "new",
		time: "12:00 PM, 08 Feb, 2024",
		table: "Table 3",
		items: [
			{ name: "Beef Burger", quantity: 1, price: 10.0 },
			{ name: "Large French Fries", quantity: 1, price: 8.0 },
			{ name: "Chocolate Milkshake", quantity: 2, price: 8.0 },
		],
		totalAmount: 26.0,
	},
	{
		id: "4",
		customerName: "Ariana McCoy",
		phone: "+1 9876543210",
		status: "cooking",
		time: "01:00 PM, 08 Feb, 2024",
		table: "Table 5",
		items: [
			{ name: "Chicken Alfredo Pasta", quantity: 1, price: 13.0 },
			{ name: "Garlic Bread", quantity: 1, price: 3.5 },
			{ name: "Side of Vegetables", quantity: 1, price: 4.5 },
		],
		totalAmount: 21.0,
	},
	{
		id: "5",
		customerName: "Eleanor Pena",
		phone: "+1 9876543210",
		status: "cooking",
		time: "02:00 PM, 08 Feb, 2024",
		table: "Table 6",
		items: [
			{ name: "Veggie Burger", quantity: 1, price: 9.0 },
			{ name: "Sweet Potato Fries", quantity: 1, price: 4.5 },
			{ name: "Iced Tea", quantity: 1, price: 2.5 },
		],
		totalAmount: 16.0,
	},
	{
		id: "6",
		customerName: "Brooklyn Simmons",
		phone: "+1 9876543210",
		status: "cooking",
		time: "03:00 PM, 08 Feb, 2024",
		table: "Table 7",
		items: [
			{ name: "BBQ Chicken Pizza", quantity: 1, price: 12.5 },
			{ name: "Caesar Salad", quantity: 1, price: 7.0 },
			{ name: "Lemonade", quantity: 2, price: 5.0 },
		],
		totalAmount: 22.5,
	},
	{
		id: "7",
		customerName: "Courtney Henry",
		phone: "+1 9876543210",
		status: "cancelled",
		time: "05:00 PM, 08 Feb, 2024",
		table: "Table 9",
		items: [
			{ name: "Margherita Pizza", quantity: 1, price: 10.0 },
			{ name: "Garlic Bread", quantity: 1, price: 3.5 },
		],
		totalAmount: 14.0,
	},
	{
		id: "8",
		customerName: "Devon Lane",
		phone: "+1 9876543210",
		status: "completed",
		time: "06:00 PM, 08 Feb, 2024",
		table: "Table 10",
		items: [
			{ name: "Fish and Chips", quantity: 1, price: 11.0 },
			{ name: "Coleslaw", quantity: 1, price: 1.0 },
		],
		totalAmount: 12.0,
	},
	{
		id: "9",
		customerName: "Ronald Richards",
		phone: "+1 9876543210",
		status: "completed",
		time: "08:00 PM, 08 Feb, 2024",
		table: "Table 11",
		items: [{ name: "Lasagna", quantity: 1, price: 20.5 }],
		totalAmount: 20.5,
	},
];

const statusConfig = {
	new: {
		label: "New Order",
		color: "#2563EB",
		bgColor: "#DBEAFE",
		variant: "info",
	},
	cooking: {
		label: "On Cook",
		color: "#F59E0B",
		bgColor: "#FEF3C7",
		variant: "warning",
	},
	completed: {
		label: "Complete",
		color: "#10B981",
		bgColor: "#D1FAE5",
		variant: "success",
	},
	cancelled: {
		label: "Cancelled",
		color: "#EF4444",
		bgColor: "#FEE2E2",
		variant: "destructive",
	},
};

const MakerOrdersComp = () => {
	const [currentTab, setCurrentTab] = useState("all");
	const [searchQuery, setSearchQuery] = useState("");

	const handleTabChange = (
		_event: React.SyntheticEvent,
		newValue: string,
	) => {
		setCurrentTab(newValue);
	};

	const filteredOrders = mockOrders.filter((order) => {
		// Filter by tab
		if (currentTab !== "all" && order.status !== currentTab) {
			return false;
		}

		// Filter by search
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			return (
				order.customerName.toLowerCase().includes(query) ||
				order.phone.includes(query) ||
				order.table.toLowerCase().includes(query)
			);
		}

		return true;
	});

	return (
		<div className="p-6 bg-gray-50 min-h-scree rounded-lg">
			{/* Header */}
			<div className="flex justify-between items-start mb-6">
				<div className="text-2xl font-bold mb-1">
					Danh sách đơn hàng
				</div>
				<Button variant="secondary">Tạo đơn hàng</Button>
			</div>

			{/* Tabs */}
			<div className="flex justify-between items-center gap-4 mb-4">
				<TextField
					placeholder="Nhập mã đơn..."
					size="small"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<SearchIcon className="text-gray-400" />
							</InputAdornment>
						),
					}}
				/>
				<FormControl size="small" className="min-w-[200px]">
					<Select
						value={currentTab}
						onChange={(event) =>
							handleTabChange(
								event as unknown as React.SyntheticEvent,
								event.target.value as string,
							)
						}
						displayEmpty
						sx={{
							backgroundColor: "white",
							borderRadius: "8px",
							width: "15rem",
						}}>
						<MenuItem value="all">Tất cả</MenuItem>
						<MenuItem value="unpaid">Chưa thanh toán</MenuItem>
						<MenuItem value="paid">Đã thanh toán</MenuItem>
						<MenuItem value="completed">Hoàn thành</MenuItem>
						<MenuItem value="cancelled">Hủy</MenuItem>
					</Select>
				</FormControl>
			</div>

			{/* Order Cards Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
				{filteredOrders.map((order) => (
					<div
						key={order.id}
						className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
						{/* Customer Info & Status */}
						<div className="flex flex-col justify-between items-start mb-3">
							<div className="flex justify-between w-full items-center mb-2">
								<div className="font-semibold text-base">
									{order.customerName}
								</div>
								<Badge
									variant={
										statusConfig[
											order.status as keyof typeof statusConfig
										].variant as
											| "primary"
											| "success"
											| "warning"
											| "destructive"
									}>
									{
										statusConfig[
											order.status as keyof typeof statusConfig
										].label
									}
								</Badge>
							</div>
							<div>
								<div className="text-xs text-gray-500">
									{order.phone}
								</div>
								<div className="text-xs text-gray-500">
									{order.address}
								</div>
							</div>
						</div>
						<hr className="my-2" />

						{/* Time & Table */}
						<div className="flex flex-col gap-1 mb-3 text-gray-600">
							<div className="flex items-center gap-1 text-xs">
								<AccessTime sx={{ fontSize: 16 }} />
								<div className="text-xs">{order.time}</div>
							</div>
							<div className="flex items-center gap-1 text-xs">
								{/* <RestaurantMenu sx={{ fontSize: 16 }} />
								<div className="text-xs">{order.table}</div> */}
								<div className="text-xs">{order.paymentBy}</div>
							</div>
						</div>

						<hr className="my-2" />

						{/* Items List */}
						<div className="pt-3">
							<div className="text-sm font-semibold mb-2">
								{order.items.length} Sản phẩm
							</div>
							<div className="space-y-1 mb-3">
								{order.items.map((item, index) => (
									<div
										key={index}
										className="flex justify-between text-sm">
										<div className="text-gray-700 text-xs">
											{item.quantity} {item.name}
										</div>
										<div className="font-medium text-xs">
											${item.price.toFixed(2)}
										</div>
									</div>
								))}
							</div>
							{/* Total */}
							<div className="border-t pt-2 flex justify-between items-center">
								<div className="font-bold text-sm">
									Tổng tiền
								</div>
								<div className="font-bold text-blue-600 text-base">
									${order.totalAmount.toFixed(2)}
								</div>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Empty State */}
			{filteredOrders.length === 0 && (
				<div className="text-center py-12">
					<div className="text-gray-500">
						Không tìm thấy đơn hàng nào
					</div>
				</div>
			)}
		</div>
	);
};

export default MakerOrdersComp;
