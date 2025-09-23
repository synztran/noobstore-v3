import React, { useState, useEffect, useMemo, useRef } from "react";
import { X, User, CheckCircle, Verified, Check, Truck } from "lucide-react";
import { RaffleData, RaffleEntryForm, PaymentMethod } from "@/interface/Raffle";
import Image from "next/image";
import { formatCurrency } from "@/utils/FormatNumber";
import { useAuth } from "@/context/Auth";
import { IAuthUser } from "@/interface/Context/auth";
import SimpleTextField from "@/components/InputComponents/SimpleTextField";
import { VNCity } from "@/constants";
import SelectWithIcon from "@/components/selectWIcon";
import {
	InvisibleRecaptcha,
	RecaptchaWrapperRef,
} from "@/components/RecaptchaWrapper";
import { getRecaptchaToken } from "@/utils/recaptchaUtils";
import NotifyUtils from "@/utils/NotifyUtils";
import { Divider } from "@mui/material";

// --- Step Components ---

interface StepProps {
	formData: FormData;
	setFormData?: React.Dispatch<React.SetStateAction<FormData>>;
	raffleData: RaffleData;
	handleInputChange?: (
		field: keyof FormData
	) => (
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => void;
	handleSelectChange?: (
		field: keyof FormData
	) => (event: React.ChangeEvent<HTMLSelectElement>) => void;
	minPrice?: number;
	maxPrice?: number;
	handleChangeCity?: (value: string) => void;
}

type ProductSelection = {
	productId: string;
	name: string;
	priority: number | null; // null means not selected
	selected: boolean;
	thumbnail: string;
	price: number;
};

type FormData = Omit<RaffleEntryForm, "ticketQuantity"> & {
	companyName: string;
	zipCode: string;
	cardNumber: string;
	expiryDate: string;
	cvv: string;
	cardName: string;
	productSelections: ProductSelection[];
	shippingMethod: {
		brand: string;
		price: number;
	};
	note: string;
};

const StepSelectProduct: React.FC<StepProps> = ({
	formData,
	setFormData,
	raffleData,
}) => {
	const handleProductToggle = (productId: string) => {
		if (!setFormData) return;

		setFormData((prev) => {
			const isSelecting = !prev.productSelections.find(
				(product) => product.productId === productId
			)?.selected;

			let newSelections;
			if (isSelecting) {
				// Add to selected, assign next available priority (max + 1)
				const currentPriorities = prev.productSelections
					.filter((p) => p.selected && p.priority !== null)
					.map((p) => p.priority as number);
				const nextPriority =
					currentPriorities.length > 0
						? Math.max(...currentPriorities) + 1
						: 1;

				newSelections = prev.productSelections.map((product) =>
					product.productId === productId
						? {
								...product,
								selected: true,
								priority: nextPriority,
						  }
						: product
				);
			} else {
				// Unselect, remove priority, and reassign priorities to keep them contiguous
				newSelections = prev.productSelections.map((product) =>
					product.productId === productId
						? {
								...product,
								selected: false,
								priority: null,
						  }
						: product
				);

				// Reassign priorities based on selection order
				const selected = newSelections
					.filter((p) => p.selected)
					.sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0))
					.map((p, idx) => ({
						...p,
						priority: idx + 1,
					}));

				newSelections = newSelections.map((product) => {
					const found = selected.find(
						(p) => p.productId === product.productId
					);
					return found ? found : { ...product, priority: null };
				});
			}

			return {
				...prev,
				productSelections: newSelections,
			};
		});
	};

	const selectedProducts = formData.productSelections.filter(
		(p) => p.selected
	);

	return (
		<div className="space-y-6">
			<div className="text-center mb-6">
				<div className="text-2xl font-bold">Lựa chọn sản phẩm</div>
				<div className="text-gray-500">
					Chọn sản phẩm và thiết lập thứ tự ưu tiên.
				</div>
			</div>

			{/* Product Selection */}
			<div className="space-y-4">
				<div className="font-semibold text-base mb-3">
					Chọn sản phẩm và thiết lập thứ tự ưu tiên:
				</div>

				{formData.productSelections.map((product, index) => (
					<div
						key={product.productId}
						className={`p-4 rounded-lg border-2 transition-all ${
							product.selected
								? "border-blue-500 bg-blue-50"
								: "border-gray-200 bg-gray-50"
						}`}>
						<div className="flex items-center gap-4">
							{/* Checkbox */}
							<label className="flex items-center cursor-pointer w-full">
								<div className="flex items-center gap-4">
									<div className="relative w-28 h-28">
										<Image
											src={product.thumbnail}
											alt={product.name}
											className="w-28 h-28 object-cover rounded-lg"
											loading="lazy"
											fill
											objectFit="cover"
										/>
									</div>
									<div className="flex flex-col">
										<span className="font-medium text-lg">
											{product.name}
										</span>
										{formData.productSelections.find(
											(p) =>
												p.productId ===
												product.productId
										)?.selected && (
											<div className="mt-2 text-base text-blue-600 bg-blue-100 px-2 py-1 rounded inline-block">
												Thứ tự ưu tiên:{" "}
												{product.priority}
											</div>
										)}
									</div>
								</div>
								<input
									type="checkbox"
									checked={product.selected}
									onChange={() =>
										handleProductToggle(product.productId)
									}
									className="!w-5 !h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer ml-auto"
								/>
							</label>

							{/* Priority Selector */}
							{/* {product.selected && (
								<div className="ml-auto flex items-center gap-2">
									<select
										value={product.priority || 1}
										onChange={(e) =>
											handlePriorityChange(
												product.productId,
												parseInt(e.target.value)
											)
										}
										className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
										{Array.from(
											{
												length: formData
													.productSelections.length,
											},
											(_, i) => (
												<option
													key={i + 1}
													value={i + 1}>
													{i + 1}
												</option>
											)
										)}
									</select>
								</div>
							)} */}
						</div>
					</div>
				))}
			</div>

			{/* Selection Summary */}
			{selectedProducts.length > 0 && (
				<div className="p-4 rounded-lg bg-gray-200">
					<div className="font-semibold text-base mb-3">
						📋 Tóm tắt lựa chọn:
					</div>
					<div className="space-y-2">
						{selectedProducts
							.sort(
								(a, b) => (a.priority || 0) - (b.priority || 0)
							)
							.map((product) => (
								<div
									key={product.productId}
									className="flex justify-between text-sm">
									<span>
										#{product.priority} - {product.name}
									</span>
									<span className="font-medium text-green-600">
										<CheckCircle className="stroke-green-600 w-6 h-6" />
									</span>
								</div>
							))}
					</div>
					<div className="mt-3 p-2 bg-green-200 rounded text-base text-green-800">
						💡 Giới hạn số lượng trúng là x và sẽ dựa vào thứ tự ưu
						tiên đã chọn
					</div>
				</div>
			)}
		</div>
	);
};

