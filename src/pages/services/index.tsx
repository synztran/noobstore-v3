import GroupSelectServiceDate from "@/components/GroupSelectServiceDate";
import MultiServiceForm from "@/components/MultiSerivceForm";
import ServiceContactInfo from "@/components/MultiSerivceForm/contactInfo";
import ServiceLocationTime from "@/components/MultiSerivceForm/locationTime";
import OverSizeBanner from "@/components/OverSizeBanner";
import SummaryService from "@/components/SummaryService";
import LocationRequestButton from "@/components/LocationRequestButton";
import {
	FILM_TYPE_LABEL,
	GREASE_TYPE_LABEL,
	MapKeyName,
	SPRING_TYPE_LABEL,
	SWITCH_TYPE_LABEL,
} from "@/constants";
import { IService } from "@/interface/interface";
import { Base } from "@/templates/Base";
import { formatCurrency } from "@/utils/FormatNumber";
import { Button } from "@material-ui/core";
import { Box, Divider, Grid } from "@mui/material";
import Image from "next/image";
import { GeolocationCoordinates } from "@/hook/useGeolocation";
import {
	calculateDistance,
	isWithinRadius,
	getShortAddress,
} from "@/utils/locationUtils";
import useServices, {
	useServiceAction,
	useServiceSelectors,
} from "@/zustand/useServices";
import { useState, useEffect } from "react";
import DeliverySelection from "@/components/DeliverySelection";
import { useAuth } from "@/context/Auth";
import { IAuthUser } from "@/interface/Context/auth";
import { useGuide } from "@/hook/useDriver";

const ServicePage = () => {
	const { user } = useAuth() as unknown as { user: IAuthUser };
	const { shippingInfo } = useServices();
	const { updateContactInfo } = useServiceAction();
	const { startGuide, canGuide } = useGuide();
	const [customerLocation, setCustomerLocation] =
		useState<GeolocationCoordinates | null>(null);
	const [locationText, setLocationText] = useState("Hồ Chí Minh, Việt Nam");
	const [distanceText, setDistanceText] = useState("");
	const [isInServiceArea, setIsInServiceArea] = useState(true);

	// Service center location (you can adjust this to your actual location)
	// 10.801449, 106.711308
	const serviceCenterLocation = {
		latitude: 10.801449,
		longitude: 106.711308,
	};

	const handleLocationDetected = async (
		coordinates: GeolocationCoordinates
	) => {
		setCustomerLocation(coordinates);

		// Calculate distance to service center
		const distance = calculateDistance(coordinates, serviceCenterLocation);
		const withinArea = isWithinRadius(
			coordinates,
			serviceCenterLocation,
			50
		); // 50km radius

		setIsInServiceArea(withinArea);

		// Get address from coordinates
		try {
			const address = await getShortAddress(coordinates);
			console.log(address);

			// Update location text with address and distance
			if (withinArea) {
				setLocationText(`📍 ${address}`);
				setDistanceText(`${distance.toFixed(1)}km từ trung tâm`);
			} else {
				setLocationText(`⚠️ ${address}`);
				setDistanceText(`${distance.toFixed(1)}km - ngoài khu vực`);
			}
		} catch (error) {
			// Fallback to coordinates if address lookup fails
			if (withinArea) {
				setLocationText(`📍 Vị trí của bạn`);
				setDistanceText(`${distance.toFixed(1)}km từ trung tâm`);
			} else {
				setLocationText(`⚠️ Ngoài khu vực dịch vụ`);
				setDistanceText(`${distance.toFixed(1)}km - ngoài khu vực`);
			}
		}
	};

	const handleLocationError = (error: string) => {
		console.error("Location error:", error);
		setLocationText("Hồ Chí Minh, Việt Nam");
	};

	// Check if user has location data from the form
	useEffect(() => {
		const deliveryCoords = shippingInfo?.delivery?.coordinates;
		if (deliveryCoords && !customerLocation) {
			handleLocationDetected({
				latitude: deliveryCoords.latitude,
				longitude: deliveryCoords.longitude,
			} as GeolocationCoordinates);
		}
	}, [shippingInfo?.delivery?.coordinates, customerLocation]);

	useEffect(() => {
		if (user) {
			updateContactInfo({
				name: user.firstName + " " + user.lastName,
				email: user.email,
				phone: user.phoneNumber,
			});
		}
	}, [user]);

	useEffect(() => {
		if (canGuide && user) {
			startGuide();
		}
	}, [user]);

	return (
		<Base>
			<>
				<div className="relative w-full">
					<OverSizeBanner classes="absolute left-0 top-0 -transform-x-1/2 -transform-y-1/2" />
					<div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-4 p-4 rounded-lg backdrop-blur-[8px]">
						<div className="text-center text-white text-xl">
							Đăng ký dịch vụ NoobStore tại...
						</div>
						<div
							className={`text-2xl font-bold text-white text-center ${
								!isInServiceArea ? "text-orange-300" : ""
							}`}>
							{locationText ? (
								<span className="text-white text-2xl">
									{locationText} <br />
									{distanceText ? ` (${distanceText})` : ""}
								</span>
							) : (
								<span className="text-white text-2xl">
									Vui lòng lấy thông tin vị trí hiện tại của
									bạn
								</span>
							)}
						</div>
						<div className="text-center flex flex-col gap-2 items-center">
							{/* <LocationRequestButton
								onLocationReceived={handleLocationDetected}
								onError={handleLocationError}
								variant="outlined"
								className="text-white border-white hover:bg-white hover:text-black"
							/> */}
							{/* <Button className="text-white bg-[rgba(255,255,255,0.2)] normal-case rounded-sm px-4 backdrop-blur-[10px] hover:bg-[rgba(255,255,255,0.2)] hover:scale-105 transition-all duration-150">
								<span className="text-white">
									Kiểm tra thông tin dịch vụ
								</span>
							</Button> */}
							{!isInServiceArea && customerLocation && (
								<div className="text-orange-300 text-sm mt-2 bg-[rgba(255,165,0,0.2)] px-3 py-2 rounded backdrop-blur-[10px]">
									⚠️ Bạn nằm ngoài khu vực dịch vụ tiêu chuẩn.
									Vui lòng liên hệ để biết thêm chi tiết.
								</div>
							)}
						</div>
					</div>
				</div>
				<div className="grid grid-cols-3 gap-4 px-4">
					<div className="col-span-2 relative -top-[5rem] flex flex-col gap-4">
						<GroupSelectServiceDate />
						<DeliverySelection />
						<MultiServiceForm />
					</div>
					<div className="cols-span-1 flex flex-col gap-4">
						<SummaryService />
						<div className="col-span-2 relative -top-[5rem] flex flex-col gap-4">
							<ServiceContactInfo />
						</div>
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
