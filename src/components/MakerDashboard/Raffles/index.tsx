import { Badge } from "@/components/ReUIComponent/Badge";
import { Button } from "@/components/ReUIComponent/Button";
import { NEW_MISSING_IMAGE } from "@/constants/Images";
import { useAuth } from "@/context/Auth";
import { IRequestRaffleCreation } from "@/interface/Client/Raffle";
import useMakerQuery from "@/react-query/makers/api/useMakerQuery";
import { useRaffleCreateMutation } from "@/react-query/raffles/api/useRaffleCreateMutation";
import NotifyUtils from "@/utils/NotifyUtils";
import {
	Add as AddIcon,
	Edit as EditIcon,
	MoreVert as MoreVertIcon,
	Search as SearchIcon,
	Visibility as VisibilityIcon,
} from "@mui/icons-material";
import {
	FormControl,
	IconButton,
	InputAdornment,
	MenuItem,
	Select,
	Switch,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	TextField,
} from "@mui/material";
import { Check, Copy } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import RaffleForm from "./Form";
// Mock data
const mockRaffles = [
	{
		id: "1",
		name: "Winter Collection Raffle",
		product: "Winter Hoodie",
		productType: "Clothing",
		image: NEW_MISSING_IMAGE,
		raffleId: "RF001",
		startDate: "24 Jan 2025",
		endDate: "31 Jan 2025",
		status: true,
		participants: 150,
		totalPrizes: 50,
		prizeValue: "$1500",
		winner: "Pending",
		visibility: true,
	},
	{
		id: "2",
		name: "Summer Collection Raffle",
		product: "Summer T-shirt",
		productType: "Clothing",
		image: NEW_MISSING_IMAGE,
		raffleId: "RF002",
		startDate: "15 Jan 2025",
		endDate: "30 Jan 2025",
		status: true,
		participants: 200,
		totalPrizes: 100,
		prizeValue: "$2500",
		winner: "Drawn",
		visibility: true,
	},
	{
		id: "3",
		name: "Spring Accessories",
		product: "Spring Hat",
		productType: "Accessories",
		image: NEW_MISSING_IMAGE,
		raffleId: "RF003",
		startDate: "01 Feb 2025",
		endDate: "15 Feb 2025",
		status: false,
		participants: 0,
		totalPrizes: 30,
		prizeValue: "$900",
		winner: "Not Started",
		visibility: false,
	},
	{
		id: "4",
		name: "Premium Jacket Raffle",
		product: "Premium Jacket",
		productType: "Outerwear",
		image: NEW_MISSING_IMAGE,
		raffleId: "RF004",
		startDate: "10 Jan 2025",
		endDate: "20 Jan 2025",
		status: true,
		participants: 300,
		totalPrizes: 75,
		prizeValue: "$3000",
		winner: "Completed",
		visibility: true,
	},
	{
		id: "5",
		name: "Casual Wear Raffle",
		product: "Casual Jeans",
		productType: "Clothing",
		image: NEW_MISSING_IMAGE,
		raffleId: "RF005",
		startDate: "20 Jan 2025",
		endDate: "10 Feb 2025",
		status: true,
		participants: 180,
		totalPrizes: 60,
		prizeValue: "$1800",
		winner: "Pending",
		visibility: true,
	},
];

const statConfig = {
	Pending: "warning",
	Drawn: "info",
	"Not Started": "secondary",
	Completed: "success",
};