const StepDeliveryInfo: React.FC<StepProps> = ({
	formData,
	setFormData,
	handleInputChange,
	handleSelectChange,
	handleChangeCity,
}) => {
	const { user } = useAuth() as unknown as { user: IAuthUser };
	const validCity = useMemo(() => {
		return VNCity?.filter((item) => item.isDeleted === false).sort(
			(a, b) => {
				if (a.code === "79" || a.code === "01") return -1;
				if (b.code === "79" || b.code === "01") return 1;
				return 0;
			}
		);
	}, [VNCity]);
	console.log("user", user);

	useEffect(() => {
		if (user) {
			setFormData?.({
				...formData,
				fullName: user.firstName + " " + user.lastName,
				email: user.email,
				phone: user.phoneNumber,
				address: user.shippingAt?.[0]?.address,
				city: user.shippingAt?.[0]?.city,
				companyName: user.shippingAt?.[0]?.companyName,
				zipCode: user.shippingAt?.[0]?.zipCode,
			});
		}
	}, [user]);
	return (
		<div className="space-y-4">
			<div className="text-center mb-6">
				<div className="text-2xl font-bold">Thiết lập giao hàng</div>
				<div className="text-gray-500">
					Thiết lập thông tin liên hệ và giao hàng
				</div>
			</div>
			{/* Contact Information Section */}
			<div className="p-4 rounded-lg bg-blue-50">
				<div className="mb-3 flex items-center gap-2 font-semibold text-xl">
					🏠 Thông tin liên hệ
				</div>
				<div className="space-y-3">
					<div className="flex flex-col gap-1">
						<label className="text-lg">Tên</label>
						<input
							type="text"
							className="w-full border border-gray-300 rounded px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
							placeholder="Full Name *"
							value={formData.fullName}
							onChange={handleInputChange?.("fullName")}
						/>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
						<div className="flex flex-col gap-1">
							<label className="text-lg">Email</label>
							<input
								type="email"
								className="w-full border border-gray-300 rounded px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
								placeholder="Email Address *"
								value={formData.email}
								onChange={handleInputChange?.("email")}
							/>
						</div>
						<div className="flex flex-col gap-1">
							<label className="text-lg">Số điện thoại</label>
							<input
								type="text"
								className="w-full border border-gray-300 rounded px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
								placeholder="Phone Number *"
								value={formData.phone}
								onChange={handleInputChange?.("phone")}
							/>
						</div>
					</div>
				</div>
			</div>
			{/* Delivery Address Section */}
			<div className="p-4 rounded-lg bg-gray-200">
				<div className="mb-3 font-semibold text-xl">
					📦 Thông tin giao hàng
				</div>
				<div className="space-y-3">
					<div className="flex flex-col gap-1">
						<label className="text-lg">Địa chỉ</label>
						<textarea
							className="w-full border border-gray-300 rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-green-400 h-[120px] resize-none"
							placeholder="Địa chỉ *"
							value={formData.address}
							onChange={handleInputChange?.("address")}
							rows={2}
						/>
					</div>
					<div className="flex flex-col gap-1">
						<label className="text-lg">
							Tên công ty (không bắt buộc)
						</label>
						<input
							type="text"
							className="w-full border border-gray-300 rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-green-400"
							placeholder="Tên công ty (không bắt buộc)"
							value={formData.companyName}
							onChange={handleInputChange?.("companyName")}
						/>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
						<div className="flex flex-col gap-1">
							<label className="text-lg">Thành phố</label>
							<SelectWithIcon
								selectList={validCity}
								isIcon={false}
								name="city"
								setFieldValue={handleChangeCity}
							/>
						</div>
						<div className="flex flex-col gap-1">
							<label className="text-lg">Mã bưu điện</label>
							<input
								type="text"
								className="w-full border border-gray-300 rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-green-400 h-full"
								placeholder="Zip Code *"
								value={formData.zipCode}
								onChange={handleInputChange?.("zipCode")}
							/>
						</div>
					</div>
				</div>
			</div>
			<div className="mt-4 bg-gray-200 rounded-lg p-4 space-y-4">
				<label className="font-semibold text-lg block items-center gap-2">
					🚚 Đơn vị vận chuyển
				</label>
				<div className="flex items-center">
					<label className="flex justify-between items-center cursor-pointer w-full">
						<div className="flex items-center gap-2">
							<input
								type="radio"
								name="shippingPartner"
								value="VNPost"
								checked={
									formData.shippingMethod.brand === "VNPost"
								}
								onChange={() => {
									if (typeof setFormData === "function") {
										setFormData((prev: any) => ({
											...prev,
											shippingMethod: {
												...prev.shippingMethod,
												brand: "VNPost",
											},
										}));
									}
								}}
								className="w-5 h-5 text-green-600 border-gray-300 focus:ring-green-500"
							/>
							<span className="text-lg font-medium ml-auto my-auto">
								VNPost
							</span>
						</div>
						<span className="text-base font-medium">Miễn phí</span>
					</label>
				</div>
			</div>
			<div className="mt-4">
				<label className="font-semibold text-lg block mb-2">
					Ghi chú/Góp ý
				</label>
				<textarea
					className="w-full border border-gray-300 rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-green-400"
					placeholder="Nhập ghi chú của bạn (ví dụ: yêu cầu đặc biệt về sản phẩm, giao hàng, v.v.)"
					value={formData.note || ""}
					onChange={handleInputChange?.("note")}
					rows={3}
				/>
			</div>
		</div>
	);
};

