// using native select instead of SelectWithIcon
import { VNCity } from "@/constants";
import { useAuth } from "@/context/Auth";
import { IAuthUser } from "@/interface/Context/auth";
import useRaffle, {
	TRaffleFormShipping,
	useRaffleAction,
} from "@/zustand/useRaffle";
import { use, useEffect, useMemo } from "react";

interface IProps {
	handleInputChange: (
		field: string
	) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
	handleSelectChange: (field: string) => (value: string) => void;
}

const StepDeliveryInfo: React.FC<IProps> = ({
	handleInputChange,
	handleSelectChange,
}) => {
	// const { user } = useAuth() as unknown as { user: IAuthUser };
	const auth = useAuth();
	const { user } = auth || {};
	const shippingInfomation = user?.shippingAt?.[0];
	const { raffleSubmitForm } = useRaffle();
	const { updateRaffleSubmitForm } = useRaffleAction();
	const validCity = useMemo(() => {
		return VNCity?.filter((item) => item.isDeleted === false).sort(
			(a, b) => {
				if (a.code === "79" || a.code === "01") return -1;
				if (b.code === "79" || b.code === "01") return 1;
				return 0;
			}
		);
	}, [VNCity]);

	// Simple validation for required shipping fields
	const shippingAddressMissing = !raffleSubmitForm?.shipping?.address;
	const shippingCityMissing = !raffleSubmitForm?.shipping?.city;
	const shippingMethodMissing =
		!raffleSubmitForm?.shipping?.shippingMethod?.name;

	useEffect(() => {
		if (shippingInfomation) {
			updateRaffleSubmitForm({
				email: user?.email || "",
				name: user?.firstName + " " + user?.lastName || "",
				phone: user?.phoneNumber || "",
				shipping: {
					address: shippingInfomation.address || "",
					city: shippingInfomation.city || "",
					companyName: shippingInfomation.companyName || "",
					shippingMethod: {
						name: "VNPost",
						price: 0,
					},
				},
			});
		}
	}, [shippingInfomation]);

	console.log("shippingInfomation", shippingInfomation);

	return (
		<div className="space-y-4">
			<div className="text-center">
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
							value={
								raffleSubmitForm?.name ||
								user?.firstName + " " + user?.lastName ||
								""
							}
							onChange={handleInputChange?.("name")}
							// readOnly
						/>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
						<div className="flex flex-col gap-1">
							<label className="text-lg">Email</label>
							<input
								type="email"
								className="w-full border border-gray-300 rounded px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-200"
								placeholder="Email Address *"
								value={
									raffleSubmitForm?.email || user?.email || ""
								}
								onChange={handleInputChange?.("email")}
								disabled
							/>
						</div>
						<div className="flex flex-col gap-1">
							<label className="text-lg">Số điện thoại</label>
							<input
								type="text"
								className="w-full border border-gray-300 rounded px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
								placeholder="Phone Number *"
								value={
									raffleSubmitForm?.phone ||
									user?.phoneNumber ||
									""
								}
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
							value={raffleSubmitForm?.shipping?.address || ""}
							onChange={handleInputChange?.("shipping.address")}
							rows={2}
							required
						/>
						{shippingAddressMissing && (
							<div className="text-red-600 text-sm mt-1">
								Vui lòng nhập địa chỉ giao hàng.
							</div>
						)}
					</div>

					<div className="flex flex-col gap-1">
						<label className="text-lg">
							Tên công ty (không bắt buộc)
						</label>
						<input
							type="text"
							className="w-full border border-gray-300 rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-green-400"
							placeholder="Tên công ty"
							value={
								raffleSubmitForm?.shipping?.companyName || ""
							}
							onChange={handleInputChange?.(
								"shipping.companyName"
							)}
						/>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
						<div className="flex flex-col gap-1">
							<label className="text-lg">Thành phố</label>
							<select
								name="city"
								value={raffleSubmitForm?.shipping?.city || ""}
								onChange={(e) =>
									handleSelectChange?.("shipping.city")(
										e.target.value
									)
								}
								className="w-full border border-gray-300 rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-green-400 bg-white">
								<option value="">Lựa chọn</option>
								{validCity?.map((c) => (
									<option key={c.code} value={c.name}>
										{c.nameWithType}
									</option>
								))}
							</select>
							{shippingCityMissing && (
								<div className="text-red-600 text-sm mt-1">
									Vui lòng chọn thành phố.
								</div>
							)}
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
								required
								type="radio"
								name="shippingPartner"
								value="VNPost"
								checked={
									raffleSubmitForm?.shipping?.shippingMethod
										?.name === "VNPost"
								}
								defaultChecked
								onChange={() => {
									updateRaffleSubmitForm({
										shipping: {
											...(raffleSubmitForm?.shipping as TRaffleFormShipping),
											shippingMethod: {
												name: "VNPost",
												price: 0,
											},
										},
									});
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
				{shippingMethodMissing && (
					<div className="text-red-600 text-sm mt-2">
						Vui lòng chọn đơn vị vận chuyển.
					</div>
				)}
			</div>
			<div className="mt-4">
				<label className="font-semibold text-lg block mb-2">
					Ghi chú/Góp ý
				</label>
				<textarea
					className="w-full border-2 border-gray-300 rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
					placeholder="Nhập ghi chú của bạn (ví dụ: yêu cầu đặc biệt về sản phẩm, giao hàng, v.v.)"
					value={raffleSubmitForm?.note || ""}
					onChange={handleInputChange?.("note")}
					rows={4}
				/>
			</div>
		</div>
	);
};

export default StepDeliveryInfo;
