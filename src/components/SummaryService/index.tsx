import { Button, Divider } from "@material-ui/core";
import { ArrowUpDown, ChevronDown, Truck } from "lucide-react";
import React, { useRef, useState } from "react";
import {
	InvisibleRecaptcha,
	RecaptchaWrapperRef,
} from "@/components/RecaptchaWrapper";
import { getRecaptchaToken } from "@/utils/recaptchaUtils";
import NotifyUtils from "@/utils/NotifyUtils";
// import LogoStore from "../../public/assets/icons/logo.png";
import { formatCurrency } from "@/utils/FormatNumber";
import useServices, { useServiceAction } from "@/zustand/useServices";
import SummaryServiceCollapse from "./collapse";
import SummaryServiceDeliveryBlock from "./DeliveryBlock";
import SummaryServiceBlock from "./ServiceBlock";
import {
	MAPPING_DELIVERY_METHOD,
	MAPPING_ICON_SUMMARY_SERVICE,
} from "@/constants";
import LoadingDots from "../Effects/LoadingDots";
import DiscountBlock from "./DiscountBlock";
import { EnumShippingMethodCode } from "@/interface/interface";

const text = {
	title: "Dịch vụ cơ bản",
	location: "Hồ Chí Minh, Việt Nam",
};

const SummaryService: React.FC = () => {
	const {
		selectedOpt,
		selectedPlan,
		discount,
		shippingInfo,
		contactInfo,
		keyboardItems,
		switchItems,
		stabilizerItems,
		fees,
	} = useServices();
	const {
		calculateTotalPrice,
		calculateSubTotalPrice,
		submitServiceBooking,
	} = useServiceAction();
	const recaptchaRef = useRef<RecaptchaWrapperRef>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const {
		platFormFee,
		serviceOutOfTimeFee: { pickup, delivery },
	} = fees;

	const [isCollapse, setIsCollapse] = React.useState({
		note: true,
		delivery: true,
		services: true,
	});

	const handleCollapse = (target: "note" | "delivery" | "services") => {
		setIsCollapse((prev) => ({
			...prev,
			[target]: !prev[target],
		}));
	};

	console.log(
		"selectedPlan",
		selectedPlan,
		shippingInfo,
		contactInfo,
		keyboardItems,
		switchItems,
		stabilizerItems,
		fees,
		platFormFee,
		discount
	);
	return (
		<div
			className="border-2 border-gray-600 bg-white relative -top-[5rem] p-4 rounded-lg flex flex-col gap-4"
			id="summary-service-step">
			<div className="flex flex-col">
				<strong className="text-xl">
					{selectedOpt?.name ?? "Vui lòng chọn gói dịch vụ"}
				</strong>
				<span className="text-sm text-gray-600">{text.location}</span>
			</div>
			<div className="flex flex-col gap-2">
				{shippingInfo?.method?.code !==
				EnumShippingMethodCode.SELF_DELIVERY_SELF_PICKUP ? (
					<DetailContent
						icon={<Truck size={28} />}
						headContent={
							shippingInfo?.deliveryMethod.name !== "" ? (
								shippingInfo?.deliveryMethod.name
							) : (
								<LoadingDots />
							)
						}
						subTitle={shippingInfo?.deliveryMethod.code}
						endContent={
							shippingInfo?.deliveryMethod.code !== "" ? (
								<div className="flex items-center gap-2">
									<span className="text-lg">
										{shippingInfo?.deliveryMethod.price > 0
											? formatCurrency(
													shippingInfo?.deliveryMethod
														.price
											  )
											: "Miễn phí"}
									</span>
								</div>
							) : null
						}
						headClasses="font-bold"
						headContentClasses="text-lg"
					/>
				) : null}
				<DetailContent
					icon={<ArrowUpDown size={28} />}
					headContent={
						MAPPING_DELIVERY_METHOD[shippingInfo?.method.code] ?? (
							<LoadingDots />
						)
					}
					endContent={
						shippingInfo?.method.code !== "" ? (
							<div className="flex items-center gap-2">
								<span className="text-lg">
									{shippingInfo?.method.price > 0
										? formatCurrency(
												shippingInfo?.method.price
										  )
										: "Miễn phí"}
								</span>
							</div>
						) : null
					}
					headClasses="font-bold"
					headContentClasses="text-lg"
				/>
				<SummaryServiceDeliveryBlock />
				{shippingInfo?.addOns.map((addOn) => (
					<DetailContent
						icon={
							MAPPING_ICON_SUMMARY_SERVICE[addOn.value]?.icon ??
							null
						}
						key={addOn.value}
						headContent={addOn.name}
						endContent={
							<div className="flex items-center gap-2">
								<span className="text-lg">
									{addOn.price > 0
										? formatCurrency(addOn.price)
										: "Miễn phí"}
								</span>
							</div>
						}
						headClasses="font-bold"
						headContentClasses="text-lg"
					/>
				))}
				<SummaryServiceBlock />
			</div>
			<Divider />
			<div className="flex flex-col">
				<div
					className="flex justify-between items-center cursor-pointer"
					onClick={() => handleCollapse("note")}>
					<label className="cursor-pointer select-none">
						Ghi chú:
					</label>
					<div className="hover:bg-gray-200 rounded-full transition-all duration-150">
						<ChevronDown
							size={16}
							className={`cursor-pointer hover:bg-gray-200 rounded-full transition-all duration-150 transform ${
								isCollapse.note ? "-scale-y-100" : ""
							}`}
						/>
					</div>
				</div>
				<SummaryServiceCollapse isCollapse={isCollapse.note}>
					{keyboardItems.length > 0 ? (
						<textarea
							className="w-full h-20 p-2 resize-none rounded-md select-none"
							readOnly
							value={keyboardItems
								.map((keyboard) => keyboard.note)
								.join("\n")}
						/>
					) : null}
					{switchItems.length > 0 ? (
						<textarea
							className="w-full h-20 p-2 resize-none rounded-md"
							readOnly
							value={switchItems.map((sw) => sw.note).join("\n")}
						/>
					) : null}
					{stabilizerItems.length > 0 ? (
						<textarea
							className="w-full h-20 p-2 resize-none rounded-md"
							readOnly
							value={stabilizerItems
								.map((stabilizer) => stabilizer.note)
								.join("\n")}
						/>
					) : null}
				</SummaryServiceCollapse>
				<div className="flex flex-col gap-1">
					<DiscountBlock />
					<DetailContent
						headContent="Phí dịch vụ gói nâng cao:"
						headContentClasses="text-gray-600"
						headClasses="!text-sm text-gray-500"
						endContent={formatCurrency(selectedPlan?.price || 0)}
						itemEndClasses="text-base"
						endClasses="items-center"
						parentClasses="items-center"
					/>
					<DetailContent
						headContent="Phí dịch vụ & nền tảng:"
						headContentClasses="text-gray-600"
						headClasses="!text-sm text-gray-500"
						endContent={formatCurrency(platFormFee)}
						itemEndClasses="text-base"
						endClasses="items-center"
						parentClasses="items-center"
					/>
					{pickup > 0 || delivery > 0 ? (
						<DetailContent
							headContent="Phí hỗ trợ ngoại giờ:"
							headContentClasses="text-gray-600"
							headClasses="!text-sm text-gray-500"
							endContent={formatCurrency(pickup + delivery)}
						/>
					) : null}
					<DetailContent
						headContent="Tạm tính:"
						endContent={formatCurrency(calculateSubTotalPrice())}
						parentClasses="items-center"
					/>
					<DetailContent
						headContent="Giảm giá:"
						headContentClasses="text-gray-600"
						endContent={`-${formatCurrency(discount)}`}
						itemEndClasses="text-red-600"
						headClasses=""
						parentClasses="items-center"
					/>
					<Divider />
					<DetailContent
						headContent="Tổng tiền:"
						endContent={formatCurrency(calculateTotalPrice())}
						itemEndClasses="text-xl font-bold"
						headClasses="text-xl font-bold"
						parentClasses="items-center"
						headContentClasses="text-lg"
					/>
				</div>
				<Button
					className="bg-red-400 rounded-md text-white w-full my-2 hover:bg-red-500 font-bold normal-case"
					onClick={handleSubmitBooking}
					disabled={isSubmitting}>
					<span className="text-white text-xl">
						{isSubmitting ? "Đang xử lý..." : "Đặt lịch"}
					</span>
				</Button>
				<small className="px-2 text-center break-keep">
					Khi bạn nhấn vào nút{" "}
					<strong className="text-red-400">Đặt lịch</strong>, bạn đồng
					ý với các&nbsp;
					<a href="#">điều khoản</a> và <a href="#">quy định</a> của
					NoobStore
				</small>
				{/* Invisible reCAPTCHA component */}
				{/* <InvisibleRecaptcha
					ref={recaptchaRef}
					siteKey={
						process.env.NEXT_PUBLIC_RECAPCHA_SITE_TO_RECAPCHA_KEY ||
						""
					}
					onError={(error) => {
						console.error("reCAPTCHA error:", error);
						NotifyUtils.error("Lỗi xác thực reCAPTCHA");
					}}
				/> */}
			</div>
		</div>
	);

	// Handle service booking submission with reCAPTCHA
	async function handleSubmitBooking() {
		try {
			setIsSubmitting(true);

			// Get reCAPTCHA token before submitting
			// const recaptchaToken = await getRecaptchaToken(
			// 	process.env.NEXT_PUBLIC_RECAPCHA_SITE_TO_RECAPCHA_KEY || "",
			// 	"service_booking"
			// );

			// if (!recaptchaToken) {
			// 	NotifyUtils.error(
			// 		"Không thể xác thực reCAPTCHA. Vui lòng thử lại."
			// 	);
			// 	return;
			// }

			// Submit service booking
			const response = await submitServiceBooking();

			if (response?.status === "OK") {
				NotifyUtils.success("Đặt lịch thành công!");
				// You might want to redirect or reset form here
			} else {
				NotifyUtils.error(
					response?.message || "Có lỗi xảy ra khi đặt lịch"
				);
			}
		} catch (error) {
			console.error("Service booking error:", error);
			NotifyUtils.error("Có lỗi xảy ra khi đặt lịch. Vui lòng thử lại.");
		} finally {
			setIsSubmitting(false);
		}
	}
};