const StepInformation: React.FC<StepProps> = ({
	raffleData,
	minPrice,
	maxPrice,
}) => {
	return (
		<div className="space-y-6">
			<div className="text-center mb-6">
				<div className="text-2xl font-bold">Thông tin Raffle</div>
				<div className="text-gray-600">
					Đọc kỹ thông tin và chính sách trước khi tham gia
				</div>
			</div>

			{/* Raffle Information */}
			{/* <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
				<div className="flex items-center gap-4 mb-4">
					<Image
						src={raffleData.images?.[0]?.url || ""}
						alt={raffleData.title}
						className="w-20 h-20 object-cover rounded-lg"
						width={80}
						height={80}
					/>
					<div className="flex-1">
						<div className="text-xl font-bold mb-2">
							{raffleData.title}
						</div>
						<div
							className="text-base text-gray-800 mb-2"
							style={{ textIndent: "0.5rem" }}>
							{raffleData.description}
						</div>
						<div className="flex items-center gap-4 text-sm">
							<span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
								💰 Giá trị: {formatCurrency(minPrice || 0)} -{" "}
								{formatCurrency(maxPrice || 0)}
							</span>
							<span className="bg-red-100 text-red-700 px-2 py-1 rounded">
								🎯 Kết thúc:{" "}
								{new Date(
									raffleData.endDate
								).toLocaleDateString("vi-VN")}
							</span>
						</div>
					</div>
				</div>
			</div> */}

			{/* Product Information */}
			{/* <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200">
				<div className="mb-3 font-semibold text-base flex items-center gap-2">
					📦 Thông tin sản phẩm
				</div>
				<div className="space-y-3">
					{raffleData.features && raffleData.features.length > 0 && (
						<div>
							<div className="font-medium text-sm mb-2">
								Tính năng nổi bật:
							</div>
							<ul className="text-xs space-y-1 text-gray-700">
								{raffleData.features.map((feature, index) => (
									<li
										key={index}
										className="flex items-center gap-2">
										<span className="text-green-500">
											✓
										</span>
										{feature}
									</li>
								))}
							</ul>
						</div>
					)}
					{raffleData.categories &&
						raffleData.categories.length > 0 && (
							<div>
								<div className="font-medium text-sm mb-2">
									Danh mục:
								</div>
								<div className="flex flex-wrap gap-2">
									{raffleData.categories.map(
										(category, index) => (
											<span
												key={index}
												className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
												{category}
											</span>
										)
									)}
								</div>
							</div>
						)}
				</div>
			</div> */}

			{/* Seller Information */}
			<div className="p-4 rounded-lg bg-gray-200">
				<div className="mb-3 font-semibold text-lg flex items-center gap-2">
					👤 Thông tin maker
				</div>
				<div className="flex items-center gap-3 mb-3">
					<div className="relative w-20 h-20">
						<Image
							src={
								raffleData.seller.avatar ||
								"/default-avatar.png"
							}
							alt={raffleData.seller.name}
							className="w-60 h-60 rounded-full"
							fill
							objectFit="cover"
						/>
					</div>
					<div className="flex flex-col">
						<div className="font-medium text-xl flex items-center gap-2">
							{raffleData.seller.name}
							<Verified className="stroke-green-600 w-6 h-6" />
						</div>
						<div className="flex items-center gap-3 text-sm text-gray-600">
							<span>⭐ {raffleData.seller.rating}/5</span>
							<span>
								📦 {raffleData.seller.totalSales} đơn hàng
							</span>
						</div>
					</div>
				</div>
				<div className="text-base text-gray-700">
					Người bán đã được xác minh và có uy tín tốt trên nền tảng
				</div>
			</div>

			{/* Store Policies */}
			<div className="p-4 rounded-lg bg-gray-200">
				<div className="mb-3 font-semibold text-lg flex items-center gap-2">
					🏪 Chính sách của NoobStore
				</div>
				<div className="space-y-2 text-sm text-gray-700">
					<div className="flex items-center gap-2">
						<span className="text-yellow-600">•</span>
						<span>
							Raffle được tổ chức minh bạch, công khai kết quả
						</span>
					</div>
					<div className="flex items-center gap-2">
						<span className="text-yellow-600">•</span>
						<span>
							Mỗi khách hàng chỉ được tham gia 1 lần vào mỗi đợt
							raffle
						</span>
					</div>
					<div className="flex items-center gap-2">
						<span className="text-yellow-600">•</span>
						<span>
							Kết quả được công bố trong vòng x giờ sau khi raffle
							kết thúc
						</span>
					</div>
					<div className="flex items-center gap-2">
						<span className="text-yellow-600">•</span>
						<span>
							Khách hàng nhận được mail thông báo có 24 giờ để
							thanh toán, quá hạn sẽ sẽ được re-roll chuyển cho
							người tiếp theo
						</span>
					</div>
					<div className="flex items-center gap-2">
						<span className="text-yellow-600">•</span>
						<span>
							NoobStore và maker sẽ đảm bảo quyền lời cho người
							tham gia, đảm bảo một cộng đồng raffle công bằng
						</span>
					</div>
				</div>
			</div>

			{/* Maker Policies */}
			<div className="p-4 rounded-lg bg-gray-200">
				<div className="mb-3 font-semibold text-lg flex items-center gap-2">
					🔧 Chính sách của {raffleData.seller.name}
				</div>
				<div className="space-y-2 text-sm text-gray-700">
					<div className="flex items-center gap-2">
						<span className="text-indigo-600">•</span>
						<span>
							Sản phẩm được thiết kế và sản xuất thủ công không,
							màu sắc có thể sẽ không giống 100% với ảnh chụp
						</span>
					</div>
					<div className="flex items-center gap-2">
						<span className="text-indigo-600">•</span>
						<span>
							Sản phẩm đã bao gồm chi phị vận chuyển nội địa, với
							khách hàng không nằm trong khu vực nội địa sẽ được
							tính thêm chi phí vận chuyển
						</span>
					</div>
					<div className="flex items-center gap-2">
						<span className="text-indigo-600">•</span>
						<span>
							Hỗ trợ kỹ thuật 24/7 qua hotline và email chính thức
						</span>
					</div>
					<div className="flex items-center gap-2">
						<span className="text-indigo-600">•</span>
						<span>
							Sản phẩm được kiểm tra chất lượng trước khi giao
							hàng
						</span>
					</div>
				</div>
			</div>

			{/* Important Agreement Notice */}
			<div className="p-4 rounded-lg bg-gray-200">
				<div className="mb-3 font-bold text-base flex items-center gap-2">
					⚠️ LƯU Ý QUAN TRỌNG
				</div>
				<div className="bg-red-100 p-3 rounded-lg border border-red-200">
					<div className="text-base text-red-800 font-medium mb-2">
						Bằng việc tiếp tục bước tiếp theo, bạn đồng ý với:
					</div>
					<ul className="text-xs text-red-700 space-y-1">
						<li className="flex items-center gap-2">
							<Check className="stroke-green-600" /> Tất cả các
							chính sách của cửa hàng được nêu ở trên
						</li>
						<li className="flex items-center gap-2">
							<Check className="stroke-green-600" /> Các điều
							khoản và chính sách của nhà sản xuất
						</li>
						<li className="flex items-center gap-2">
							<Check className="stroke-green-600" /> Quy trình
							thanh toán và giao hàng khi thắng giải
						</li>
						<li className="flex items-center gap-2">
							<Check className="stroke-green-600" /> Cam kết thanh
							toán đúng hạn nếu nhận được mail thông báo
						</li>
						<li className="flex items-center gap-2">
							<Check className="stroke-green-600" /> Không được
							hủy bỏ sau khi đã xác nhận tham gia
						</li>
					</ul>
				</div>
			</div>

			{/* Contact Support */}
			{/* <div className="rounded border-l-4 border-blue-400 bg-blue-50 p-3">
				<div className="text-sm text-blue-800 flex items-start gap-2">
					<span role="img" aria-label="support" className="mt-0.5">
						💬
					</span>
					<div>
						<div className="font-medium mb-1">Cần hỗ trợ?</div>
						<div className="flex flex-col gap-2 text-base">
							<div>
								Liên hệ:{" "}
								<span className="font-medium border border-blue-600 rounded-sm px-2">
									noobassembly@gmail.com
								</span>
							</div>
							<div>
								Facebook:{" "}
								<span className="font-medium border border-blue-600 rounded-sm px-2">
									https://www.fb.com/noobassembly
								</span>
							</div>
						</div>
					</div>
				</div>
			</div> */}
		</div>
	);
};

