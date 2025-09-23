import { useState, useCallback } from "react";

export interface GeolocationCoordinates {
	latitude: number;
	longitude: number;
	accuracy?: number;
	altitude?: number | null;
	altitudeAccuracy?: number | null;
	heading?: number | null;
	speed?: number | null;
}

export interface GeolocationError {
	code: number;
	message: string;
}

export interface UseGeolocationReturn {
	coordinates: GeolocationCoordinates | null;
	error: GeolocationError | null;
	loading: boolean;
	getCurrentLocation: () => Promise<GeolocationCoordinates>;
	clearError: () => void;
}

export const useGeolocation = (): UseGeolocationReturn => {
	const [coordinates, setCoordinates] =
		useState<GeolocationCoordinates | null>(null);
	const [error, setError] = useState<GeolocationError | null>(null);
	const [loading, setLoading] = useState<boolean>(false);

	const clearError = useCallback(() => {
		setError(null);
	}, []);

	const getCurrentLocation =
		useCallback((): Promise<GeolocationCoordinates> => {
			return new Promise((resolve, reject) => {
				if (!navigator.geolocation) {
					const geoError: GeolocationError = {
						code: 0,
						message:
							"Geolocation is not supported by this browser.",
					};
					setError(geoError);
					reject(geoError);
					return;
				}

				setLoading(true);
				setError(null);

				const options: PositionOptions = {
					enableHighAccuracy: true,
					timeout: 10000, // 10 seconds
					maximumAge: 300000, // 5 minutes
				};

				navigator.geolocation.getCurrentPosition(
					(position) => {
						const coords: GeolocationCoordinates = {
							latitude: position.coords.latitude,
							longitude: position.coords.longitude,
							accuracy: position.coords.accuracy,
							altitude: position.coords.altitude,
							altitudeAccuracy: position.coords.altitudeAccuracy,
							heading: position.coords.heading,
							speed: position.coords.speed,
						};

						setCoordinates(coords);
						setLoading(false);
						resolve(coords);
					},
					(positionError) => {
						let errorMessage: string;

						switch (positionError.code) {
							case positionError.PERMISSION_DENIED:
								errorMessage =
									"Người dùng từ chối cấp quyền truy cập vị trí.";
								break;
							case positionError.POSITION_UNAVAILABLE:
								errorMessage =
									"Thông tin vị trí không khả dụng.";
								break;
							case positionError.TIMEOUT:
								errorMessage =
									"Yêu cầu lấy vị trí đã hết thời gian chờ.";
								break;
							default:
								errorMessage =
									"Đã xảy ra lỗi không xác định khi lấy vị trí.";
								break;
						}

						const geoError: GeolocationError = {
							code: positionError.code,
							message: errorMessage,
						};

						setError(geoError);
						setLoading(false);
						reject(geoError);
					},
					options
				);
			});
		}, []);

	return {
		coordinates,
		error,
		loading,
		getCurrentLocation,
		clearError,
	};
};

export default useGeolocation;
