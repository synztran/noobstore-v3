import { Base } from "@/templates/Base";
import {
	AccessTime,
	RestaurantMenu,
	Search as SearchIcon,
} from "@mui/icons-material";
import {
	Box,
	Chip,
	InputAdornment,
	Tab,
	Tabs,
	TextField,
	Typography,
} from "@mui/material";
import React, { useState } from "react";

// Mock data
const mockOrders = [
	{
		id: "1",
		customerName: "David Moore",
		phone: "+1 9876543210",
		status: "new",
		time: "11:00 AM, 08 Feb, 2024",
		table: "Table 1",
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
	new: { label: "New Order", color: "#2563EB", bgColor: "#DBEAFE" },
	cooking: { label: "On Cook", color: "#F59E0B", bgColor: "#FEF3C7" },
	completed: { label: "Complete", color: "#10B981", bgColor: "#D1FAE5" },
	cancelled: { label: "Cancelled", color: "#EF4444", bgColor: "#FEE2E2" },
};

const MakerOrdersPage = () => {
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
		<Base>
			<Box className="p-6 bg-gray-50 min-h-screen">
				{/* Header */}
				<Box className="flex justify-between items-start mb-6">
					<Box>
						<Typography variant="h4" className="font-bold mb-1">
							Order List
						</Typography>
						<Typography variant="body2" className="text-gray-600">
							{new Date().toLocaleDateString("en-US", {
								year: "numeric",
								month: "long",
								day: "numeric",
							})}
						</Typography>
					</Box>
					<TextField
						placeholder="Search..."
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
						sx={{
							width: "300px",
							backgroundColor: "white",
							"& .MuiOutlinedInput-root": {
								borderRadius: "8px",
							},
						}}
					/>
				</Box>

				{/* Tabs */}
				<Box className="mb-6">
					<Tabs
						value={currentTab}
						onChange={handleTabChange}
						sx={{
							"& .MuiTab-root": {
								textTransform: "none",
								fontWeight: 500,
								minHeight: "40px",
								borderRadius: "8px",
								marginRight: "8px",
							},
							"& .Mui-selected": {
								backgroundColor: "#2563EB",
								color: "white !important",
							},
						}}>
						<Tab label="All" value="all" />
						<Tab label="New Orders" value="new" />
						<Tab label="On Cook" value="cooking" />
						<Tab label="Completed" value="completed" />
					</Tabs>
				</Box>

				{/* Order Cards Grid */}
				<Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
					{filteredOrders.map((order) => (
						<Box
							key={order.id}
							className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
							{/* Customer Info & Status */}
							<Box className="flex justify-between items-start mb-3">
								<Box>
									<Typography className="font-semibold text-base">
										{order.customerName}
									</Typography>
									<Typography className="text-xs text-gray-500">
										{order.phone}
									</Typography>
								</Box>
								<Chip
									label={
										statusConfig[
											order.status as keyof typeof statusConfig
										].label
									}
									size="small"
									sx={{
										backgroundColor:
											statusConfig[
												order.status as keyof typeof statusConfig
											].bgColor,
										color: statusConfig[
											order.status as keyof typeof statusConfig
										].color,
										fontWeight: 600,
										fontSize: "0.75rem",
									}}
								/>
							</Box>

							{/* Time & Table */}
							<Box className="flex flex-col gap-1 mb-3 text-gray-600">
								<Box className="flex items-center gap-1 text-xs">
									<AccessTime sx={{ fontSize: 16 }} />
									<Typography className="text-xs">
										{order.time}
									</Typography>
								</Box>
								<Box className="flex items-center gap-1 text-xs">
									<RestaurantMenu sx={{ fontSize: 16 }} />
									<Typography className="text-xs">
										{order.table}
									</Typography>
								</Box>
							</Box>

							{/* Items List */}
							<Box className="border-t pt-3">
								<Typography className="text-sm font-semibold mb-2">
									{order.items.length} Items
								</Typography>
								<Box className="space-y-1 mb-3">
									{order.items.map((item, index) => (
										<Box
											key={index}
											className="flex justify-between text-sm">
											<Typography className="text-gray-700 text-xs">
												{item.quantity} {item.name}
											</Typography>
											<Typography className="font-medium text-xs">
												${item.price.toFixed(2)}
											</Typography>
										</Box>
									))}
								</Box>
								{/* Total */}
								<Box className="border-t pt-2 flex justify-between items-center">
									<Typography className="font-bold text-sm">
										Total
									</Typography>
									<Typography className="font-bold text-blue-600 text-base">
										${order.totalAmount.toFixed(2)}
									</Typography>
								</Box>
							</Box>
						</Box>
					))}
				</Box>

				{/* Empty State */}
				{filteredOrders.length === 0 && (
					<Box className="text-center py-12">
						<Typography className="text-gray-500">
							Không tìm thấy đơn hàng nào
						</Typography>
					</Box>
				)}
			</Box>
		</Base>
	);
};

export default MakerOrdersPage;
