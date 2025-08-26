import { Button, Divider } from "@material-ui/core";
import {
	CalendarRange,
	ChevronDown,
	LayoutList,
	MapPin,
	Package,
	Truck,
} from "lucide-react";
import React from "react";
// import LogoStore from "../../public/assets/icons/logo.png";
import {
	SERVICE_KEYBOARD_ICON,
	SERVICE_NEW_SWITCH_ICON,
} from "@/constants/Images";
import { formatCurrency } from "@/utils/FormatNumber";
import useServices from "@/zustand/useServices";
import Image from "next/image";
import SummaryServiceCollapse from "./collapse";

const text = {
	title: "Dịch vụ cơ bản",
	location: "Hồ Chí Minh, Việt Nam",
};

const tempData = {
	delivery: {
		name: "Giao nhận 2 chiều",
		code: "SM-SPU-001",
		icon: <Truck size={20} />,
		price: 60000,
	},
	pickup: {
		address: "123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh",
		name: "Nguyễn Văn A",
		phone: "0123456789",
		date: "21 Dec, 2022 - 8:30 sáng",
		icon: <CalendarRange size={20} />,
	},
	receiver: {
		address: "123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh",
		name: "Nguyễn Văn A",
		phone: "0123456789",
		date: "24 Dec, 2022 - 8:30 sáng",
	},
	dateTime: {
		pickup: "21 Dec, 2022 - 8:30 AM",
		delivery: "24 Dec, 2022 - 8:30 AM",
		icon: <CalendarRange size={20} />,
	},
	services: {
		keyboards: [
			{
				name: "Keyboard 1",
				services: [
					{ name: "Service 1", price: 30000 },
					{ name: "Service 2", price: 34000 },
				],
			},
			{
				name: "Keyboard 2",
				services: [
					{ name: "Service 1", price: 30000 },
					{ name: "Service 2", price: 34000 },
				],
			},
		],
		switches: [
			{
				name: "Switch 1",
				quantity: 60,
				services: [
					{
						name: "Service 1",
						price: 100000,
					},
					{
						name: "Service 2",
						price: 200000,
					},
				],
			},
			{
				name: "Switch 2",
				quantity: 70,
				services: [
					{
						name: "Service 1",
						price: 100000,
						lubricant: "lubricant 1",
					},
					{
						name: "Service 2",
						price: 200000,
						lubricant: "lubricant 2",
					},
				],
			},
		],
		others: [
			{
				name: "Other 1",
				services: [
					{
						name: "Service 1",
						price: 100000,
					},
					{
						name: "Service 2",
						price: 200000,
					},
				],
			},
			{
				name: "Other 2",
				services: [
					{
						name: "Service 1",
						price: 100000,
						lubricant: "lubricant 1",
					},
					{
						name: "Service 2",
						price: 200000,
						lubricant: "lubricant 2",
					},
				],
			},
		],
		icon: <Package size={20} />,
		price: 1250000,
	},
	quote: "This is a short term quote for this service",
	price: {
		discount: 50000,
		total: 325000,
		fee: 8000,
	},
};

