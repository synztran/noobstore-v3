import { GET, POST, PUT } from "@/client";
import { SERVICE_API } from "@/constants/APIUri";
import { IResponse } from "@/interface/Client/interface";
import { IResponseBackendServicePayment } from "@/interface/Client/Service";

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

const getBookingService = async (params: { id: string }) => {
	const url = SERVICE_API.GET_BOOKING;
	return GET({ url, params, isAuth: true });
};

const postBookingService = async (
	payload: unknown
): Promise<IResponse<unknown>> => {
	const url = SERVICE_API.POST_BOOKING;
	return POST({ url, body: payload, isAuth: true });
};

const getCheckingPayment = async (params: { bookingId: string }) => {
	const url = SERVICE_API.GET_BOOKING_PAYMENT_CHECKING;
	return GET({ url, params, isAuth: true });
};

const postSubmitPayment = async (
	payload: unknown
): Promise<IResponse<IResponseBackendServicePayment>> => {
	const url = SERVICE_API.POST_BOOKING_SUBMIT_PAYMENT;
	return POST({ url, body: payload, isAuth: true });
};

export default {
	getDefinitions,
	getPlans,
	getTasks,
	getFees,
	getServiceOptions,
	getBookingService,
	postBookingService,
	getCheckingPayment,
	postSubmitPayment,
};
