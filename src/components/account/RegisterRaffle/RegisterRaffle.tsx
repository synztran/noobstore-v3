import { Button } from "@/components/ReUIComponent/Button";
import { mappingRaffleStatusLabel } from "@/constants";
import {
	I3D_NUMBER_ONE,
	I3D_NUMBER_THREE,
	I3D_NUMBER_TWO,
} from "@/constants/Images";
import { EnumRaffleStatus } from "@/interface/Client/Raffle";
import { TResponseRaffleEntry } from "@/interface/Context/auth";
import DateUtils from "@/utils/DateUtils";
import { formatCurrency } from "@/utils/FormatNumber";
import { Modal, Tab, Tabs } from "@mui/material";
import Image from "next/image";
import React, { useState } from "react";

interface RegisterRaffleModalProps {
	open: boolean;
	onClose: () => void;
	selected: TResponseRaffleEntry | null;
}

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`raffle-tabpanel-${index}`}
			aria-labelledby={`raffle-tab-${index}`}
			className="w-full overflow-y-auto mt-4 h-74 transition-all duration-300 ease-in-out">
			{value === index ? children : null}
		</div>
	);
};

const TABS = [
	{
		id: 0,
		label: "Sản phẩm",
		ariaControls: "raffle-tabpanel-0",
	},
	{
		id: 1,
		label: "Thông tin đăng ký",
		ariaControls: "raffle-tabpanel-1",
	},
	{
		id: 2,
		label: "Maker & Quy định",
		ariaControls: "raffle-tabpanel-2",
	},
];

const PRIORITY_ICON = {
	1: {
		src: I3D_NUMBER_ONE,
		alt: "1",
	},
	2: {
		src: I3D_NUMBER_TWO,
		alt: "2",
	},
	3: {
		src: I3D_NUMBER_THREE,
		alt: "3",
	},
};

