import { EnumShippingMethodCode } from "@/interface/interface";
import useServiceFeeQuery from "@/react-query/services/useServiceFeeQueries";
import DateUtils from "@/utils/DateUtils";
import { formatCurrency } from "@/utils/FormatNumber";
import useServices, { useServiceAction } from "@/zustand/useServices";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { viVN } from "@mui/x-date-pickers/locales";
import dayjs, { Dayjs } from "dayjs";
import React, { useCallback, useEffect, useRef, useState } from "react";
import MapStyles from "../../../public/map/MapStyle.json";
import SimpleTextField from "../InputComponents/SimpleTextField";

interface IProps {}

// NOTE: The format string "DD/MM/YYYY HH:ss" uses "ss" for seconds, not minutes.
const DATE_FORMAT = "DD/MM/YYYY HH:mm"; // Use this format everywhere

const ServiceLocationTime: React.FC = (props: IProps) => {
	const [tempDeliveryAddress, setTempDeliveryAddress] = useState("");
	const { shippingInfo, selectedPlan, fees } = useServices();
	const {
		serviceOutOfTimeFee: { pickup, delivery },
	} = fees;
	console.log("fees", fees, "shippingInfo", shippingInfo);
	const mapStyle = MapStyles; // Replace with your MapLibre style URL
	const mapCenter = [0, 0]; // [lng, lat]
	const mapZoom = 1;
	const { updateShippingInfo, updateServiceOutOfTimeFee } =
		useServiceAction();
	const { data: serviceFees } = useServiceFeeQuery();
	console.log("serviceFees", serviceFees);
	console.log("shippingInfo", shippingInfo);

	const handleChangeCheckbox = (checked: boolean) => {
		updateShippingInfo({
			...shippingInfo,
			isDeliverySameAsPickup: checked,
		});
	};

	const handleCalculateDistanceAndFee = useCallback(
		async (key: "pickup" | "delivery") => {
			if (key === "pickup") {
				const pickupDistanceAndFee =
					await DateUtils.calculateDeliveryDistanceAndFee(
						shippingInfo.pickup.address
					);
				console.log("pickupDistanceAndFee", pickupDistanceAndFee);
			} else {
				const deliveryDistanceAndFee =
					await DateUtils.calculateDeliveryDistanceAndFee(
						shippingInfo.delivery.address
					);
				console.log("deliveryDistanceAndFee", deliveryDistanceAndFee);
			}
		},
		[shippingInfo.pickup.address]
	);

	const latestAddressRef = useRef<{ [key: string]: string }>({});
	const debounceTimeoutRef = useRef<{ [key: string]: NodeJS.Timeout }>({});

	const handleChangeAddress = useCallback(
		({ name, value }: { name: "delivery" | "pickup"; value: string }) => {
			console.log("n - v", name, value);
			latestAddressRef.current[name] = value;
			if (debounceTimeoutRef.current[name]) {
				clearTimeout(debounceTimeoutRef.current[name]);
			}
			// if (name === "delivery") {
			// 	setTempDeliveryAddress(value);
			// }
			debounceTimeoutRef.current[name] = setTimeout(() => {
				// Only update if the value hasn't changed during debounce
				const latestValue = latestAddressRef.current[name];
				console.log("latestValue", latestValue);
				updateShippingInfo({
					...shippingInfo,
					[name]: { ...shippingInfo[name], address: latestValue },
				} as any);
				handleCalculateDistanceAndFee(name as "pickup" | "delivery");
			}, 300);
		},
		[shippingInfo, handleCalculateDistanceAndFee, updateShippingInfo]
	);

	const handleChangeDate = (value: Dayjs | null, key: string) => {
		if (key === "delivery" || key === "pickup") {
			const isOutOfServiceTime = DateUtils.isOutOfWorkingTime(
				value?.format(DATE_FORMAT) || ""
			);
			updateServiceOutOfTimeFee(
				isOutOfServiceTime
					? serviceFees?.OUT_OF_SERVICE_TIME?.price || 0
					: 0,
				key
			);

			if (key === "pickup") {
				// When pickup date changes, reset delivery date
				updateShippingInfo({
					...shippingInfo,
					pickup: {
						...shippingInfo.pickup,
						date: value?.format(DATE_FORMAT) || "",
					},
					delivery: { ...shippingInfo.delivery, date: null },
				});
			} else {
				updateShippingInfo({
					...shippingInfo,
					[key]: {
						...shippingInfo[key],
						date: value?.format(DATE_FORMAT) || "",
					},
				});
			}
		}
	};

	useEffect(() => {
		if (selectedPlan) {
			updateShippingInfo({
				...shippingInfo,
				pickup: { ...shippingInfo.pickup, date: null },
				delivery: { ...shippingInfo.delivery, date: null },
			});
		}
	}, [selectedPlan]);

	return (
		<div className="flex flex-col gap-6">
			{[
				EnumShippingMethodCode.STORE_DELIVERY_STORE_PICKUP,
				EnumShippingMethodCode.STORE_PICKUP_SELF_DELIVERY,
			].includes(
				shippingInfo?.method?.code as EnumShippingMethodCode
			) && (
				<div className="flex flex-col gap-6">
					<div className="flex flex-col">
						<SimpleTextField
							name="pickup"
							label="Địa chỉ lấy hàng"
							placeholder="Nhập địa chỉ lấy hàng"
							onChange={handleChangeAddress}
							value={shippingInfo.pickup.address || ""}
						/>
					</div>
					<div className="flex flex-col">
						<label className="font-medium text-sm">
							Thời gian lấy hàng
						</label>
						<LocalizationProvider
							dateAdapter={AdapterDayjs}
							localeText={
								viVN.components.MuiLocalizationProvider
									.defaultProps.localeText
							}>
							<DateTimePicker
								slotProps={{
									textField: {
										placeholder: "Chọn thời gian",
									},
								}}
								value={
									shippingInfo.pickup.date
										? dayjs(
												shippingInfo.pickup.date,
												DATE_FORMAT
											)
										: null
								}
								onChange={(value) =>
									handleChangeDate(value, "pickup")
								}
								minDate={dayjs()}
								format={DATE_FORMAT}
								views={[
									"year",
									"month",
									"day",
									"hours",
									"minutes",
								]}
								sx={{
									"& .MuiInputBase-root": {
										border: "1px solid #E5E7EB",
										backgroundColor: "#fff",
										height: "40px",
									},
									"& .MuiInputBase-root:hover": {
										border: "1px solid #e5e7eb",
									},
									"& .MuiInputBase-input": {
										padding: "8px 12px",
										borderRadius: "4px",
										fontSize: "1rem",
									},
								}}
							/>
						</LocalizationProvider>
						{pickup > 0 ? (
							<span className="text-sm text-gray-600">
								Phụ thu hỗ trợ ngoại giờ:{" "}
								<strong className="text-sm text-red-400">
									{formatCurrency(pickup)}
								</strong>
							</span>
						) : null}
					</div>
				</div>
			)}
			{[
				EnumShippingMethodCode.STORE_DELIVERY_STORE_PICKUP,
				EnumShippingMethodCode.STORE_DELIVERY_SELF_PICKUP,
			].includes(
				shippingInfo?.method?.code as EnumShippingMethodCode
			) && (
				<div className="flex flex-col gap-6">
					<div className="flex flex-col">
						<SimpleTextField
							name="delivery"
							label="Địa chỉ giao hàng"
							placeholder="Nhập địa chỉ giao hàng"
							onChange={handleChangeAddress}
							value={shippingInfo.delivery.address || ""}
						/>
					</div>
					<div className="flex flex-col">
						<label className="font-medium text-sm">
							Thời gian giao hàng
						</label>
						<LocalizationProvider
							dateAdapter={AdapterDayjs}
							localeText={
								viVN.components.MuiLocalizationProvider
									.defaultProps.localeText
							}>
							<DateTimePicker
								onChange={(value) => {
									// Calculate min delivery date: pickup date + min of selected plan
									const pickupDate = shippingInfo.pickup?.date
										? dayjs(
												shippingInfo.pickup.date,
												DATE_FORMAT
											)
										: null;
									const minDays = selectedPlan?.min || 0;
									let minDeliveryDate = dayjs()
										.add(minDays, "day")
										.startOf("day");
									if (pickupDate && pickupDate.isValid()) {
										minDeliveryDate = pickupDate
											.add(minDays, "day")
											.startOf("day");
									}
									let newValue = value;

									// If value is not null and the date part is before minDeliveryDate, set to minDeliveryDate with selected time
									if (value && value.isValid()) {
										const selectedTime = {
											hour: value.hour(),
											minute: value.minute(),
											second: value.second(),
										};
										// If the date part is before minDeliveryDate, force date to minDeliveryDate
										if (
											value.isBefore(
												minDeliveryDate,
												"day"
											)
										) {
											newValue = minDeliveryDate
												.hour(selectedTime.hour)
												.minute(selectedTime.minute)
												.second(selectedTime.second);
										}
									}
									handleChangeDate(newValue, "delivery");
								}}
								slotProps={{
									textField: {
										placeholder: "Chọn thời gian",
									},
								}}
								value={
									shippingInfo.delivery.date
										? dayjs(
												shippingInfo.delivery.date,
												DATE_FORMAT
											)
										: null
								}
								format={DATE_FORMAT}
								views={[
									"year",
									"month",
									"day",
									"hours",
									"minutes",
								]}
								minDate={
									shippingInfo.pickup?.date
										? dayjs(
												shippingInfo.pickup.date,
												DATE_FORMAT
											).add(selectedPlan?.min || 0, "day")
										: dayjs().add(
												selectedPlan?.min || 0,
												"day"
											)
								}
								sx={{
									"& .MuiInputBase-root": {
										backgroundColor: "#fff",
										height: "40px",
										borderRadius: "0.375rem",
									},
									"& .MuiInputBase-root:hover": {
										// border: "1px solid #e5e7eb",
									},
									"& .MuiInputBase-input": {
										padding: "8px 12px",
										borderRadius: "4px",
										fontSize: "1rem",
										backgroundColor: "#fff",
									},
								}}
							/>
						</LocalizationProvider>
						{delivery > 0 && shippingInfo.delivery.date ? (
							<span className="text-xs text-gray-600">
								Phụ thu hỗ trợ ngoại giờ:{" "}
								<strong className="text-sm text-red-400">
									{formatCurrency(delivery)}
								</strong>
							</span>
						) : null}
					</div>
				</div>
			)}
		</div>
	);
};

export default ServiceLocationTime;
