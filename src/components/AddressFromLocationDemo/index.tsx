import React, { useState } from "react";
import {
	Card,
	CardContent,
	Typography,
	Box,
	Button,
	Alert,
	Divider,
	TextField,
} from "@mui/material";
import LocationRequestButton from "../LocationRequestButton";
import { GeolocationCoordinates } from "@/hook/useGeolocation";
import {
	reverseGeocode,
	getDetailedAddress,
	getShortAddress,
	DetailedAddress,
} from "@/utils/locationUtils";

const AddressFromLocationDemo: React.FC = () => {
	const [coordinates, setCoordinates] =
		useState<GeolocationCoordinates | null>(null);
	const [addresses, setAddresses] = useState<{
		simple: string;
		detailed: DetailedAddress | null;
		short: string;
	}>({
		simple: "",
		detailed: null,
		short: "",
	});
	const [loading, setLoading] = useState(false);
	const [manualLat, setManualLat] = useState("");
	const [manualLng, setManualLng] = useState("");

	const getAddressesFromCoordinates = async (
		coords: GeolocationCoordinates
	) => {
		setLoading(true);
		try {
			// Get all types of addresses
			const [simpleAddress, detailedAddress, shortAddress] =
				await Promise.all([
					reverseGeocode(coords),
					getDetailedAddress(coords),
					getShortAddress(coords),
				]);

			setAddresses({
				simple: simpleAddress,
				detailed: detailedAddress,
				short: shortAddress,
			});

			console.log("Address Results:", {
				coordinates: coords,
				simple: simpleAddress,
				detailed: detailedAddress,
				short: shortAddress,
			});
		} catch (error) {
			console.error("Error getting addresses:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleLocationReceived = (coords: GeolocationCoordinates) => {
		setCoordinates(coords);
		getAddressesFromCoordinates(coords);
	};

	const handleManualCoordinates = () => {
		const lat = parseFloat(manualLat);
		const lng = parseFloat(manualLng);

		if (isNaN(lat) || isNaN(lng)) {
			alert("Vui lòng nhập tọa độ hợp lệ");
			return;
		}

		const manualCoords: GeolocationCoordinates = {
			latitude: lat,
			longitude: lng,
		};

		handleLocationReceived(manualCoords);
	};

	// Example coordinates for testing
	const exampleLocations = [
		{
			name: "Bitexco Financial Tower, HCMC",
			lat: 10.7717,
			lng: 106.7041,
		},
		{
			name: "Ben Thanh Market, HCMC",
			lat: 10.7727,
			lng: 106.6981,
		},
		{
			name: "Independence Palace, HCMC",
			lat: 10.7769,
			lng: 106.6955,
		},
		{
			name: "Notre-Dame Cathedral, HCMC",
			lat: 10.7798,
			lng: 106.6991,
		},
	];

	return (
		<div className="space-y-4">
			<Card>
				<CardContent>
					<Typography variant="h5" gutterBottom>
						🗺️ Get Address from Coordinates
					</Typography>
					<Typography variant="body2" color="textSecondary" paragraph>
						Convert latitude and longitude to human-readable
						addresses using different methods.
					</Typography>

					<Divider className="my-4" />

					{/* Current Location */}
					<Box className="mb-4">
						<Typography variant="h6" gutterBottom>
							1. Get Your Current Location Address
						</Typography>
						<LocationRequestButton
							onLocationReceived={handleLocationReceived}
							onError={(error) => console.error(error)}
							variant="contained"
							fullWidth
						/>
					</Box>

					<Divider className="my-4" />

					{/* Manual Coordinates */}
					<Box className="mb-4">
						<Typography variant="h6" gutterBottom>
							2. Enter Coordinates Manually
						</Typography>
						<Box className="flex gap-2 mb-2">
							<TextField
								label="Latitude"
								value={manualLat}
								onChange={(e) => setManualLat(e.target.value)}
								placeholder="10.7769"
								size="small"
								className="flex-1"
							/>
							<TextField
								label="Longitude"
								value={manualLng}
								onChange={(e) => setManualLng(e.target.value)}
								placeholder="106.7009"
								size="small"
								className="flex-1"
							/>
							<Button
								onClick={handleManualCoordinates}
								variant="outlined"
								size="small">
								Get Address
							</Button>
						</Box>
					</Box>

					<Divider className="my-4" />

					{/* Example Locations */}
					<Box className="mb-4">
						<Typography variant="h6" gutterBottom>
							3. Try Example Locations
						</Typography>
						<Box className="grid grid-cols-2 gap-2">
							{exampleLocations.map((location, index) => (
								<Button
									key={index}
									onClick={() =>
										handleLocationReceived({
											latitude: location.lat,
											longitude: location.lng,
										})
									}
									variant="outlined"
									size="small"
									className="text-left">
									{location.name}
								</Button>
							))}
						</Box>
					</Box>
				</CardContent>
			</Card>

			{/* Results */}
			{coordinates && (
				<Card>
					<CardContent>
						<Typography variant="h6" gutterBottom>
							📍 Address Results
						</Typography>

						{loading ? (
							<Alert severity="info">
								🔄 Getting address information...
							</Alert>
						) : (
							<div className="space-y-3">
								{/* Coordinates */}
								<Alert severity="info">
									<Typography variant="body2">
										<strong>Coordinates:</strong>{" "}
										{coordinates.latitude.toFixed(6)},{" "}
										{coordinates.longitude.toFixed(6)}
									</Typography>
								</Alert>

								{/* Simple Address */}
								<Box>
									<Typography
										variant="subtitle2"
										className="font-semibold mb-1">
										Simple Address (Full):
									</Typography>
									<Alert severity="success">
										<Typography variant="body2">
											{addresses.simple}
										</Typography>
									</Alert>
								</Box>

								{/* Short Address */}
								<Box>
									<Typography
										variant="subtitle2"
										className="font-semibold mb-1">
										Short Address (Street + District +
										City):
									</Typography>
									<Alert severity="success">
										<Typography variant="body2">
											{addresses.short}
										</Typography>
									</Alert>
								</Box>

								{/* Detailed Address */}
								{addresses.detailed && (
									<Box>
										<Typography
											variant="subtitle2"
											className="font-semibold mb-1">
											Detailed Address Components:
										</Typography>
										<Alert severity="info">
											<div className="space-y-1">
												{addresses.detailed
													.house_number && (
													<Typography variant="body2">
														<strong>
															House Number:
														</strong>{" "}
														{
															addresses.detailed
																.house_number
														}
													</Typography>
												)}
												{addresses.detailed.road && (
													<Typography variant="body2">
														<strong>Street:</strong>{" "}
														{
															addresses.detailed
																.road
														}
													</Typography>
												)}
												{addresses.detailed
													.neighbourhood && (
													<Typography variant="body2">
														<strong>
															Neighbourhood:
														</strong>{" "}
														{
															addresses.detailed
																.neighbourhood
														}
													</Typography>
												)}
												{addresses.detailed.city && (
													<Typography variant="body2">
														<strong>City:</strong>{" "}
														{
															addresses.detailed
																.city
														}
													</Typography>
												)}
												{addresses.detailed.state && (
													<Typography variant="body2">
														<strong>State:</strong>{" "}
														{
															addresses.detailed
																.state
														}
													</Typography>
												)}
												{addresses.detailed
													.postcode && (
													<Typography variant="body2">
														<strong>
															Postcode:
														</strong>{" "}
														{
															addresses.detailed
																.postcode
														}
													</Typography>
												)}
												{addresses.detailed.country && (
													<Typography variant="body2">
														<strong>
															Country:
														</strong>{" "}
														{
															addresses.detailed
																.country
														}
													</Typography>
												)}
											</div>
										</Alert>
									</Box>
								)}
							</div>
						)}
					</CardContent>
				</Card>
			)}

			{/* Code Examples */}
			<Card>
				<CardContent>
					<Typography variant="h6" gutterBottom>
						💻 How to Use in Your Code
					</Typography>
					<Box className="space-y-3">
						<Box>
							<Typography variant="subtitle2" className="mb-2">
								1. Simple Address:
							</Typography>
							<pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
								{`import { reverseGeocode } from "@/utils/locationUtils";

const address = await reverseGeocode(coordinates);
console.log(address); // Full address string`}
							</pre>
						</Box>

						<Box>
							<Typography variant="subtitle2" className="mb-2">
								2. Detailed Address:
							</Typography>
							<pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
								{`import { getDetailedAddress } from "@/utils/locationUtils";

const details = await getDetailedAddress(coordinates);
console.log(details.road);     // Street name
console.log(details.city);     // City name
console.log(details.postcode); // Postal code`}
							</pre>
						</Box>

						<Box>
							<Typography variant="subtitle2" className="mb-2">
								3. Short Address:
							</Typography>
							<pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
								{`import { getShortAddress } from "@/utils/locationUtils";

const shortAddr = await getShortAddress(coordinates);
console.log(shortAddr); // "Street, District, City"`}
							</pre>
						</Box>
					</Box>
				</CardContent>
			</Card>
		</div>
	);
};

export default AddressFromLocationDemo;
