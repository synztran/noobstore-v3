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
	const [districtText, setDistrictText] = useState("Bình Thạnh");
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
									{districtText} <br />
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
