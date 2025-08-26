import { GET, PUT } from "@/client";
import { SERVICE_API } from "@/constants/APIUri";

const getDefinitions = async (params?: { category?: string }) => {
	const url = SERVICE_API.GET_DEFINITIONS;
	return GET({ url, params });
};

const getPlans = async () => {
	const url = SERVICE_API.GET_PLANS;
	return GET({ url });
};

const getTasks = async () => {
	const url = SERVICE_API.GET_TASKS;
	return GET({ url });
};

const getBooking = async () => {
	const url = SERVICE_API.GET_BOOKING;
	return GET({ url, isAuth: true });
};

const upsertBooking = async (payload: unknown) => {
	const url = SERVICE_API.UPSERT_BOOKING;
	return PUT({ url, body: payload, isAuth: true });
};

export default {
	getDefinitions,
	getPlans,
	getTasks,
	getBooking,
	upsertBooking,
};
