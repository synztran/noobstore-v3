import useServices, { useServiceAction } from "@/zustand/useServices";
import { Checkbox, Divider, TextField } from "@material-ui/core";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { viVN } from "@mui/x-date-pickers/locales";
import dynamic from "next/dynamic";
import React from "react";
import MapStyles from "../../../public/map/MapStyle.json";

const Map = dynamic(() => import("../LocationPicker"), {
	ssr: false,
});

const MapBox = dynamic(() => import("../MapBox"), {
	ssr: false,
});

interface IProps {
	label?: string;
}

const ServiceLocationTime: React.FC = (props: IProps) => {
	const { label } = props;
	const mapStyle = MapStyles; // Replace with your MapLibre style URL
	const mapCenter = [0, 0]; // [lng, lat]
	const mapZoom = 1;
	const { serviceForm } = useServices();
	const { updatedServiceForm } = useServiceAction();

	const handleChangeCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
		updatedServiceForm({
			...serviceForm,
			isDeliverySameAsPickup: e.target.checked,
		});
	};

	return (
		<div className="border-gray-600 rounded-xl border-2 p-4 bg-white">
			<div className="flex flex-col">
				<div className="text-xl font-bold">Địa chỉ và thời gian</div>
				<small>
					Bổ sung thông tin về thời gian và địa điểm nhận/giao hàng
				</small>
				<Divider className="my-2" />
				{/* <Map /> */}
				{/* <MapBox style={mapStyle} center={mapCenter} zoom={mapZoom} /> */}
				<div className="flex flex-col gap-4">
					<div className="flex flex-col">
						<label>Địa chỉ giao hàng</label>
						<TextField
							variant="outlined"
							type="text"
							name="address"
							placeholder="Địa chỉ giao hàng"
							className="rounded-md"
							inputProps={{
								className: "rounded-md h-[24px] bg-transparent",
							}}
						/>
					</div>
					<div className="flex flex-col">
						<label>Thời gian giao hàng</label>
						<LocalizationProvider
							dateAdapter={AdapterDayjs}
							localeText={
								viVN.components.MuiLocalizationProvider
									.defaultProps.localeText
							}>
							<DateTimePicker
								className="py-2"
								slotProps={{
									textField: {
										placeholder: "Chọn thời gian",
									},
								}}
								sx={{
									"& .MuiInputBase-root": {
										// border: "1px solid #E5E7EB",
										backgroundColor: "#fff",
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
					</div>
					<div className="flex items-center gap-2">
						<Checkbox
							checked={serviceForm?.isDeliverySameAsPickup}
							className="p-0"
							onChange={handleChangeCheckbox}
						/>
						<label>Địa chỉ lấy và giao hàng giống nhau</label>
					</div>
					{serviceForm?.isDeliverySameAsPickup ? null : (
						<div className="flex flex-col gap-2">
							<div className="flex flex-col">
								<label>Địa chỉ lấy hàng</label>
								<TextField
									variant="outlined"
									type="text"
									name="address"
									placeholder="Địa chỉ giao hàng"
									className="rounded-md"
									inputProps={{
										className: "rounded-md h-[24px]",
									}}
									InputProps={{
										className:
											"border-gray-400 border rounded-md",
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
										className="py-2"
										slotProps={{
											textField: {
												placeholder: "Chọn thời gian",
											},
										}}
										sx={{
											"& .MuiInputBase-root": {
												border: "1px solid #E5E7EB",
												backgroundColor: "#fff",
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
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default ServiceLocationTime;
