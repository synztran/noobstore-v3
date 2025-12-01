import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Check, Heart, Mail, Phone, Truck, X } from "lucide-react";
import {
	EnumPaymentMethod,
	EnumPaymentStatus,
	EnumShippingMethodCode,
	IService,
	IServiceBookingData,
} from "@/interface/interface";
import {
	EnumBackendServiceType,
	IResponseBackendServiceBooking,
	IResponseBackendTask,
} from "@/interface/Client/Service";
import useServices, {
	IDonation,
	IPaymentForm,
	IPaymentMethod,
	IServicePlan,
	useServiceAction,
} from "@/zustand/useServices";
import {
	Divider,
	FormControl,
	FormControlLabel,
	Radio,
	RadioGroup,
	Tooltip,
} from "@mui/material";
import { useServicePage } from "@/hook/useServicePage";
import { Base } from "@/templates/Base";
import useBookingServiceQueries from "@/react-query/services/api/useBookingServiceQueries";
import {
	mapPaymentStatus,
	mappingLabelServiceFromBackend,
	mappingLabelServiceType,
	mappingServiceName,
	mappingShippingMethodLabel,
} from "@/constants";
import { formatCurrency, formatNumber } from "@/utils/FormatNumber";
import {
	BANK_TRANSFER_ICON,
	COD_ICON,
	HUNDRED_PERCENT_ICON,
	MOMO_LOGO,
	MOMO_QR,
	NEW_MISSING_IMAGE,
	PAYPAL_1_ICON,
	PAYPAL_ICON,
	TEN_PERCENT_ICON,
	THIRDTY_PERCENT_ICON,
	VIETCOMBANK_LOGO,
	VIETINBANK_LOGO,
	VIETINBANK_QR,
	VPBANK_LOGO,
} from "@/constants/Images";
import Image from "next/image";
import DiscountBlock from "@/components/SummaryService/DiscountBlock";
import ServiceHeader from "@/components/ServiceComponent/ServiceHeader";
import BlockServiceStep from "@/components/ServiceComponent/BlockServiceStep";
import DeliveryInformation from "@/components/ServiceComponent/DeliveryInformation";
import SummaryServicePayment from "@/components/ServiceComponent/SummaryServicePayment";
import ServiceItemSelected from "@/components/ServiceComponent/ServiceItemSelected";
import DonationBlock from "@/components/ServiceComponent/DonationBlock";
import ServiceDetail from "@/components/ServiceComponent/ServiceDetail";
import PaymentBlock from "@/components/ServiceComponent/PaymentBlock";
import { de } from "date-fns/locale";
import PaymentStatusChecking from "@/components/ServiceComponent/PaymentStatusChecking";

const ratePaypal = 25500;

// Mock data for development
const MOCK_SERVICE_DATA = {
	id: "SV-2025-001",
	name: "Dịch vụ bảo dưỡng và nâng cấp bàn phím cơ",
	description:
		"Bao gồm vệ sinh, thay switch, lube và mod bàn phím cơ chuyên nghiệp. Sử dụng linh kiện chất lượng cao từ Cherry MX và lubricant Krytox.",
	status: "IN_PROGRESS",
	createdAt: "2025-11-09T10:30:00Z",
	totalAmount: 2850000,
	paymentStatus: "DEPOSIT",
	customer: {
		name: "Nguyễn Văn A",
		email: "nguyenvana@email.com",
		phone: "0987654321",
	},
	items: [
		{
			id: "KB-001",
			type: "keyboard",
			name: "Keychron K8 Wireless",
			services: [
				{ name: "Vệ sinh phím", price: 150000 },
				{ name: "Thay switch", price: 300000 },
				{ name: "Lube switch", price: 250000 },
			],
		},
		{
			id: "SW-001",
			type: "switch",
			name: "Cherry MX Red",
			quantity: 87,
			services: [{ name: "Lube switch", price: 870000 }],
		},
	],
	timeline: [
		{
			status: "CREATED",
			date: "2025-11-09T10:30:00Z",
			description: "Đơn hàng đã được tạo thành công",
		},
		{
			status: "IN_PROGRESS",
			date: "2025-11-09T14:15:00Z",
			description: "Đã bắt đầu thực hiện dịch vụ",
		},
	],
};

