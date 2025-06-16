import GroupSelectServiceDate from "@/components/GroupSelectServiceDate";
import MultiServiceForm from "@/components/MultiSerivceForm";
import ServiceContactInfo from "@/components/MultiSerivceForm/contactInfo";
import ServiceLocationTime from "@/components/MultiSerivceForm/locationTime";
import OverSizeBanner from "@/components/OverSizeBanner";
import SummaryService from "@/components/SummaryService";
import {
	FILM_COLOR_LABEL,
	FILM_TYPE_LABEL,
	GREASE_TYPE_LABEL,
	MapKeyName,
	SPRING_TYPE_LABEL,
	SPRING_WEIGHT_LABEL,
	SWITCH_TYPE_LABEL,
} from "@/constants";
import {
	ENUM_SPRING_TYPE,
	ENUM_STABILIZER_LAYOUT,
	ENUM_GREASE_TYPE,
	ENUM_FILM_TYPE,
	ENUM_SWITCH_TYPE,
	IService,
} from "@/interface/interface";
import { Base } from "@/templates/Base";
import { formatCurrency } from "@/utils/FormatNumber";
import { Button } from "@material-ui/core";
import { Box, Divider, Grid } from "@mui/material";
import Image from "next/image";
import { useState } from "react";

const defaultValue = {
	switchQuantity: 0,
	switchType: ENUM_SWITCH_TYPE.UNKNOWN,
	isLube: false,
	isAddFilm: false,
	filmType: ENUM_FILM_TYPE.UNKNOWN,
	filmColor: "UNKNOWN",
	isProvideFilm: false,
	isAddGrease: false,
	greaseType: ENUM_GREASE_TYPE.UNKNOWN,
	isAddStabilizer: false,
	layout: ENUM_STABILIZER_LAYOUT["6.25U"],
	isProvideStab: false,
	isAddAssemble: false,
	assebleLayout: 0,
	isChangeSpring: false,
	springType: ENUM_SPRING_TYPE.UNKNOWN,
	springWeight: "UNKNOWN",
	isProvideSpring: false,
	stabilizer2u: 0,
	stabilizer7u: 0,
	stabilizer625u: 0,
};

const ServicePage = () => {
	const [services, setServices] = useState<IService>(defaultValue);
	const [servicesPrice, setPrice] = useState<{
		filmPrice: number;
		greasePrice: number;
		springPrice: number;
	}>({
		filmPrice: 150000,
		greasePrice: 150000,
		springPrice: 150000,
	});
	const [orderInfo, serOrderInfo] = useState({
		total: 0,
		shipping: 0,
		discount: 0,
		subTotal: 0,
		tax: 0,
	});

	const switchServiceAddon = {
		switchQuantity: services.switchQuantity,
		switchType: SWITCH_TYPE_LABEL[services.switchType],
	};

	const filmServiceAdddon = {
		isFilm: services.isAddFilm ? "Có" : "Không",
		filmType: FILM_TYPE_LABEL[services.filmType],
		filmColor: FILM_COLOR_LABEL[services.filmColor],
		// isProvideFilm: services.isProvideFilm ? "Có" : "Không",
	};

	const greaseServiceAddon = {
		isLube: services.isLube ? "Có" : "Không",
		greaseType: GREASE_TYPE_LABEL[services.greaseType],
	};

	const springServiceAddon = {
		isChangeSpring: services.isChangeSpring ? "Có" : "Không",
		springType: SPRING_TYPE_LABEL[services.springType],
		springWeight: SPRING_WEIGHT_LABEL[services.springWeight],
		// isProvideSpring: services.isProvideSpring ? "Có" : "Không",
	};

	const handleValidation = (e: any) => {
		let value = e.target.value;
		const onlyNums = value.replace(/[^0-9]/g, "");
		if (onlyNums.length < 4) {
			setServices((prev) => ({
				...prev,
				switchQuantity: parseInt(onlyNums),
			}));
		}
	};

	return (
		<Base>
			<>
				<div className="relative w-full">
					<OverSizeBanner classes="absolute left-0 top-0 -transform-x-1/2 -transform-y-1/2" />
					<div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-4">
						<div className="text-center text-white">
							Đăng ký dịch vụ NoobStore tại...
						</div>
						<div className="text-2xl font-bold text-white">
							Hồ Chí Minh, Việt Nam
						</div>
						<div className="text-center mt-4">
							<Button className="text-white bg-[rgba(255,255,255,0.2)] normal-case rounded-sm px-4 backdrop-blur-[10px] hover:bg-[rgba(255,255,255,0.2)] hover:scale-105 transition-all duration-150">
								Kiểm tra thông tin dịch vụ
							</Button>
						</div>
					</div>
				</div>
				<div className="grid grid-cols-3 gap-6">
					<div className="col-span-2 relative -top-[5rem] flex flex-col gap-4">
						<GroupSelectServiceDate />
						<MultiServiceForm />
						{/* <ServiceCustomerInfo /> */}
						<ServiceLocationTime />
						<ServiceContactInfo />
					</div>
					<div className="cols-span-1">
						<SummaryService />
					</div>
				</div>
			</>
		</Base>
	);
};

