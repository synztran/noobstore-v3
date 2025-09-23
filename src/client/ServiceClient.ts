import { GET, PUT } from "@/client";
import { SERVICE_API } from "@/constants/APIUri";

const getDefinitions = async (params?: { category?: string }) => {
	const url = SERVICE_API.GET_DEFINITIONS;
	return GET({ url, params, isAuth: true });
};

const getPlans = async (planId?: string) => {
	const url = SERVICE_API.GET_PLANS;
	return GET({ url, params: { planId }, isAuth: true });
};

const getTasks = async () => {
	const url = SERVICE_API.GET_TASKS;
	return GET({ url, isAuth: true });
};

const getFees = async () => {
	const url = SERVICE_API.GET_FEES;
	return GET({ url, isAuth: true });
};

const getServiceOptions = async () => {
	const url = SERVICE_API.GET_SERVICE_OPTIONS;
	return GET({ url, isAuth: true });
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
	getFees,
	getServiceOptions,
	getBooking,
	upsertBooking,
};