const SummaryService: React.FC = () => {
	const { selectedOpt } = useServices();
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
	return (
		<div className="border-2 border-gray-600 bg-white relative -top-[5rem] p-4 rounded-lg flex flex-col gap-4">
			<div className="flex flex-col">
				<strong className="text-xl">
					{selectedOpt?.name ?? "Vui lòng chọn gói dịch vụ"}
				</strong>
				<span className="text-sm text-gray-600">{text.location}</span>
			</div>
			<div className="flex flex-col gap-2">
				<div>
					<DetailContent
						icon={tempData.delivery.icon}
						headContent={tempData.delivery.name}
						subTitle={tempData.delivery.code}
						endContent={
							<div className="flex items-center gap-2">
								<span className="text-lg">
									{formatCurrency(tempData.delivery.price)}
								</span>
							</div>
						}
						headClasses="font-bold"
					/>
				</div>
				<DetailContent
					icon={tempData.pickup.icon}
					headContent={tempData.pickup.date}
					headClasses="font-bold"
					subTitle={tempData.pickup.address}
				/>
				<div>
					<DetailContent
						icon={tempData.services.icon}
						headContent={<SummaryServiceContent />}
						headClasses="font-bold"
						endContent={
							<div className="flex items-center gap-2">
								<span>
									{formatCurrency(tempData.services.price)}
								</span>
							</div>
						}
					/>
				</div>
			</div>
			<Divider />
			<div className="flex flex-col gap-2">
				<div
					className="flex justify-between items-center cursor-pointer"
					onClick={() => handleCollapse("note")}>
					<label>Ghi chú:</label>
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
					<textarea
						className="w-full h-20 p-2 resize-none rounded-md"
						placeholder="Nhập ghi chú"
						readOnly
						value={tempData.quote}
					/>
				</SummaryServiceCollapse>
				<div className="flex flex-col gap-1">
					<DetailContent
						type="dicount"
						headContent="Giám giá:"
						subTitle="DS001"
						endContent={
							tempData.price.discount > 0
								? `-${formatCurrency(tempData.price.discount)}`
								: "0"
						}
						itemEndClasses="text-base text-green-700"
						parentClasses="items-start"
					/>
					<DetailContent
						headContent="Tổng tiền:"
						endContent={tempData.price.total}
						itemEndClasses="text-lg font-bold"
						headClasses="text-lg font-bold"
						parentClasses="items-center"
					/>
					<DetailContent
						headContent="Bao gồm phí dịch vụ & nền tảng 2%:"
						headClasses="!text-sm text-gray-600"
						endContent={tempData.price.fee}
						itemEndClasses="text-base"
						endClasses="items-center"
						parentClasses="items-center"
					/>
				</div>
				<Button className="bg-red-400 rounded-md text-white w-full my-2 hover:bg-red-500 font-bold normal-case">
					<span className="text-white text-xl">Đặt lịch</span>
				</Button>
				<small className="px-2 text-center break-keep">
					Khi bạn nhấn vào nút{" "}
					<strong className="text-red-400">Đặt lịch</strong>, bạn đồng
					ý với các&nbsp;
					<a href="#">điều khoản</a> và <a href="#">quy định</a> của
					NoobStore
				</small>
			</div>
		</div>
	);
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
}) => {
	const [isCollapsed, setIsCollapsed] = React.useState(true);
	return (
		<div className={`flex gap-2 ${parentClasses}`}>
			<div className="flex gap-2">
				{icon ? <div className="select-none">{icon}</div> : null}
				<div className="flex flex-col gap-0.5">
					<div className={`text-base ${headClasses}`}>
						<div className="flex items-center gap-1">
							{headContent}
							{subTitle ? (
								<button
									type="button"
									className="ml-1 text-xs text-gray-600 hover:text-gray-800 rounded px-1 py-0.5 border border-gray-300 leading-none"
									onClick={() =>
										setIsCollapsed((prev) => !prev)
									}
									aria-label={
										isCollapsed ? "Expand" : "Collapse"
									}>
									<span className="select-none">e/c</span>
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

const SummaryServiceContent: React.FC = () => {
	// let keyboards = "";
	// let switches = "";
	// let others = "";
	let keyboards = 0;
	let switches = 0;
	let others = 0;

	if (tempData.services.keyboards)
		// keyboards = `${tempData.services.keyboards?.length}x bàn phím`;
		keyboards = tempData.services.keyboards.length;
	if (tempData.services.switches)
		// switches = `${tempData.services.switches?.reduce((acc, data) => acc + data.quantity, 0)}x switch`;
		switches = tempData.services.switches?.length;
	if (tempData.services.others) others = tempData.services.others?.length;
	// others = `${tempData.services.others?.length}x khác`;

	// return (
	// 	<div className="flex flex-wrap">
	// 		{keyboards && <div>{keyboards}</div>}
	// 		{switches && <div>,&nbsp;{switches}</div>}
	// 		{others && <div>,&nbsp;{others}</div>}
	// 	</div>
	// );
	return <>{keyboards + switches + others} dịch vụ</>;
};

const DeliveryInfo = () => {
	return (
		<div className="flex items-center gap-2 mx-7 mt-2 border-l-2 pl-4">
			{/* <ArrowDownUp /> */}
			<div className="grid grid-cols-1 gap-4">
				<div className="flex flex-col items-start text-xs">
					<strong className="text-sm flex items-center">
						<MapPin size={16} />
						Nhận tại:
					</strong>
					<span>
						{tempData.pickup.name} - {tempData.pickup.phone}
					</span>
					<span>{tempData.pickup.address}</span>
					<span>Dự kiến:&nbsp;{tempData.pickup.date}</span>
				</div>
				<div className="flex flex-col text-xs">
					<strong className="text-sm flex items-center">
						<MapPin size={16} />
						Giao đến:
					</strong>
					<span>
						{tempData.receiver.name} - {tempData.receiver.phone}
					</span>
					<span>{tempData.receiver.address}</span>
					<span>Dự kiến:&nbsp;{tempData.pickup.date}</span>
				</div>
			</div>
		</div>
	);
};

const ServicesInfo = () => {
	return (
		<div
			className={`grid grid-rows-${3} border-l-2 border-gray-300 mx-7 pl-4`}>
			{tempData.services.keyboards?.length ? (
				<div className="flex items-start gap-2 mt-2">
					<Image
						src={SERVICE_KEYBOARD_ICON}
						width={32}
						height={32}
						alt="switch icon"
						className="select-none"
						style={{
							maxWidth: "100%",
							height: "auto",
						}}
					/>
					<div className="grid grid-cols-1 gap-4 w-full">
						<div className="flex flex-col items-start text-xs">
							{tempData.services.keyboards.map((data, index) => (
								<div key={index} className="w-full">
									<strong className="text-sm">
										{data.name}
									</strong>
									{data.services?.map((service, index) => (
										<div
											key={index}
											className="flex justify-between w-full pl-2">
											<span>{service.name}</span>
											<strong>
												{formatCurrency(service.price)}
											</strong>
										</div>
									))}
								</div>
							))}
						</div>
					</div>
				</div>
			) : null}
			{tempData.services.switches?.length ? (
				<div className="flex items-start gap-2 mt-2">
					<Image
						src={SERVICE_NEW_SWITCH_ICON}
						width={32}
						height={32}
						alt="switch icon"
						className="select-none"
						style={{
							maxWidth: "100%",
							height: "auto",
						}}
					/>
					<div className="grid grid-cols-1 gap-4 w-full">
						<div className="flex flex-col items-start text-xs">
							{tempData.services.switches.map((data, index) => (
								<div key={index} className="w-full">
									<strong className="text-sm">
										{data.name}
									</strong>
									{data.services?.map((service, index) => (
										<div
											key={index}
											className="flex justify-between pl-2">
											<span>{service.name}</span>
											<strong>
												{formatCurrency(service.price)}
											</strong>
										</div>
									))}
								</div>
							))}
						</div>
					</div>
				</div>
			) : null}
			{tempData.services.others?.length ? (
				<div className="flex items-start gap-2 mt-2">
					<LayoutList size={32} />
					<div className="grid grid-cols-1 gap-4 w-full">
						<div className="flex flex-col items-start text-xs">
							{tempData.services.others.map((data, index) => (
								<div key={index} className="w-full">
									<strong className="text-sm">
										{data.name}
									</strong>
									{data.services?.map((service, index) => (
										<div
											key={index}
											className="flex justify-between w-full pl-2">
											<span>{service.name}</span>
											<strong>
												{formatCurrency(service.price)}
											</strong>
										</div>
									))}
								</div>
							))}
						</div>
					</div>
				</div>
			) : null}
		</div>
	);
};
