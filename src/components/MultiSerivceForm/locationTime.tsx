import useServices, { useServiceAction } from "@/zustand/useServices";
import { TextField } from "@material-ui/core";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { viVN } from "@mui/x-date-pickers/locales";
import React, { useEffect } from "react";
import MapStyles from "../../../public/map/MapStyle.json";
import CheckboxWithPrice from "../InputComponents/CheckboxWithPrice";
import { debounce, pick } from "lodash";
import dayjs, { Dayjs } from "dayjs";
import { EnumShippingMethodCode } from "@/interface/interface";
import DateUtils from "@/utils/DateUtils";
import useServiceFeeQuery from "@/react-query/services/useServiceFeeQueries";
import { formatCurrency } from "@/utils/FormatNumber";

interface IProps {}

// NOTE: The format string "DD/MM/YYYY HH:ss" uses "ss" for seconds, not minutes.
const DATE_FORMAT = "DD/MM/YYYY HH:mm"; // Use this format everywhere

const ServiceLocationTime: React.FC = (props: IProps) => {
	const { shippingInfo, selectedPlan, fees } = useServices();
	const {
		serviceOutOfTimeFee: { pickup, delivery },
	} = fees;
	const mapStyle = MapStyles; // Replace with your MapLibre style URL
	const mapCenter = [0, 0]; // [lng, lat]
	const mapZoom = 1;
	const { updateShippingInfo, updateServiceOutOfTimeFee } =
		useServiceAction();
	const { data: serviceFees } = useServiceFeeQuery();
	console.log("shippingInfo", shippingInfo);

	const handleChangeCheckbox = (checked: boolean) => {
		updateShippingInfo({
			...shippingInfo,
			isDeliverySameAsPickup: checked,
		});
	};

	const handleChangeAddress = (value: string, key: string) => {
		console.log("address value", value, key);
		if (key === "delivery" || key === "pickup") {
			updateShippingInfo({
				...shippingInfo,
				[key]: {
					...shippingInfo[key],
					address: value,
				},
			});
		}
	};

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
					delivery: {
						...shippingInfo.delivery,
						date: null,
					},
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
						<label className="font-medium">Địa chỉ lấy hàng</label>
						<TextField
							variant="outlined"
							type="text"
							name="pickupAddress"
							placeholder="Nhập địa chỉ lấy hàng"
							value={shippingInfo.pickup.address || ""}
							onChange={(e) =>
								handleChangeAddress(e.target.value, "pickup")
							}
							className="h-[40px]"
							inputProps={{
								className: "rounded-md h-[24px] bg-transparent",
							}}
							InputProps={{
								className: "rounded-md",
							}}
						/>
					</div>
					<div className="flex flex-col">
						<label>Thời gian lấy hàng</label>
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
								<strong>{formatCurrency(pickup)}</strong>
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
						<label className="font-medium">Địa chỉ giao hàng</label>
						<TextField
							variant="outlined"
							type="text"
							name="deliveryAddress"
							placeholder="Nhập địa chỉ giao hàng"
							value={shippingInfo.delivery.address || ""}
							onChange={(e) =>
								handleChangeAddress(e.target.value, "delivery")
							}
							className="h-[40px]"
							inputProps={{
								className: "rounded-md h-[24px] bg-transparent",
							}}
							InputProps={{
								className: "rounded-md",
							}}
						/>
					</div>
					<div className="flex flex-col">
						<label className="mb-1 font-medium">
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
						{delivery > 0 ? (
							<span className="text-sm text-gray-600">
								Phụ thu hỗ trợ ngoại giờ:{" "}
								<strong>{formatCurrency(delivery)}</strong>
							</span>
						) : null}
					</div>
				</div>
			)}
		</div>
	);
};

export default ServiceLocationTime;