// Status mapping for better UI display
const SERVICE_STATUS_MAP = {
	CANCELLED: {
		label: "Đã hủy",
		color: "bg-red-100 text-red-800 border-red-200",
		icon: "❌",
		description: "Dịch vụ đã bị hủy",
	},
	CREATED: {
		label: "Đã tạo",
		color: "bg-blue-100 text-blue-800 border-blue-200",
		icon: "📋",
		description: "Đơn hàng đã được tạo thành công",
	},
	IN_PROGRESS: {
		label: "Đang thực hiện",
		color: "bg-yellow-100 text-yellow-800 border-yellow-200",
		icon: "⚙️",
		description: "Đang tiến hành dịch vụ",
	},
	TESTING: {
		label: "Đang kiểm tra",
		color: "bg-purple-100 text-purple-800 border-purple-200",
		icon: "🔍",
		description: "Đang kiểm tra chất lượng",
	},
	PACKING: {
		label: "Đang đóng gói",
		color: "bg-indigo-100 text-indigo-800 border-indigo-200",
		icon: "📦",
		description: "Đang chuẩn bị đóng gói",
	},
	DELIVERY: {
		label: "Đang giao hàng",
		color: "bg-orange-100 text-orange-800 border-orange-200",
		icon: "🚚",
		description: "Đang vận chuyển đến bạn",
	},
	COMPLETED: {
		label: "Hoàn thành",
		color: "bg-green-100 text-green-800 border-green-200",
		icon: "✅",
		description: "Dịch vụ đã hoàn thành",
	},
} as const;

const PAYMENT_STATUS_MAP = {
	UNPAID: {
		label: "Chưa thanh toán",
		color: "bg-gray-100 text-gray-800 border-gray-200",
		icon: "⏳",
	},
	PAID: {
		label: "Đã thanh toán",
		color: "bg-green-100 text-green-800 border-green-200",
		icon: "💰",
	},
	DEPOSIT: {
		label: "Đặt cọc",
		color: "bg-blue-100 text-blue-800 border-blue-200",
		icon: "💵",
	},
	FAILED: {
		label: "Thanh toán thất bại",
		color: "bg-red-100 text-red-800 border-red-200",
		icon: "❌",
	},
	REFUNDED: {
		label: "Đã hoàn tiền",
		color: "bg-orange-100 text-orange-800 border-orange-200",
		icon: "↩️",
	},
} as const;

// Service progress steps
const SERVICE_STEPS = [
	{ key: "CREATED", label: "Tạo đơn", description: "Đơn hàng được tạo" },
	{
		key: "IN_PROGRESS",
		label: "Thực hiện",
		description: "Đang thực hiện dịch vụ",
	},
	{ key: "TESTING", label: "Kiểm tra", description: "Kiểm tra chất lượng" },
	{ key: "PACKING", label: "Đóng gói", description: "Chuẩn bị giao hàng" },
	{ key: "DELIVERY", label: "Giao hàng", description: "Đang vận chuyển" },
	{ key: "COMPLETED", label: "Hoàn thành", description: "Dịch vụ hoàn tất" },
];

