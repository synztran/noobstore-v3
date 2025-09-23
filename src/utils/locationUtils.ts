import { GeolocationCoordinates } from "@/hook/useGeolocation";

/**
 * Convert coordinates to a human-readable address using reverse geocoding
 * @param coordinates - The latitude and longitude coordinates
 * @returns Promise with the address string
 */
export const reverseGeocode = async (
	coordinates: GeolocationCoordinates
): Promise<string> => {
	try {
		const response = await fetch(
			`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coordinates.latitude}&lon=${coordinates.longitude}&zoom=18&addressdetails=1`
		);

		const data = await response.json();

		if (data && data.display_name) {
			return data.display_name;
		}

		return `${coordinates.latitude.toFixed(
			6
		)}, ${coordinates.longitude.toFixed(6)}`;
	} catch (error) {
		console.error("Reverse geocoding error:", error);
		return `${coordinates.latitude.toFixed(
			6
		)}, ${coordinates.longitude.toFixed(6)}`;
	}
};

/**
 * Detailed address information interface
 */
export interface DetailedAddress {
	display_name: string;
	house_number?: string;
	road?: string;
	neighbourhood?: string;
	suburb?: string;
	city?: string;
	state?: string;
	postcode?: string;
	country?: string;
	formatted_address: string;
}

/**
 * Get detailed address information from coordinates
 * @param coordinates - The latitude and longitude coordinates
 * @returns Promise with detailed address information
 */
export const getDetailedAddress = async (
	coordinates: GeolocationCoordinates
): Promise<DetailedAddress> => {
	try {
		const response = await fetch(
			`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coordinates.latitude}&lon=${coordinates.longitude}&zoom=18&addressdetails=1`
		);

		const data = await response.json();

		if (data) {
			const address = data.address || {};

			// Format a clean address
			const addressParts = [
				address.house_number,
				address.road,
				address.neighbourhood || address.suburb,
				address.city || address.town || address.village,
				address.state,
				address.country,
			].filter(Boolean);

			return {
				display_name:
					data.display_name || "Không xác định được địa chỉ",
				house_number: address.house_number,
				road: address.road,
				neighbourhood: address.neighbourhood || address.suburb,
				suburb: address.suburb,
				city: address.city || address.town || address.village,
				state: address.state,
				postcode: address.postcode,
				country: address.country,
				formatted_address: addressParts.join(", "),
			};
		}

		return {
			display_name: `${coordinates.latitude.toFixed(
				6
			)}, ${coordinates.longitude.toFixed(6)}`,
			formatted_address: `${coordinates.latitude.toFixed(
				6
			)}, ${coordinates.longitude.toFixed(6)}`,
		};
	} catch (error) {
		console.error("Detailed reverse geocoding error:", error);
		return {
			display_name: `${coordinates.latitude.toFixed(
				6
			)}, ${coordinates.longitude.toFixed(6)}`,
			formatted_address: `${coordinates.latitude.toFixed(
				6
			)}, ${coordinates.longitude.toFixed(6)}`,
		};
	}
};

/**
 * Get short address (street + district + city)
 * @param coordinates - The latitude and longitude coordinates
 * @returns Promise with short address string
 */
export const getShortAddress = async (
	coordinates: GeolocationCoordinates
): Promise<string> => {
	try {
		const detailedAddress = await getDetailedAddress(coordinates);

		const shortParts = [
			detailedAddress.road,
			detailedAddress.neighbourhood || detailedAddress.suburb,
			detailedAddress.city,
		].filter(Boolean);

		return shortParts.length > 0
			? shortParts.join(", ")
			: detailedAddress.formatted_address;
	} catch (error) {
		console.error("Short address error:", error);
		return `${coordinates.latitude.toFixed(
			6
		)}, ${coordinates.longitude.toFixed(6)}`;
	}
};

/**
 * Calculate the distance between two coordinates using the Haversine formula
 * @param coord1 - First coordinate
 * @param coord2 - Second coordinate
 * @returns Distance in kilometers
 */
export const calculateDistance = (
	coord1: { latitude: number; longitude: number },
	coord2: { latitude: number; longitude: number }
): number => {
	const R = 6371; // Earth's radius in kilometers
	const dLat = toRadians(coord2.latitude - coord1.latitude);
	const dLon = toRadians(coord2.longitude - coord1.longitude);

	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(toRadians(coord1.latitude)) *
			Math.cos(toRadians(coord2.latitude)) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2);

	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	const distance = R * c;

	return Math.round(distance * 100) / 100; // Round to 2 decimal places
};

/**
 * Convert degrees to radians
 * @param degrees - Degrees to convert
 * @returns Radians
 */
const toRadians = (degrees: number): number => {
	return degrees * (Math.PI / 180);
};

/**
 * Check if the user is within a certain radius of a target location
 * @param userLocation - User's current location
 * @param targetLocation - Target location to check against
 * @param radiusKm - Radius in kilometers
 * @returns Boolean indicating if user is within radius
 */
export const isWithinRadius = (
	userLocation: { latitude: number; longitude: number },
	targetLocation: { latitude: number; longitude: number },
	radiusKm: number
): boolean => {
	const distance = calculateDistance(userLocation, targetLocation);
	return distance <= radiusKm;
};

/**
 * Get the user's location with a timeout and high accuracy
 * @param options - Geolocation options
 * @returns Promise with coordinates
 */
export const getCurrentPosition = (
	options?: PositionOptions
): Promise<GeolocationCoordinates> => {
	return new Promise((resolve, reject) => {
		if (!navigator.geolocation) {
			reject(new Error("Geolocation is not supported by this browser."));
			return;
		}

		const defaultOptions: PositionOptions = {
			enableHighAccuracy: true,
			timeout: 10000,
			maximumAge: 300000, // 5 minutes
			...options,
		};

		navigator.geolocation.getCurrentPosition(
			(position) => {
				resolve({
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
					accuracy: position.coords.accuracy,
					altitude: position.coords.altitude,
					altitudeAccuracy: position.coords.altitudeAccuracy,
					heading: position.coords.heading,
					speed: position.coords.speed,
				});
			},
			(error) => {
				let errorMessage: string;

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

				reject(new Error(errorMessage));
			},
			defaultOptions
		);
	});
};