const RegisterRaffleModal: React.FC<RegisterRaffleModalProps> = ({
	open,
	onClose,
	selected,
}) => {
	const [tabValue, setTabValue] = useState(0);

	if (!open || !selected) return null;

	const handleTabChange = (
		_event: React.SyntheticEvent,
		newValue: number
	) => {
		setTabValue(newValue);
	};

	return (
		<Modal open={open} onClose={onClose}>
			<div
				className="bg-white rounded-lg shadow-lg max-w-xl w-full px-6 pt-6 pb-18 animate-fade-in flex flex-col gap-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-h-[70vh]"
				onMouseDown={(e) => e.stopPropagation()}>
				{/* Product Image */}
				<div className="flex items-start justify-between">
					<div className="w-32 h-32 relative border border-gray-200 rounded-lg p-2 bg-gray-50">
						<Image
							src={selected?.raffleInfo.thumbnail.path || ""}
							alt={selected?.raffleInfo.thumbnail.alt || "Raffle"}
							fill
							objectFit="cover"
							className="rounded-md"
						/>
					</div>
					<div className="relative">
						<div
							className={` flex items-center px-2 py-1 rounded-md text-sm font-semibold text-center
              ${mappingRaffleStatusLabel[selected.raffleInfo?.status as EnumRaffleStatus]?.bgColor} ${mappingRaffleStatusLabel[selected.raffleInfo?.status as EnumRaffleStatus]?.color}`}>
							{mappingRaffleStatusLabel?.[
								selected.raffleInfo?.status as EnumRaffleStatus
							]?.icon ? (
								<Image
									src={
										mappingRaffleStatusLabel[
											selected.raffleInfo
												?.status as EnumRaffleStatus
										]?.icon!
									}
									alt="status icon"
									width={32}
									height={32}
									className="scale-[2]"
								/>
							) : null}
							{
								mappingRaffleStatusLabel[
									selected.raffleInfo
										?.status as EnumRaffleStatus
								]?.label
							}
						</div>
					</div>
				</div>
				{/* Entry ID and Status */}
				<div className="flex-1 space-y-4">
					<div className="text-2xl font-bold">
						Raffle #{selected.raffleId}
					</div>

					{/* Key Info Grid */}
					<div className="grid grid-cols-2 gap-4">
						<div>
							<p className="text-gray-600 text-sm">Sản phẩm</p>
							<p className="font-semibold text-gray-900">
								{selected.raffleInfo.title}
							</p>
						</div>
						<div>
							<p className="text-gray-600 text-sm">Team/Maker</p>
							<p className="font-semibold text-gray-900">
								{selected.makerInfo?.brandName ||
									"Không xác định"}
							</p>
						</div>
						<div>
							<p className="text-gray-600 text-sm">
								Thời gian mở raffle
							</p>
							<p className="font-semibold text-gray-900">
								{DateUtils.formatVietNamTime(
									selected.createdAt
								)}
								&nbsp;-&nbsp;
								{DateUtils.formatVietNamDate(
									selected.createdAt
								)}
							</p>
						</div>
						<div>
							<p className="text-gray-600 font-semibold text-sm">
								Thời gian dự kiến giao hàng
							</p>
							<p className="font-semibold text-gray-900 truncate">
								{DateUtils.formatVietNamDate(
									selected.raffleInfo.deliveryEstimate || ""
								) || "Đang cập nhật"}
							</p>
						</div>
					</div>
				</div>

				{/* Tabs Section */}
				<div className="w-full flex flex-col">
					<Tabs
						value={tabValue}
						onChange={handleTabChange}
						aria-label="Raffle entry tabs"
						className="border-b border-gray-200"
						TabIndicatorProps={{
							style: {
								backgroundColor: "oklch(57.7% 0.245 27.325)",
							},
						}}>
						{TABS.map((tab) => (
							<Tab
								key={tab.id}
								label={tab.label}
								id={`raffle-tab-${tab.id}`}
								aria-controls={tab.ariaControls}
								className={`text-[14px]! capitalize! ${
									tabValue === tab.id
										? "text-red-600! font-bold!"
										: "text-gray-600! font-semibold!"
								}`}
							/>
						))}
					</Tabs>

					{/* Tab Panel 1: Order History */}
					<TabPanel value={tabValue} index={0}>
						<div className="space-y-4">
							{/* Entry Timeline */}
							<div className="grid grid-cols-2 gap-4">
								{selected.productSelections.map((product) => (
									<div
										key={`${product.productId}-${product.name}`}
										className="bg-gray-50 border border-gray-200 rounded-lg p-2 flex gap-4">
										<div className="w-24 h-24 relative flex-shrink-0 border border-gray-200 rounded overflow-hidden bg-white">
											<Image
												src={
													product.thumbnail?.path ||
													""
												}
												alt={
													product.thumbnail?.alt ||
													product.name ||
													"Sản phẩm"
												}
												fill
												objectFit="cover"
												className="rounded"
											/>
											<div className="absolute right-1 top-1 bg-gray-50 rounded-full">
												{product.priority &&
												PRIORITY_ICON[
													product.priority as keyof typeof PRIORITY_ICON
												]?.src ? (
													<Image
														src={
															PRIORITY_ICON[
																product.priority as keyof typeof PRIORITY_ICON
															]?.src
														}
														alt={
															PRIORITY_ICON[
																product.priority as keyof typeof PRIORITY_ICON
															]?.alt
														}
														width={24}
														height={24}
													/>
												) : null}
											</div>
										</div>
										<div className="flex-1">
											<p className="font-semibold text-sm text-gray-900 line-clamp-2">
												{product.name}
											</p>
											<p className="text-sm font-bold text-gray-900 mt-1">
												{formatCurrency(product.price)}
											</p>
										</div>
									</div>
								))}
							</div>
						</div>
					</TabPanel>

					{/* Tab Panel 2: Product Details */}
					<TabPanel value={tabValue} index={1}>
						<div className="space-y-4">
							<div className="grid grid-cols-2 gap-2">
								<div className="flex flex-col justify-between gap-2">
									{/* customer information */}
									<div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
										<h3 className="font-semibold text-gray-900 mb-3">
											Thông tin liên hệ
										</h3>
										<div className="grid grid-cols-2 gap-4 text-sm">
											<div>
												<p className="text-gray-600">
													Họ tên
												</p>
												<p className="font-semibold text-gray-900 capitalize">
													{selected.name}
												</p>
											</div>
											<div>
												<p className="text-gray-600">
													Điện thoại
												</p>
												<p className="font-semibold text-gray-900">
													{selected.phone}
												</p>
											</div>
											<div className="col-span-2">
												<p className="text-gray-600">
													Email
												</p>
												<p className="font-semibold text-gray-900">
													{selected.email}
												</p>
											</div>
										</div>
									</div>
									{/* Ghi chú & Mã bí mật (kết hợp) */}
									{(selected.note || selected.secretKey) && (
										<div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
											<div className="font-semibold text-gray-900 mb-2">
												Thông tin bổ sung
											</div>

											{selected.note && (
												<>
													<p className="text-sm">
														Ghi chú
													</p>
													<p className="font-semibold">
														{selected.note}
													</p>
												</>
											)}

											{selected.secretKey && (
												<>
													<p className="text-sm">
														Mã bí mật
													</p>
													<p className="font-semibold">
														{selected.secretKey}
													</p>
												</>
											)}
										</div>
									)}
								</div>
								<div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
									<h3 className="font-semibold text-gray-900 mb-3">
										Địa chỉ giao hàng
									</h3>
									<div className="text-sm">
										<p className="text-gray-600">Địa chỉ</p>
										<p className="font-semibold text-gray-900">
											{selected.shipping.address}
										</p>
										<p className="text-gray-600 mt-2">
											Thành phố
										</p>
										<p className="font-semibold text-gray-900">
											{selected.shipping.city}
										</p>
										{selected.shipping.companyName && (
											<>
												<p className="text-gray-600 mt-2">
													Công ty
												</p>
												<p className="font-semibold text-gray-900">
													{
														selected.shipping
															.companyName
													}
												</p>
											</>
										)}
										<p className="text-gray-600 mt-2">
											Đơn vị vận chuyển
										</p>
										<p className="font-semibold text-gray-900 bg-gray-200 rounded-sm px-2 py-1 max-w-max">
											{
												selected.shipping.shippingMethod
													.name
											}
										</p>
									</div>
								</div>
							</div>
						</div>
					</TabPanel>
					{/* Tab Panel 3: Maker & Policy */}
					<TabPanel value={tabValue} index={2}>
						<div className="flex flex-col gap-2">
							{/* Khối: Thông tin Maker */}
							<div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
								<h3 className="font-semibold text-gray-900 mb-3">
									Thông tin Maker
								</h3>
								<div className="text-sm">
									<p className="text-gray-600">
										Tên Maker/Team
									</p>
									<p className="font-semibold text-gray-900 text-base">
										{selected.makerInfo?.brandName ||
											"Không xác định"}
									</p>
								</div>
							</div>

							{/* Khối: Quy định Raffle */}
							<div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
								<h3 className="font-semibold text-gray-900 mb-3">
									Quy định Raffle
								</h3>
								<ul className="list-disc pl-5 text-sm space-y-2 text-gray-900">
									<li>
										Thông tin đăng ký phải trùng khớp với
										thông tin nhận hàng.
									</li>
									<li>
										Mỗi tài khoản chỉ được đăng ký 1 lần cho
										một đợt raffle.
									</li>
									<li>
										Không chuyển nhượng suất mua sau khi
										trúng raffle.
									</li>
								</ul>

								<div className="mt-4">
									<h4 className="font-semibold text-gray-900 mb-2">
										Thanh toán
									</h4>
									<ul className="list-disc pl-5 text-sm space-y-2 text-gray-900">
										<li>
											Giá sản phẩm tùy theo lựa chọn ở tab
											"Sản phẩm".
										</li>
									</ul>
								</div>

								<div className="mt-4">
									<h4 className="font-semibold text-gray-900 mb-2">
										Lưu ý
									</h4>
									<ul className="list-disc pl-5 text-sm space-y-2 text-gray-900">
										<li>
											Vui lòng kiểm tra email để theo dõi
											kết quả và hướng dẫn tiếp theo.
										</li>
										<li>
											Hệ thống có quyền hủy đăng ký nếu
											phát hiện gian lận hoặc thông tin
											không hợp lệ.
										</li>
									</ul>
								</div>
							</div>
						</div>
					</TabPanel>
				</div>
				<div className="fixed bottom-0 left-0 w-full flex items-center justify-end border-t border-gray-200 bg-white p-4">
					<Button
						size="default"
						variant="outline"
						className=""
						onClick={onClose}>
						<span className="text-sm text-black font-bold">
							Đóng
						</span>
					</Button>
				</div>
			</div>
		</Modal>
	);
};

export default RegisterRaffleModal;
