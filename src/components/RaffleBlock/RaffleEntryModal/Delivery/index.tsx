import { useMemo, useEffect } from "react";
import { useAuth } from "@/context/Auth";
import { IAuthUser } from "@/interface/Context/auth";
import { VNCity } from "@/constants";
import SelectWithIcon from "@/components/selectWIcon";
import { IStepProps } from "@/interface/Raffle";

const StepDeliveryInfo: React.FC<IStepProps> = ({
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

export default StepDeliveryInfo;