export default SummaryService;

export const DetailContent = ({
	type,
	icon,
	headContent = "",
	subTitle = "",
	endContent = "",
	headClasses = "",
	endClasses = "",
	itemEndClasses = "",
	parentClasses = "",
	headContentClasses = "",
	isExpand = false,
	isShow = true,
}: {
	type?: "dicount" | "total" | "fee";
	icon?: React.ReactNode;
	headContent?: string | React.ReactNode;
	subTitle?: string | React.ReactNode;
	endContent?: string | React.ReactNode;
	headClasses?: string;
	endClasses?: string;
	itemEndClasses?: string;
	parentClasses?: string;
	headContentClasses?: string;
	isExpand?: boolean;
	isShow?: boolean;
}) => {
	const [isCollapsed, setIsCollapsed] = React.useState(true);
	if (!isShow) return null;
	if (!isExpand) {
		return (
			<div className={`flex gap-2 ${parentClasses}`}>
				<div className="flex gap-2">
					{icon ? <div className="select-none">{icon}</div> : null}
					<div className="flex flex-col gap-0.5">
						<div className={`${headClasses}`}>
							<div className="flex items-start gap-1">
								<div className={`${headContentClasses}`}>
									{headContent}
								</div>
							</div>
						</div>
						{subTitle ? (
							<div
								className={`text-base text-gray-600 leading-[1] ${
									type === "dicount"
										? "border border-gray-600 rounded-md px-2 py-1 text-center leading-[1]"
										: ""
								}`}>
								{subTitle}
							</div>
						) : null}
					</div>
				</div>
				{endContent ? (
					<div className={`ml-auto flex ${endClasses}`}>
						{typeof endContent === "string" ? (
							<span
								className={`${itemEndClasses} ${
									type === "dicount" ? "text-red-600" : ""
								}`}>
								{endContent}
							</span>
						) : null}
						{typeof endContent === "number" ? (
							<span
								className={`${itemEndClasses} ${
									type === "dicount" ? "text-red-600" : ""
								}`}>
								{formatCurrency(endContent)}
							</span>
						) : null}
						{typeof endContent === "object" ? (
							<span className={`${itemEndClasses}`}>
								{endContent}
							</span>
						) : null}
					</div>
				) : null}
			</div>
		);
	}
	return (
		<div className={`flex gap-2 ${parentClasses}`}>
			<div className="flex gap-2">
				{icon ? <div className="select-none">{icon}</div> : null}
				<div className="flex flex-col gap-0.5">
					<div className={`text-base ${headClasses}`}>
						<div className="flex items-start gap-1">
							<div className={`${headContentClasses}`}>
								{headContent}
							</div>
							{subTitle ? (
								<button
									type="button"
									className="text-xs text-gray-600 hover:text-gray-800 rounded px-1 py-0.5 leading-none"
									onClick={() =>
										setIsCollapsed((prev) => !prev)
									}
									aria-label={
										isCollapsed ? "Expand" : "Collapse"
									}>
									<div className="hover:bg-gray-200 rounded-full transition-all duration-150">
										<ChevronDown
											size={20}
											className={`cursor-pointer hover:bg-gray-200 rounded-full transition-all duration-150 bg-gray-200 p-0.5 transform ${
												isCollapsed
													? ""
													: "-scale-y-100"
											}`}
										/>
									</div>
								</button>
							) : null}
						</div>
					</div>
					{subTitle && !isCollapsed ? (
						<div
							className={`text-sm text-gray-600 ${
								type === "dicount"
									? "border border-gray-600 rounded-md px-2 py-1 text-center leading-[1]"
									: ""
							}`}>
							{subTitle}
						</div>
					) : null}
				</div>
			</div>
			{endContent ? (
				<div className={`ml-auto flex ${endClasses}`}>
					{typeof endContent === "string" ? (
						<span
							className={`${itemEndClasses} ${
								type === "dicount" ? "text-red-600" : ""
							}`}>
							{endContent}
						</span>
					) : null}
					{typeof endContent === "number" ? (
						<span
							className={`${itemEndClasses} ${
								type === "dicount" ? "text-red-600" : ""
							}`}>
							{formatCurrency(endContent)}
						</span>
					) : null}
					{typeof endContent === "object" ? (
						<span className={`${itemEndClasses}`}>
							{endContent}
						</span>
					) : null}
				</div>
			) : null}
		</div>
	);
};
