import { IServicePlan } from "@/hook/useServicePage";
import { calculateDistance } from "./locationUtils";
import dayjs from "dayjs";

const workingTime = {
	start: {
		hour: 8,
		minute: 30,
	},
	end: {
		hour: 18,
		minute: 0,
	},
};

// Calculate extra delivery fee based on distance from service center
// serviceCenterLocation should be defined somewhere globally or passed in
const SERVICE_CENTER_LOCATION = {
	latitude: 10.801424,
	longitude: 106.714419,
};

const EXTRA_FEE_RULES = [
	{ maxDistance: 5, fee: 0 }, // <= 5km: no extra fee
	{ maxDistance: 10, fee: 30000 }, // >5km and <=10km: 30,000
	{ maxDistance: Infinity, fee: 50000 }, // >10km: 50,000
];

const formatDate = (date: Date, style = "dd/mm/yyyy") => {
	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() is zero-based
	const year = date.getFullYear();
	const hours = String(date.getHours()).padStart(2, "0");
	const minutes = String(date.getMinutes()).padStart(2, "0");

	switch (style) {
		case "dd/mm/yyyy hh:mm":
			return `${day}/${month}/${year} - ${hours}:${minutes}`;
		default:
			return `${day}/${month}/${year}`;
	}
};

const isOutOfWorkingTime = (dateStr?: string | null) => {
	if (!dateStr) return false;
	// const date = new Date(dateStr);
	const date = dayjs(dateStr, "DD/MM/YYYY HH:mm", true);
	if (!date.isValid()) {
		console.error("Invalid date string:", dateStr);
		return false;
	}
	const hour = date.hour();
	const minute = date.minute();

	const startHour = workingTime.start.hour;
	const startMinute = workingTime.start.minute;
	const endHour = workingTime.end.hour;
	const endMinute = workingTime.end.minute;

	// Convert all times to minutes since midnight for easy comparison
	const timeInMinutes = hour * 60 + minute;
	const startInMinutes = startHour * 60 + startMinute;
	const endInMinutes = endHour * 60 + endMinute;

	// Out of working time if before start or after end (end is exclusive)
	if (timeInMinutes < startInMinutes || timeInMinutes >= endInMinutes) {
		return true;
	}

	return false;
};

const deliveryAddressAndFee = async ({
	orderInfo,
}: {
	orderInfo: {
		selectedPlan: IServicePlan;
		deliveryAddress: string;
	};
}) => {
	let fee = 0;
	let distance = "";

	const deliveryDistanceAndFeeResult = await calculateDeliveryDistanceAndFee(
		orderInfo.deliveryAddress
	);

	fee += deliveryDistanceAndFeeResult.extraFee || 0;
	distance = `Phạm vi đăng ký dịch vụ cách phạm vi hoạt động ${deliveryDistanceAndFeeResult.distance}km`;

	console.log("deliveryDistanceAndFeeResult", deliveryDistanceAndFeeResult);

	return { distance, fee };
};

// Helper: parse address string to coordinates using Nominatim API
async function getCoordinatesFromAddress(
	address: string
): Promise<{ latitude: number; longitude: number } | null> {
	try {
		const response = await fetch(
			`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
				address
			)}`,
			{
				headers: {
					Accept: "application/json",
				},
			}
		);
		const data = await response.json();
		if (data && data.length > 0) {
			return {
				latitude: parseFloat(data[0].lat),
				longitude: parseFloat(data[0].lon),
			};
		}
		return null;
	} catch (error) {
		console.error("Error fetching coordinates from address:", error);
		return null;
	}
}

async function calculateDeliveryDistanceAndFee(
	deliveryAddress: string
): Promise<{ distance: number | null; extraFee: number }> {
	if (!deliveryAddress) return { distance: null, extraFee: 0 };
	const coords = await getCoordinatesFromAddress(deliveryAddress);
	if (!coords) return { distance: null, extraFee: 0 };

	// calculateDistance is imported from locationUtils
	const distance = calculateDistance(coords, SERVICE_CENTER_LOCATION);

	let extraFee = 0;
	for (const rule of EXTRA_FEE_RULES) {
		if (distance <= rule.maxDistance) {
			extraFee = rule.fee;
			break;
		}
	}

	return { distance, extraFee };
}

const formatVietNamDate = (dateString: string) => {
	if (!dateString) return "";
	const date = new Date(dateString);
	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
	const year = date.getFullYear();
	return `${day} Tháng ${month}, ${year}`;
};

const formatVietNamTime = (dateString: string, is24h = true) => {
	if (!dateString) return "";
	const date = new Date(dateString);
	const hours = date.getHours();
	const minutes = String(date.getMinutes()).padStart(2, "0");

	if (is24h) {
		const hour24 = String(hours).padStart(2, "0");
		return `${hour24}:${minutes}`;
	}

	const period = hours >= 12 ? "chiều" : "sáng";
	const hour12 = String(hours % 12 || 12).padStart(2, "0");
	return `${hour12}:${minutes} ${period}`;
};

/**
 * Parse a server-provided date into a Date instance treated as UTC when
 * the string has no timezone info. Handles:
 * - Date objects (returned as-is)
 * - ISO strings with timezone ("2025-12-14T12:00:00Z" or with +07:00)
 * - Plain date-time strings without timezone ("2025-12-14 12:00:00" or "2025-12-14T12:00:00")
 *   which we assume are UTC and append 'Z' to parse correctly.
 */
const parseServerDate = (input: string | Date): Date => {
	if (input instanceof Date) return input;
	if (typeof input !== "string") return new Date(input as any);

	const s = input.trim();
	// If the string contains timezone info (Z or +/-hh:mm), let Date parse it
	if (/[zZ]$/.test(s) || /[+-]\d{2}:?\d{2}$/.test(s)) {
		return new Date(s);
	}

	// Numeric timestamp?
	if (/^\d+$/.test(s)) {
		return new Date(Number(s));
	}

	// No timezone info present — assume server sent UTC naive datetime.
	// Ensure we have a 'T' separator and append 'Z' to force UTC parsing.
	const withT = s.includes("T") ? s : s.replace(/\s+/, "T");
	return new Date(withT + "Z");
};

function getTimeLeft(start: Date, end: Date, now: Date) {
	if (now < start) {
		const diff = start.getTime() - now.getTime();
		return { mode: "upcoming", diff };
	}
	if (now >= start && now <= end) {
		const diff = end.getTime() - now.getTime();
		return { mode: "running", diff };
	}
	return { mode: "ended", diff: 0 };
}

export default {
	formatDate,
	isOutOfWorkingTime,
	calculateDeliveryDistanceAndFee,
	formatVietNamDate,
	formatVietNamTime,
	parseServerDate,
	getTimeLeft,
};
