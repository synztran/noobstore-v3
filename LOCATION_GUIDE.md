# Customer Location Detection Guide

This guide explains how to request and identify customer location in your application using the browser's Geolocation API and interactive maps.

## 🚀 Quick Start

### 1. Basic Location Request

Use the `LocationRequestButton` component for simple location detection:

```tsx
import LocationRequestButton from "@/components/LocationRequestButton";
import { GeolocationCoordinates } from "@/hook/useGeolocation";

function MyComponent() {
	const handleLocationReceived = (coordinates: GeolocationCoordinates) => {
		console.log("Customer location:", coordinates);
		// Do something with the coordinates
	};

	const handleLocationError = (error: string) => {
		console.error("Location error:", error);
		// Handle error (show message to user, etc.)
	};

	return (
		<LocationRequestButton
			onLocationReceived={handleLocationReceived}
			onError={handleLocationError}
			variant="contained"
		/>
	);
}
```

### 2. Using the Custom Hook

For more control, use the `useGeolocation` hook directly:

```tsx
import useGeolocation from "@/hook/useGeolocation";

function MyComponent() {
	const { coordinates, error, loading, getCurrentLocation } =
		useGeolocation();

	const handleGetLocation = async () => {
		try {
			const location = await getCurrentLocation();
			console.log("Location:", location);
		} catch (err) {
			console.error("Failed to get location:", err);
		}
	};

	return (
		<div>
			<button onClick={handleGetLocation} disabled={loading}>
				{loading ? "Getting location..." : "Get My Location"}
			</button>
			{coordinates && (
				<p>
					Your location: {coordinates.latitude},{" "}
					{coordinates.longitude}
				</p>
			)}
			{error && <p>Error: {error.message}</p>}
		</div>
	);
}
```

## 🗺️ Interactive Maps

### Enhanced LocationPicker

The `LocationPicker` component now supports automatic location detection:

```tsx
import dynamic from "next/dynamic";

const LocationPicker = dynamic(() => import("@/components/LocationPicker"), {
	ssr: false,
});

function MyComponent() {
	const handleLocationSelected = (latlng: { lat: number; lng: number }) => {
		console.log("Selected location:", latlng);
	};

	return (
		<LocationPicker
			onLocationSelected={handleLocationSelected}
			initialCenter={[10.7769, 106.7009]} // Ho Chi Minh City
			enableCurrentLocation={true} // Shows "Get Current Location" button
		/>
	);
}
```

## 🛠️ Utility Functions

### Address Conversion

Convert coordinates to human-readable addresses:

```tsx
import { reverseGeocode } from "@/utils/locationUtils";

const getAddressFromCoordinates = async (
	coordinates: GeolocationCoordinates
) => {
	try {
		const address = await reverseGeocode(coordinates);
		console.log("Address:", address);
		return address;
	} catch (error) {
		console.error("Geocoding failed:", error);
		return `${coordinates.latitude}, ${coordinates.longitude}`;
	}
};
```

### Distance Calculation

Calculate distance between two points:

```tsx
import { calculateDistance, isWithinRadius } from "@/utils/locationUtils";

const customerLocation = { latitude: 10.7769, longitude: 106.7009 };
const serviceCenter = { latitude: 10.7829, longitude: 106.6955 };

// Calculate distance in kilometers
const distance = calculateDistance(customerLocation, serviceCenter);
console.log(`Distance: ${distance} km`);

// Check if within service area (e.g., 50km radius)
const withinServiceArea = isWithinRadius(customerLocation, serviceCenter, 50);
console.log(`Within service area: ${withinServiceArea}`);
```

## 🔧 Integration with Service Forms

The location functionality is already integrated into your service forms. Here's how it works:

### Location Data Storage

Location coordinates are stored in the service form state:

```tsx
// Service form structure
interface IServiceForm {
	shipping: {
		pickup?: {
			address?: string;
			coordinates?: {
				latitude: number;
				longitude: number;
			};
		};
		delivery?: {
			address?: string;
			coordinates?: {
				latitude: number;
				longitude: number;
			};
		};
	};
}
```

### Accessing Location Data

```tsx
import useServices from "@/zustand/useServices";

function MyComponent() {
	const { serviceForm } = useServices();

	// Access delivery location
	const deliveryCoords = serviceForm.shipping.delivery?.coordinates;
	if (deliveryCoords) {
		console.log("Delivery location:", deliveryCoords);
	}

	// Access pickup location
	const pickupCoords = serviceForm.shipping.pickup?.coordinates;
	if (pickupCoords) {
		console.log("Pickup location:", pickupCoords);
	}
}
```

## 🔒 Privacy & Permissions

### Browser Permission Handling

The geolocation API requires user permission. Handle different permission states:

```tsx
const handleLocationRequest = async () => {
	try {
		const coordinates = await getCurrentLocation();
		// Success - user granted permission and location was obtained
		console.log("Location:", coordinates);
	} catch (error: any) {
		switch (error.code) {
			case 1: // PERMISSION_DENIED
				alert(
					"Please enable location permissions to use this feature."
				);
				break;
			case 2: // POSITION_UNAVAILABLE
				alert("Location information is unavailable.");
				break;
			case 3: // TIMEOUT
				alert("Location request timed out.");
				break;
			default:
				alert("An error occurred while retrieving location.");
		}
	}
};
```

### Best Practices

1. **Always provide fallback options**: Allow manual address input if geolocation fails
2. **Explain why you need location**: Tell users how location will be used
3. **Respect user choice**: Don't repeatedly ask for permission if denied
4. **Handle errors gracefully**: Provide clear error messages and alternatives

## 🎯 Use Cases

### 1. Service Area Validation

```tsx
const validateServiceArea = (coordinates: GeolocationCoordinates) => {
	const serviceCenter = { latitude: 10.7769, longitude: 106.7009 };
	const maxDistance = 50; // 50km service radius

	const distance = calculateDistance(coordinates, serviceCenter);
	const isInServiceArea = distance <= maxDistance;

	if (!isInServiceArea) {
		alert(
			`Sorry, we don't service your area yet. You're ${distance.toFixed(
				1
			)}km from our service center.`
		);
		return false;
	}

	return true;
};
```

### 2. Automatic Address Filling

```tsx
const autoFillAddress = async (coordinates: GeolocationCoordinates) => {
	const address = await reverseGeocode(coordinates);

	// Update form field
	setFormData((prev) => ({
		...prev,
		address: address,
	}));
};
```

### 3. Delivery Time Estimation

```tsx
const estimateDeliveryTime = (customerCoords: GeolocationCoordinates) => {
	const warehouseCoords = { latitude: 10.7769, longitude: 106.7009 };
	const distance = calculateDistance(customerCoords, warehouseCoords);

	// Rough estimation: 30 minutes per 10km
	const estimatedMinutes = Math.ceil((distance / 10) * 30);

	return `Estimated delivery time: ${estimatedMinutes} minutes`;
};
```

## 🔧 Configuration

### Geolocation Options

Customize geolocation behavior:

```tsx
const options: PositionOptions = {
	enableHighAccuracy: true, // Use GPS if available
	timeout: 10000, // 10 second timeout
	maximumAge: 300000, // Accept 5-minute old cached position
};

navigator.geolocation.getCurrentPosition(success, error, options);
```

### Map Configuration

Configure map appearance and behavior:

```tsx
<LocationPicker
	initialCenter={[10.7769, 106.7009]} // Default center
	enableCurrentLocation={true} // Show location button
	onLocationSelected={handleLocation} // Callback function
/>
```

## 🐛 Troubleshooting

### Common Issues

1. **"Geolocation is not supported"**

    - Occurs in older browsers or non-HTTPS contexts
    - Solution: Provide manual address input as fallback

2. **"User denied location permission"**

    - User clicked "Block" on permission request
    - Solution: Explain benefits and provide manual input option

3. **"Location request timed out"**

    - GPS signal weak or unavailable
    - Solution: Increase timeout or use network-based location

4. **Map not loading**
    - Often due to server-side rendering issues
    - Solution: Use dynamic imports with `ssr: false`

### Debug Tips

```tsx
// Enable detailed logging
const debugLocation = (coordinates: GeolocationCoordinates) => {
	console.log("Location debug info:", {
		latitude: coordinates.latitude,
		longitude: coordinates.longitude,
		accuracy: coordinates.accuracy,
		timestamp: new Date().toISOString(),
		userAgent: navigator.userAgent,
	});
};
```

## 📱 Mobile Considerations

-   **GPS vs Network**: Mobile devices can use GPS, WiFi, or cell tower triangulation
-   **Battery Impact**: High accuracy mode uses more battery
-   **Permission Persistence**: Mobile browsers may ask for permission each time
-   **Offline Handling**: Consider what happens when user is offline

## 🌐 Browser Support

| Browser | Support    | Notes                              |
| ------- | ---------- | ---------------------------------- |
| Chrome  | ✅ Full    | Requires HTTPS in production       |
| Firefox | ✅ Full    | Requires HTTPS in production       |
| Safari  | ✅ Full    | May require user interaction first |
| Edge    | ✅ Full    | Requires HTTPS in production       |
| IE 11   | ⚠️ Limited | Basic support only                 |

## 🚀 Next Steps

1. Test the location functionality in your development environment
2. Implement proper error handling for your use case
3. Add location validation for your service areas
4. Consider adding location-based features like:
    - Nearest service center finder
    - Delivery time estimation
    - Service area coverage maps
    - Location-based pricing

For more advanced features or custom implementations, refer to the source code in:

-   `/src/hook/useGeolocation.ts`
-   `/src/components/LocationRequestButton/`
-   `/src/components/LocationPicker/`
-   `/src/utils/locationUtils.ts`