export default ServicePage;

interface IFlexibleInterface {
	[key: string]: any;
}

const OrderSummary = ({ ...services }: IService) => {
	return (
		<Box>
			<Box>
				<span className="text-lg">Đơn hàng</span>
			</Box>
			<Box>
				<OrderSummaryGridStructure
					quantity={services.switchQuantity}
					title={
						SWITCH_TYPE_LABEL[services.switchType] + " loại switch"
					}
				/>
				{services.isLube ? (
					<OrderSummaryGridStructure
						quantity={services.switchQuantity}
						title={GREASE_TYPE_LABEL[services.greaseType] + " lube"}
					/>
				) : null}
				{services.isAddFilm ? (
					<OrderSummaryGridStructure
						quantity={services.switchQuantity}
						title={FILM_TYPE_LABEL[services.filmType] + " film"}
					/>
				) : null}
				{services.isChangeSpring ? (
					<OrderSummaryGridStructure
						quantity={services.switchQuantity}
						title={
							SPRING_TYPE_LABEL[services.springType] + " spring"
						}
					/>
				) : null}
			</Box>
		</Box>
	);
};

const ServiceOptions = ({
	title = "",
	icon,
	addOn = {},
	price = 0,
	iconWidth = 40,
	iconHeight = 40,
}: {
	title: string;
	icon?: string;
	addOn: IFlexibleInterface;
	price?: number;
	iconWidth?: number;
	iconHeight?: number;
}) => {
	return (
		<Box className="py-2">
			<div className=" flex justify-between items-center mb-2">
				<div className="flex items-center">
					<Box className="w-12 h-12 bg-white border border-gray-300 flex items-center justify-center shadow-md rounded-sm">
						<Image
							src={icon as string}
							alt={title}
							width={iconWidth}
							height={iconHeight}
							style={{
								minHeight: iconHeight < 40 ? 32 : 40,
								maxWidth: "100%",
								height: "auto",
							}}
						/>
					</Box>
					<strong className="text-lg ml-2">{title}</strong>
				</div>
				{price ? (
					<div>
						<span className="text-lg">{formatCurrency(price)}</span>
					</div>
				) : null}
			</div>
			{Object.keys(addOn).map((key, index) => {
				return (
					<Box>
						<Box
							key={index}
							className="flex justify-between items-center ml-4">
							<span>
								{MapKeyName[key as keyof typeof MapKeyName]}
							</span>
							<span>{addOn[key]}</span>
						</Box>
					</Box>
				);
			})}
		</Box>
	);
};

const ServiceOrder = ({
	orderInfo,
}: {
	orderInfo: {
		total: number;
		shipping: number;
		discount: number;
		subTotal: number;
		tax: number;
	};
}) => {
	return (
		<Box className="">
			<Box className="py-4">
				<div className="flex justify-between items-center pl-4 py-1">
					<span className="text-md">Tạm tính</span>
					<span className="text-md">
						{formatCurrency(orderInfo.subTotal)}
					</span>
				</div>
				<div className="flex justify-between items-center pl-4 py-1">
					<span>Thuế</span>
					<span className="text-md">
						{formatCurrency(orderInfo.discount)}
					</span>
				</div>
			</Box>
			<Divider className="ml-4" />
			<div className="flex justify-between items-center pl-4 py-4	">
				<strong className="text-lg">Tổng tiền</strong>
				<span className="text-lg font-bold">
					{formatCurrency(orderInfo.total)}
				</span>
			</div>
		</Box>
	);
};

const HeadLabel = ({
	title = "",
	icon,
	size = 40,
}: {
	title: string;
	icon: string;
	size?: number;
}) => {
	return (
		<div className="h-14 pb-2 flex gap-2 items-center">
			<Image
				src={icon}
				width={size}
				height={size}
				alt="icon"
				style={{
					maxWidth: "100%",
					height: "auto",
				}}
			/>
			<span className="text-xl text-center font-bold capitalize">
				{title}
			</span>
		</div>
	);
};

const ServiceButtonGroup = () => {
	return (
		<Box className="mt-4 flex justify-end w-full">
			<button className="bg-yellow-300 text-black py-2 px-4 rounded-sm w-full">
				Thanh toán
			</button>
		</Box>
	);
};

const OrderSummaryGridStructure = ({
	quantity,
	title,
	price,
}: {
	quantity: number;
	title: any;
	price?: number;
}) => (
	<Grid container className="flex items-center">
		<Grid item md={1} className="text-sm">
			x{quantity || 0}
		</Grid>
		<Grid item md={8}>
			{title}
		</Grid>
		<Grid item md={3}>
			{price}
		</Grid>
	</Grid>
);
