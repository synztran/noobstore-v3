import L from "leaflet";
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS
import { useEffect, useRef, useState } from "react";

const LocationPicker = ({
	onLocationSelected,
	initialCenter,
	enableCurrentLocation = true,
}) => {
	const mapRef = useRef(null);
	const markerRef = useRef(null);
	const [selectedLocation, setSelectedLocation] = useState(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [isLoadingLocation, setIsLoadingLocation] = useState(false);

	// const geocoder = NodeGeocoder({
	//   provider: 'openstreetmap', // Or another provider
	// });

	useEffect(() => {
		if (!mapRef.current) {
			// Use initialCenter if provided, otherwise default to Ho Chi Minh City
			const defaultCenter = initialCenter || [10.7769, 106.7009];
			mapRef.current = L.map("map").setView(defaultCenter, 13);

			L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
				attribution:
					'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
			}).addTo(mapRef.current);

			mapRef.current.on("click", handleMapClick);
		}

		return () => {
			if (mapRef.current) {
				mapRef.current.off("click", handleMapClick);
				mapRef.current?.remove(); // Clean up the map
				mapRef.current = null;
			}
		};
	}, [initialCenter]);

	const handleMapClick = (e) => {
		const { latlng } = e;
		setSelectedLocation(latlng);
		updateMarker(latlng);
		if (onLocationSelected) {
			onLocationSelected(latlng);
		}
	};

	const updateMarker = (latlng) => {
		if (markerRef.current) {
			markerRef.current.setLatLng(latlng);
		} else {
			markerRef.current = L.marker(latlng).addTo(mapRef.current);
		}
		markerRef.current.addTo(mapRef.current); //Ensure Marker is added to map.
	};

	const handleSearchChange = (e) => {
		setSearchQuery(e.target.value);
	};

	const handleSearchSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await fetch(
				`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
					searchQuery,
				)}&format=json`,
			);
			const results = await response.json();
			setSearchResults(results);
		} catch (error) {
			console.error("Geocoding error:", error);
		}
	};

	const handleSearchResultClick = (result) => {
		const { lat, lon } = result;
		const latlng = { lat: parseFloat(lat), lng: parseFloat(lon) };
		mapRef.current.setView(latlng, 15);
		setSelectedLocation(latlng);
		updateMarker(latlng);
		if (onLocationSelected) {
			onLocationSelected(latlng);
		}
		setSearchResults([]);
	};

	const getCurrentLocation = () => {
		if (!navigator.geolocation) {
			alert("Geolocation is not supported by this browser.");
			return;
		}

		setIsLoadingLocation(true);

		navigator.geolocation.getCurrentPosition(
			(position) => {
				const latlng = {
					lat: position.coords.latitude,
					lng: position.coords.longitude,
				};

				mapRef.current.setView(latlng, 15);
				setSelectedLocation(latlng);
				updateMarker(latlng);

				if (onLocationSelected) {
					onLocationSelected(latlng);
				}

				setIsLoadingLocation(false);
			},
			(error) => {
				console.error("Error getting location:", error);
				let errorMessage;
				switch (error.code) {
					case error.PERMISSION_DENIED:
						errorMessage =
							"Người dùng từ chối cấp quyền truy cập vị trí.";
						break;
					case error.POSITION_UNAVAILABLE:
						errorMessage = "Thông tin vị trí không khả dụng.";
						break;
					case error.TIMEOUT:
						errorMessage =
							"Yêu cầu lấy vị trí đã hết thời gian chờ.";
						break;
					default:
						errorMessage =
							"Đã xảy ra lỗi không xác định khi lấy vị trí.";
						break;
				}
				alert(errorMessage);
				setIsLoadingLocation(false);
			},
			{
				enableHighAccuracy: true,
				timeout: 10000,
				maximumAge: 300000,
			},
		);
	};

	return (
		<div>
			<div className="flex justify-between items-center mb-2">
				<label htmlFor="location">Pick a location:</label>
				{enableCurrentLocation && (
					<button
						onClick={getCurrentLocation}
						disabled={isLoadingLocation}
						className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-3 py-1 rounded text-sm">
						{isLoadingLocation
							? "Đang lấy vị trí..."
							: "📍 Vị trí hiện tại"}
					</button>
				)}
			</div>
			<div id="map" style={{ height: "500px", width: "100%" }} />
			<form onSubmit={handleSearchSubmit} className="mt-2 flex gap-2">
				<input
					type="text"
					placeholder="Search for a location"
					value={searchQuery}
					onChange={handleSearchChange}
					className="flex-1 px-3 py-2 border border-gray-300 rounded"
				/>
				<button
					type="submit"
					className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
					Search
				</button>
			</form>
			{searchResults.length > 0 && (
				<ul>
					{searchResults.map((result) => (
						<li
							key={result.display_name}
							onClick={() => handleSearchResultClick(result)}>
							{result.display_name}
						</li>
					))}
				</ul>
			)}

			{/* <p>Selected Location: {location}</p> */}
		</div>
	);
};

export default LocationPicker;