const MakerRafflesComp = () => {
	const auth = useAuth();
	const { user } = auth || {};

	const { data: makerData } = useMakerQuery({
		params: { makerId: user?.makerId },
		enabled: !!user?.makerId,
	});
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [raffles, setRaffles] = useState(mockRaffles);
	const [isOpen, toggleOpen] = useState(false);
	const { mutateAsync, isPending: isLoading } = useRaffleCreateMutation();

	const filteredRaffles = raffles.filter((raffle) => {
		// Filter by status
		if (statusFilter !== "all") {
			if (statusFilter === "active" && !raffle.status) return false;
			if (statusFilter === "inactive" && raffle.status) return false;
		}

		// Filter by search
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			return (
				raffle.name.toLowerCase().includes(query) ||
				raffle.product.toLowerCase().includes(query) ||
				raffle.raffleId.toLowerCase().includes(query)
			);
		}

		return true;
	});

	const handleToggleStatus = (id: string) => {
		setRaffles((prev) =>
			prev.map((raffle) =>
				raffle.id === id
					? { ...raffle, status: !raffle.status }
					: raffle,
			),
		);
	};

	const handleClose = () => {
		toggleOpen(false);
	};

	const handleSubmitForm = async (data: any) => {
		if (!makerData) {
			NotifyUtils.error("Maker data not found. Cannot create raffle.");
			return;
		}

		console.log("Data", data);
		const payload: IRequestRaffleCreation = {
			title: data.title,
			makerId: makerData?.makerId,
			description: data?.description,
			entryPrice: data.entryPrice,
			startAt: data.startAt,
			endAt: data.endAt,
			maxWinners: data.maxWinners,
			deliveryMethods: data.deliveryMethods,
			paymentMethods: data.paymentMethods,
			secretKey: data.secretKey,
			features: data.features,
			isPublic: data.isPublic,
			productOptions: data.productOptions,
			raffleType: data.raffleType,
			status: data.status,
			images: data.images,
			entriesLimit: data.entriesLimit,
			maxEntryPerPerson: data.maxEntryPerPerson,
			maxWinPerEntries: data.maxWinPerEntries,
		};

		console.log("payload", payload);

		try {
			const resp = await mutateAsync({ payload });
			console.log("resp", resp);
			if (resp.status === "OK") {
				// Close form
				handleClose();
				// Optionally, refresh raffle list or show success message
			}
		} catch (error) {
			console.error("Error creating raffle:", error);
		}
	};

	// Calculate stats
	const stats = {
		total: raffles.length,
		active: raffles.filter((r) => r.status).length,
		totalParticipants: raffles.reduce((sum, r) => sum + r.participants, 0),
		totalValue: raffles.reduce((sum, r) => {
			const value = parseInt(r.prizeValue.replace(/[$,]/g, ""));
			return sum + value;
		}, 0),
	};

	return (
		<div className="p-6 bg-gray-100 shadow-md rounded-lg min-h-screen">
			{/* Header */}
			<div className="flex justify-between items-center mb-6">
				<div>
					<h1 className="text-2xl font-bold mb-1">Quản lý Raffle</h1>
					<p className="text-gray-600 text-sm">
						Quản lý và theo dõi các raffle của bạn
					</p>
				</div>
				<div className="flex gap-2 items-center">
					<Button
						variant="primary"
						className="flex items-center gap-2"
						onClick={() => toggleOpen(true)}>
						<AddIcon sx={{ fontSize: 20 }} />
						Tạo Raffle Mới
					</Button>
				</div>
			</div>

			{/* Statistics Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
				<div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
					<div className="text-gray-600 text-sm mb-1">
						Tổng Raffle
					</div>
					<div className="text-3xl font-bold">{stats.total}</div>
					<div className="text-xs text-gray-500 mt-2">
						All raffles
					</div>
				</div>
				<div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
					<div className="text-gray-600 text-sm mb-1">
						Raffle Hoạt động
					</div>
					<div className="text-3xl font-bold">{stats.active}</div>
					<div className="text-xs text-gray-500 mt-2">Active now</div>
				</div>
				<div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
					<div className="text-gray-600 text-sm mb-1">
						Tổng Người Tham Gia
					</div>
					<div className="text-3xl font-bold">
						{stats.totalParticipants.toLocaleString()}
					</div>
					<div className="text-xs text-gray-500 mt-2">
						Total participants
					</div>
				</div>
				<div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
					<div className="text-gray-600 text-sm mb-1">
						Giá Trị Giải Thưởng
					</div>
					<div className="text-3xl font-bold">
						${stats.totalValue.toLocaleString()}
					</div>
					<div className="text-xs text-gray-500 mt-2">
						Total prizes value
					</div>
				</div>
			</div>

			{/* Filters */}
			<div className="flex justify-between items-center gap-4 mb-4 bg-white p-4 rounded-lg border border-gray-200">
				<TextField
					placeholder="Tìm kiếm raffle..."
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
					className="flex-1"
				/>
				<FormControl size="small" className="min-w-[150px]">
					<Select
						value={statusFilter}
						sx={{
							width: "15rem",
						}}
						onChange={(e) => setStatusFilter(e.target.value)}>
						<MenuItem value="all">Tất cả</MenuItem>
						<MenuItem value="active">Đang Hoạt Động</MenuItem>
						<MenuItem value="inactive">Không Hoạt Động</MenuItem>
					</Select>
				</FormControl>
			</div>

			{/* Table */}
			<div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
				<Table>
					<TableHead className="bg-gray-50 border-b border-gray-200">
						<TableRow>
							<TableCell className="font-semibold text-gray-900">
								Thông tin Raffle
							</TableCell>
							<TableCell className="font-semibold text-gray-900">
								Sản phẩm
							</TableCell>
							<TableCell className="font-semibold text-gray-900">
								Thời gian
							</TableCell>
							<TableCell className="font-semibold text-gray-900">
								Lượt tham gia
							</TableCell>
							<TableCell className="font-semibold text-gray-900">
								Điều kiện
							</TableCell>
							<TableCell className="font-semibold text-gray-900">
								Trạng Thái
							</TableCell>
							<TableCell className="font-semibold text-gray-900">
								Hoạt Động
							</TableCell>
							<TableCell
								align="center"
								className="font-semibold text-gray-900">
								Thao Tác
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{filteredRaffles.map((raffle) => (
							<TableRow
								key={raffle.id}
								className="border-b border-gray-200 hover:bg-gray-50">
								<TableCell>
									<div className="flex items-center gap-3">
										<div className="relative w-12 h-12 ">
											<Image
												src={
													raffle.image ||
													NEW_MISSING_IMAGE
												}
												alt={raffle.name}
												className="rounded object-cover"
												fill
											/>
										</div>
										<div>
											<div className="font-medium text-sm">
												{raffle.name}
											</div>
											<RaffleIdQuickCopy
												raffleId={raffle.raffleId}
											/>
										</div>
									</div>
								</TableCell>
								<TableCell className="text-sm text-gray-900">
									{raffle.raffleId}
								</TableCell>
								<TableCell className="text-sm text-gray-600">
									<div>{raffle.startDate}</div>
									<div>{raffle.endDate}</div>
								</TableCell>
								<TableCell className="text-sm font-medium">
									{raffle.participants}
								</TableCell>
								<TableCell>
									<div className="text-sm font-medium">
										{raffle.prizeValue}
									</div>
									<div className="text-xs text-gray-500">
										{raffle.totalPrizes} prizes
									</div>
								</TableCell>
								<TableCell>
									<Badge
										variant={
											statConfig[
												raffle.winner as keyof typeof statConfig
											] as
												| "primary"
												| "success"
												| "warning"
												| "destructive"
												| "secondary"
										}>
										{raffle.winner}
									</Badge>
								</TableCell>
								<TableCell>
									<Switch
										checked={raffle.status}
										onChange={() =>
											handleToggleStatus(raffle.id)
										}
										size="small"
									/>
								</TableCell>
								<TableCell align="center">
									<div className="flex gap-2 justify-center">
										<IconButton
											size="small"
											title="Xem Chi Tiết">
											<VisibilityIcon
												sx={{ fontSize: 18 }}
											/>
										</IconButton>
										<IconButton
											size="small"
											title="Chỉnh Sửa">
											<EditIcon sx={{ fontSize: 18 }} />
										</IconButton>
										<IconButton
											size="small"
											title="Thêm Tùy Chọn">
											<MoreVertIcon
												sx={{ fontSize: 18 }}
											/>
										</IconButton>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>

				{/* Empty State */}
				{filteredRaffles.length === 0 && (
					<div className="p-12 text-center">
						<div className="text-gray-500">
							Không tìm thấy raffle nào
						</div>
					</div>
				)}
			</div>
			<RaffleForm
				isOpen={isOpen}
				handleClose={handleClose}
				onSubmit={handleSubmitForm}
			/>
		</div>
	);
};

export default MakerRafflesComp;

const RaffleIdQuickCopy = ({ raffleId }: { raffleId: string }) => {
	const [isCopied, setCopied] = useState(false);
	const handleCopyClipboard = () => {
		navigator.clipboard.writeText(raffleId);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};
	return (
		<div className="relative clear-both inline-flex gap-2 items-center">
			<span className="text-xs text-gray-600">
				Raffle ID: <strong>{raffleId}</strong>
			</span>
			<div>
				{isCopied ? (
					<span className="text-green-600">
						<Check size={14} />
					</span>
				) : (
					<button
						className="text-blue-600"
						onClick={handleCopyClipboard}>
						<Copy size={14} />
					</button>
				)}
			</div>
		</div>
	);
};