const StepConfirmation: React.FC<{
	formData: FormData;
}> = ({ formData }) => {
	const selectedProducts = formData.productSelections.filter(
		(p) => p.selected
	);

	// Generate a random registration code for more realism
	const registrationCode = React.useMemo(
		() => "#RF" + Math.floor(100000 + Math.random() * 900000).toString(),
		[]
	);

	return (
		<div className="flex flex-col items-center space-y-8 py-4 ">
			{/* Success Icon */}
			{/* <div className="relative flex flex-col items-center">
				<div className="w-24 h-24 bg-gradient-to-tr from-green-300 via-green-200 to-green-100 rounded-full flex items-center justify-center shadow-lg animate-bounce-slow">
					<CheckCircle
						className="text-green-700 drop-shadow-lg"
						size={56}
					/>
				</div>
			</div> */}
			{/* Title */}
			<div className="text-3xl font-extrabold text-green-700 drop-shadow-sm tracking-wide">
				Đăng ký thành công! 🎉
			</div>
			{/* Congratulation Box */}
			{/* <div className="rounded-xl border-l-8 border-green-400 bg-gradient-to-r from-green-50 to-green-100 p-4 text-left shadow-md w-full max-w-lg">
				<div className="text-green-800 font-semibold text-lg flex items-center gap-2">
					<span className="text-2xl">🥳</span>
					Chúc mừng! Bạn đã đăng ký tham gia raffle thành công.
				</div>
			</div> */}
			{/* Registration Details */}
			<div className="p-6 rounded-2xl bg-white text-left shadow-lg w-full max-w-lg border border-gray-100">
				{/* <div className="font-bold mb-4 text-lg text-blue-700 flex items-center gap-2">
					<CheckCircle className="text-blue-400" size={20} />
					Chi tiết đăng ký
				</div> */}
				<div className="space-y-4">
					<div className="flex justify-between text-base">
						<span className="text-gray-600 text-lg">
							Mã đăng ký:
						</span>
						<span className="font-bold text-blue-600 tracking-wider text-lg">
							{registrationCode}
						</span>
					</div>
					<div className="flex justify-between text-base">
						<span className="text-gray-600 text-lg">
							Số sản phẩm đã chọn:
						</span>
						<span className="font-semibold text-green-700 text-lg">
							{selectedProducts.length} sản phẩm
						</span>
					</div>
					<div className="border-t pt-4">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							{selectedProducts
								.sort(
									(a, b) =>
										(a.priority || 0) - (b.priority || 0)
								)
								.map((product) => (
									<div
										key={product.productId}
										className="flex flex-col items-center gap-2 bg-white border border-blue-200 rounded-lg p-2 shadow-sm">
										<div className="w-48 h-48 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 bg-white shadow relative">
											{product.thumbnail ? (
												<Image
													src={product.thumbnail}
													alt={product.name}
													className="object-cover w-full h-full hover:scale-110 transition-all duration-300 ease-in-out"
													fill
												/>
											) : (
												<div className="flex items-center justify-center w-full h-full text-gray-300 text-2xl bg-gray-100">
													📦
												</div>
											)}
										</div>
										<div className="flex-1 min-w-0">
											<div className="font-semibold text-blue-900 truncate">
												{product.name}
											</div>
											{/* <div className=" text-green-600 font-bold text-xs bg-green-100 px-2 py-1 rounded">
												#{product.priority}
											</div> */}
										</div>
									</div>
								))}
						</div>
					</div>
				</div>
			</div>
			{/* Next Steps */}
			<div className="p-5 rounded-xl bg-gradient-to-r from-blue-100 to-blue-50 border border-blue-200 w-full max-w-lg shadow">
				<div className="text-base text-blue-800">
					<div className="font-semibold mb-2 flex items-center gap-2 text-xl">
						<span className="text-xl">🚀</span>
						Bước tiếp theo
					</div>
					<ul className="space-y-1 text-left pl-8 list-disc">
						<li className="text-lg">
							Chúng tôi sẽ thông báo kết quả khi raffle kết thúc.
						</li>
						<li className="text-lg">
							Nếu trúng thưởng, bạn sẽ được mail thông báo để xác
							nhận và thanh toán.
						</li>
					</ul>
				</div>
			</div>
			<div className="text-gray-500 font-medium flex items-center gap-2">
				<span className="text-2xl">Chúc bạn may mắn!</span>
				<span className="text-2xl animate-bounce">🍀</span>
			</div>
		</div>
	);
};