const ServiceInfoPage = (): JSX.Element => {
	const router = useRouter();
	const { id } = router.query;

	const tempService = MOCK_SERVICE_DATA;
	const { data: service, isPending } = useBookingServiceQueries(
		id as string,
		{
			enabled: !!id,
		}
	);

	const getCurrentStep = () => {
		const paymentStatus = service?.paymentStatus;

		switch (paymentStatus) {
			case EnumPaymentStatus.PENDING:
				return 2;
			case EnumPaymentStatus.SUBMITTED:
				return 3;
			case EnumPaymentStatus.PAID:
				return 4;
			default:
				break;
		}

		return 2;
	};

	const currentStep = getCurrentStep();

	const getTotalAmount = (): number => {
		return service?.totalPrice || 0;
	};

	const getCurrentStepIndex = (): number => {
		const status = service?.status as keyof typeof SERVICE_STATUS_MAP;
		return SERVICE_STEPS.findIndex((step) => step.key === status);
	};

	const renderServiceHeader = (): JSX.Element => <ServiceHeader />;

	const renderServiceStatus = (): JSX.Element => {
		const status =
			(service?.status as keyof typeof SERVICE_STATUS_MAP) || "CREATED";
		const statusInfo =
			SERVICE_STATUS_MAP[status] || SERVICE_STATUS_MAP.CREATED;

		return (
			<div className="bg-white rounded-xl shadow-lg border p-6 mb-6">
				<div className="flex items-center justify-between mb-6">
					<div className="flex items-center gap-4">
						<div className="text-4xl">{statusInfo.icon}</div>
						<div>
							<h2 className="text-2xl font-bold text-gray-900">
								Trạng thái dịch vụ
							</h2>
							<p className="text-gray-600">
								{statusInfo.description}
							</p>
						</div>
					</div>
					<div
						className={`px-6 py-3 rounded-full text-lg font-semibold border-2 ${statusInfo.color}`}>
						{statusInfo.label}
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
					<div className="bg-gray-50 rounded-lg p-4">
						<div className="text-2xl mb-2">📅</div>
						<div className="text-sm text-gray-600">Ngày tạo</div>
						<div className="font-semibold">
							{new Date(
								service?.createdAt || ""
							).toLocaleDateString("vi-VN")}
						</div>
					</div>
					<div className="bg-gray-50 rounded-lg p-4">
						<div className="text-2xl mb-2">⏰</div>
						<div className="text-sm text-gray-600">
							Thời gian cập nhật
						</div>
						<div className="font-semibold">
							{new Date().toLocaleTimeString("vi-VN")}
						</div>
					</div>
					<div className="bg-gray-50 rounded-lg p-4">
						<div className="text-2xl mb-2">👤</div>
						<div className="text-sm text-gray-600">Khách hàng</div>
						<div className="font-semibold">
							{service?.contact?.name}
						</div>
					</div>
				</div>
			</div>
		);
	};

	const renderProgressTimeline = (): JSX.Element => {
		const currentStepIndex = getCurrentStepIndex();

		return (
			<div className="bg-white rounded-xl shadow-lg border p-6 mb-6">
				<h2 className="text-2xl font-bold mb-8 text-center">
					Tiến trình dịch vụ
				</h2>

				<div className="relative mb-8">
					{/* Progress line */}
					<div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 rounded"></div>
					<div
						className="absolute top-6 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded transition-all duration-1000"
						style={{
							width: `${
								(currentStepIndex /
									(SERVICE_STEPS.length - 1)) *
								100
							}%`,
						}}></div>

					<div className="relative flex justify-between">
						{SERVICE_STEPS.map((step, index) => {
							const isCompleted = index <= currentStepIndex;
							const isCurrent = index === currentStepIndex;

							return (
								<div
									key={step.key}
									className="flex flex-col items-center max-w-24">
									<div
										className={`
											w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold mb-3 transition-all duration-500 shadow-lg
											${
												isCompleted
													? "bg-gradient-to-r from-green-500 to-green-600 text-white"
													: isCurrent
													? "bg-gradient-to-r from-blue-500 to-purple-500 text-white animate-pulse"
													: "bg-gray-200 text-gray-400"
											}
										`}>
										{isCompleted ? "✓" : index + 1}
									</div>
									<div className="text-center">
										<p
											className={`font-semibold text-sm ${
												isCompleted
													? "text-green-600"
													: isCurrent
													? "text-blue-600"
													: "text-gray-500"
											}`}>
											{step.label}
										</p>
										<p className="text-xs text-gray-500 mt-1">
											{step.description}
										</p>
									</div>
								</div>
							);
						})}
					</div>
				</div>

				{/* Timeline details */}
				<div className="space-y-3">
					{tempService.timeline.map(
						(
							item: {
								status: string;
								date: string;
								description: string;
							},
							index: number
						) => {
							const statusInfo =
								SERVICE_STATUS_MAP[
									item.status as keyof typeof SERVICE_STATUS_MAP
								];
							return (
								<div
									key={index}
									className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
									<div className="text-2xl">
										{statusInfo.icon}
									</div>
									<div className="flex-1">
										<div className="flex items-center gap-2 mb-1">
											<span className="font-semibold">
												{statusInfo.label}
											</span>
											<span className="text-sm text-gray-500">
												{new Date(
													item.date
												).toLocaleString("vi-VN")}
											</span>
										</div>
										<p className="text-sm text-gray-600">
											{item.description}
										</p>
									</div>
								</div>
							);
						}
					)}
				</div>
			</div>
		);
	};

	const paymentMethodOptions = [
		{
			id: "COD",
			name: "Thanh toán khi nhận hàng",
			description:
				"Thanh toán khi nhận hàng. Hỗ trợ khách hàng thân thiết hoặc đơn hàng nhỏ",
			isActive: false,
			value: "COD",
			icon: COD_ICON,
			iconW: 120,
			iconH: 48,
			isOnlyIcon: true,
		},
		{
			id: "BANK_TRANSFER",
			name: "Chuyển khoản ngân hàng",
			description: "Thanh toán bằng hình thức chuyển khoản ngân hàng",
			isActive: true,
			value: "BANK_TRANSFER",
			icon: BANK_TRANSFER_ICON,
			isOnlyIcon: true,
			iconW: 70,
			iconH: 48,
			info: {
				label: "Vietinbank",
				logo: VIETINBANK_LOGO,
				accountNumber: "1090-0066-3716",
				accountHolder: "Trần Hồng Hải",
				qrCodeImage: VIETINBANK_QR,
				scale: 1.8,
			},
		},
		{
			id: "MOMO",
			name: "Ví MoMo",
			description: "Thanh toán nhanh chóng qua ứng dụng MoMo",
			isActive: true,
			value: "MOMO",
			icon: MOMO_LOGO,
			isOnlyIcon: true,
			iconW: 48,
			iconH: 48,
			info: {
				label: "MoMo",
				logo: MOMO_LOGO,
				accountNumber: "083-922-0900",
				accountHolder: "Trần Hồng Hải",
				qrCodeImage: MOMO_QR,
				scale: 1,
			},
		},
		{
			id: "PAYPAL",
			name: "PayPal",
			description: "Thanh toán an toàn qua tài khoản PayPal",
			isActive: false,
			info: {
				label: "PayPal",
				logo: PAYPAL_1_ICON,
				accountNumber: "paypal-account-number",
				accountHolder: "CONG TY TNHH NOOBSTORE",
			},
			value: "PAYPAL",
			icon: PAYPAL_1_ICON,
			isOnlyIcon: true,
			iconW: 90,
			iconH: 48,
			scale: 2.2,
		},
	];

	const renderPaymentInstructions = (): JSX.Element | null => {
		// if (!showPaymentInstructions) return null;

		return (
			<div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg border-2 border-blue-200 p-6 mb-6">
				<div className="flex items-center gap-3 mb-6">
					<span className="text-3xl">📋</span>
					<div>
						<h3 className="text-xl font-bold text-blue-800">
							Hướng dẫn chuyển khoản
						</h3>
						<p className="text-blue-600">
							Vui lòng chuyển khoản theo thông tin bên dưới
						</p>
					</div>
				</div>

				<div className="bg-white rounded-lg p-6 shadow-inner border">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-1">
								🏦 Ngân hàng
							</label>
							<p className="text-lg font-mono bg-gray-50 p-2 rounded">
								Vietcombank
							</p>
						</div>
						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-1">
								💳 Số tài khoản
							</label>
							<p className="text-lg font-mono bg-gray-50 p-2 rounded font-bold text-blue-600">
								1234567890
							</p>
						</div>
						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-1">
								👤 Chủ tài khoản
							</label>
							<p className="text-lg bg-gray-50 p-2 rounded">
								CONG TY TNHH NOOBSTORE
							</p>
						</div>
						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-1">
								📝 Nội dung chuyển khoản
							</label>
							<p className="text-lg font-mono bg-gray-50 p-2 rounded font-bold text-green-600">
								{service?.serviceBookingId} - Thanh toan dich vu
							</p>
						</div>
					</div>

					<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
						<div className="flex items-start gap-3">
							<span className="text-yellow-600 text-xl">⚠️</span>
							<div>
								<p className="font-semibold text-yellow-800">
									Lưu ý quan trọng:
								</p>
								<ul className="text-yellow-700 text-sm mt-1 space-y-1">
									<li>
										• Vui lòng chuyển khoản đúng số tiền và
										ghi đúng nội dung
									</li>
									<li>
										• Thanh toán sẽ được xác nhận tự động
										trong vòng 5-10 phút
									</li>
									<li>
										• Liên hệ hotline 1900-xxxx nếu cần hỗ
										trợ
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	};

	if (isPending) {
		return <Base isLoading={true} />;
	}

	if (!service || !Object.values(service || {}).length) {
		return (
			<Base>
				<div className="flex flex-col items-center justify-center h-full py-20">
					<span className="text-6xl mb-4">❌</span>
					<h2 className="text-2xl font-bold mb-2">
						Dịch vụ không tồn tại
					</h2>
					<p className="text-gray-600">
						Không tìm thấy dịch vụ với ID đã cung cấp. Vui lòng kiểm
						tra lại liên kết hoặc quay lại trang chủ.
					</p>
					<div className="flex gap-4">
						<button
							onClick={() => router.push("/services")}
							className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300">
							Quay lại danh sách dịch vụ
						</button>
						<button
							onClick={() => router.push("/")}
							className="mt-6 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300">
							Về trang chủ
						</button>
					</div>
				</div>
			</Base>
		);
	}

	return (
		<Base isLoading={isPending}>
			<div className="max-w-full relative z-1 h-full grid grid-cols-12 gap-4 my-8">
				<div className="col-span-8 flex flex-col gap-6 bg-white p-4 rounded-lg shadow-lg">
					<ServiceHeader />
					<BlockServiceStep currentStep={currentStep} />
					<DeliveryInformation service={service} />
					{service.paymentStatus === EnumPaymentStatus.PENDING ? (
						<PaymentBlock service={service} />
					) : (
						<PaymentStatusChecking service={service} />
					)}
				</div>
				<div className="col-span-4 space-y-4">
					<ServiceDetail id={id as string} />
				</div>
			</div>
		</Base>
	);
};

export default ServiceInfoPage;