// --- Stepper Component ---
const steps = ["Thông tin", "Lựa chọn", "Thiết lập giao hàng", "Xác nhận"];
const Stepper: React.FC<{ activeStep: number }> = ({ activeStep }) => (
	<div className="flex justify-between items-center">
		{steps.map((label, idx) => (
			<div key={label} className="flex-1 flex flex-col items-center">
				<div
					className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${
						activeStep === idx
							? "bg-blue-600 border-blue-600 text-white"
							: activeStep > idx
							? "bg-green-500 border-green-500 text-white"
							: "bg-gray-200 border-gray-300 text-gray-500"
					} font-bold`}>
					{idx + 1}
				</div>
				<div
					className={`mt-2 text-base ${
						activeStep === idx
							? "text-blue-600 font-semibold"
							: "text-gray-500"
					}`}>
					{label}
				</div>
			</div>
		))}
	</div>
);

// --- Main Modal Component ---

interface RaffleEntryModalProps {
	open: boolean;
	onClose: () => void;
	raffleData: RaffleData;
	minPrice: number;
	maxPrice: number;
}

const RaffleEntryModal: React.FC<RaffleEntryModalProps> = ({
	open,
	onClose,
	raffleData,
	minPrice,
	maxPrice,
}) => {
	const [activeStep, setActiveStep] = useState(0);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const recaptchaRef = useRef<RecaptchaWrapperRef>(null);
	const [formData, setFormData] = useState<FormData>({
		fullName: "",
		email: "",
		phone: "",
		address: "",
		city: "",
		paymentMethod: PaymentMethod.CREDIT_CARD,
		cardNumber: "",
		expiryDate: "",
		cvv: "",
		cardName: "",
		productSelections:
			raffleData.productOptions?.map((option, index) => ({
				productId: option.id,
				name: option.label,
				priority: null,
				selected: false,
				price: option.price,
				thumbnail: option.url, // Add the required thumbnail property
			})) || [],
		companyName: "",
		zipCode: "",
		shippingMethod: {
			brand: "VNPost",
			price: 0,
		},
		note: "",
	});

	const handleNext = () => {
		if (activeStep < steps.length - 1) {
			setActiveStep((prevStep) => prevStep + 1);
		}
	};

	const handleBack = () => {
		setActiveStep((prevStep) => prevStep - 1);
	};

	const handleInputChange =
		(field: keyof FormData) =>
		(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			setFormData({
				...formData,
				[field]: event.target.value,
			});
		};

	const handleSelectChange =
		(field: keyof FormData) =>
		(event: React.ChangeEvent<HTMLSelectElement>) => {
			setFormData({
				...formData,
				[field]: event.target.value,
			});
		};

	const handleSubmit = async () => {
		try {
			setIsSubmitting(true);

			// Get reCAPTCHA token before submitting
			// const recaptchaToken = await getRecaptchaToken(
			// 	process.env.NEXT_PUBLIC_RECAPCHA_SITE_TO_RECAPCHA_KEY || "",
			// 	"raffle_entry"
			// );

			// if (!recaptchaToken) {
			// 	NotifyUtils.error(
			// 		"Không thể xác thực reCAPTCHA. Vui lòng thử lại."
			// 	);
			// 	return;
			// }

			// console.log("Submitting raffle entry with data:", {
			// 	...formData,
			// 	recaptchaToken,
			// });

			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 2000));

			// Show success message and proceed to confirmation
			NotifyUtils.success("Đăng ký raffle thành công!");
			handleNext();
		} catch (error) {
			console.error("Raffle entry error:", error);
			NotifyUtils.error(
				"Có lỗi xảy ra khi đăng ký raffle. Vui lòng thử lại."
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	const resetAndClose = () => {
		setActiveStep(0);
		setFormData({
			fullName: "",
			email: "",
			phone: "",
			address: "",
			city: "",
			paymentMethod: PaymentMethod.CREDIT_CARD,
			cardNumber: "",
			expiryDate: "",
			cvv: "",
			cardName: "",
			productSelections:
				raffleData.productOptions?.map((option, index) => ({
					productId: option.id,
					name: option.label,
					price: option.price,
					thumbnail: option.url,
					priority: null,
					selected: false,
				})) || [],
			companyName: "",
			zipCode: "",
			shippingMethod: {
				brand: "VNPost",
				price: 0,
			},
			note: "",
		});
		onClose();
	};

	const handleChangeCity = (value: string) => {
		setFormData({
			...formData,
			city: value,
		});
	};

	// Prevent scroll when modal is open
	useEffect(() => {
		if (open) {
			const originalStyle = window.getComputedStyle(
				document.body
			).overflow;
			document.body.style.overflow = "hidden";
			return () => {
				document.body.style.overflow = originalStyle;
			};
		}
		return undefined;
	}, [open]);

	if (!open) return null;

	let stepContent: React.ReactNode = null;
	switch (activeStep) {
		case 0:
			stepContent = (
				<StepInformation
					formData={formData}
					raffleData={raffleData}
					minPrice={minPrice}
					maxPrice={maxPrice}
				/>
			);

			break;
		case 1:
			stepContent = (
				<StepSelectProduct
					formData={formData}
					setFormData={setFormData}
					raffleData={raffleData}
					handleInputChange={handleInputChange}
					handleSelectChange={handleSelectChange}
				/>
			);

			break;
		case 2:
			stepContent = (
				<StepDeliveryInfo
					formData={formData}
					setFormData={setFormData}
					raffleData={raffleData}
					handleInputChange={handleInputChange}
					handleSelectChange={handleSelectChange}
					handleChangeCity={handleChangeCity}
				/>
			);
			break;
		case 3:
			stepContent = <StepConfirmation formData={formData} />;
			break;
		default:
			stepContent = null;
	}

	console.log(activeStep);

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			{/* Backdrop */}
			<div
				className="fixed inset-0 bg-black/40 backdrop-blur-md"
				aria-hidden="true"
			/>
			<div className="relative bg-white rounded-xl shadow-xl w-[95vw] sm:w-[80vw] md:w-[70vw] lg:w-[60vw] max-w-[800px] max-h-[90vh] flex flex-col overflow-hidden h-[min(500px,  60vh)]">
				{/* Header */}
				<div className="flex justify-between items-center p-4">
					<div className="text-lg font-semibold">
						Join Raffle - {raffleData.title}
					</div>
					<button
						type="button"
						onClick={onClose}
						className="p-2 rounded hover:bg-gray-100 transition"
						aria-label="Close">
						<X />
					</button>
				</div>
				<Divider />
				{/* Stepper */}
				<div className="p-4">
					<Stepper activeStep={activeStep} />
				</div>
				<Divider />
				{/* Content */}
				<div className="p-4 h-full overflow-y-auto">{stepContent}</div>
				<Divider />
				{/* Footer */}
				<div className="flex justify-between items-center p-4 bottom-0">
					{activeStep > 0 && (
						<button
							type="button"
							onClick={
								activeStep === 3 ? resetAndClose : handleBack
							}
							// disabled={activeStep === 0 || activeStep === 3}
							className={`px-6 py-2 rounded border font-medium transition ${
								activeStep === 0
									? "border-gray-200 text-gray-400 bg-gray-100 cursor-not-allowed"
									: "border-blue-600 text-blue-600 hover:bg-blue-50"
							}`}>
							{activeStep === 3 ? "Đóng" : "Quay lại"}
						</button>
					)}
					{activeStep < 3 && (
						<>
							{activeStep === 2 && (
								<script src="https://www.google.com/recaptcha/api.js?render=YOUR_RECAPTCHA_SITE_KEY"></script>
							)}
							<button
								type="button"
								onClick={async () => {
									if (activeStep === 2) {
										// reCAPTCHA v4 (invisible) - get token before submit
										if (
											typeof window !== "undefined"
											// &&window.grecaptcha
										) {
											try {
												setIsSubmitting(true);
												// const token =
												// 	await window.grecaptcha.execute(
												// 		"YOUR_RECAPTCHA_SITE_KEY",
												// 		{ action: "submit" }
												// 	);
												handleSubmit();
											} catch (err) {
												alert(
													"Xác thực reCAPTCHA thất bại. Vui lòng thử lại."
												);
												setIsSubmitting(false);
											}
										} else {
											alert(
												"Không thể xác thực reCAPTCHA. Vui lòng thử lại sau."
											);
										}
									} else {
										handleNext();
									}
								}}
								disabled={
									isSubmitting ||
									(activeStep === 1 &&
										(!formData.productSelections ||
											formData.productSelections.filter(
												(p) => p.selected
											).length === 0))
								}
								className={`px-6 py-2 rounded font-medium flex items-center gap-2 transition ml-auto ${
									isSubmitting ||
									(activeStep === 1 &&
										(!formData.productSelections ||
											formData.productSelections.filter(
												(p) => p.selected
											).length === 0))
										? "bg-blue-300 text-white cursor-not-allowed"
										: "bg-blue-600 text-white hover:bg-blue-700"
								}`}>
								{activeStep === 2 && <CheckCircle size={16} />}
								{isSubmitting
									? "Đang xử lý..."
									: activeStep === 2
									? "Hoàn tất đăng ký"
									: "Tiếp theo"}
							</button>
						</>
					)}
				</div>
			</div>
			{/* Invisible reCAPTCHA component */}
			{/* <InvisibleRecaptcha
				ref={recaptchaRef}
				siteKey={
					process.env.NEXT_PUBLIC_RECAPCHA_SITE_TO_RECAPCHA_KEY || ""
				}
				onError={(error) => {
					console.error("reCAPTCHA error:", error);
					NotifyUtils.error("Lỗi xác thực reCAPTCHA");
				}}
			/> */}
		</div>
	);
};

export default RaffleEntryModal;
