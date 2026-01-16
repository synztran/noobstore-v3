import { RAFFLE_API } from "@/constants/APIUri";
import { IResponse } from "@/interface/Client/interface";
import { IBEResponseRaffleInfo } from "@/interface/Client/Raffle";
import { GET, POST } from ".";

const getDetailRaffle = async (params?: {
	raffleId: string;
	participantEmail?: string;
}): Promise<IResponse<IBEResponseRaffleInfo>> => {
	const url = RAFFLE_API.GET_RAFFLES;
	return GET({
		url,
		isAuth: true,
		params,
	});
};

const getRaffles = async (params?: {
	featuredOnly?: boolean;
}): Promise<IResponse<IBEResponseRaffleInfo>> => {
	const url = RAFFLE_API.GET_RAFFLES;
	return GET({ url, params, isAuth: true });
};

const postRaffleJoin = async (payload: any) => {
	const url = RAFFLE_API.POST_RAFFLE_JOIN;
	return POST({ url, body: payload, isAuth: true });
};

const postRaffleSubmitSecretKey = async (payload: {
	secretKey: string;
	raffleId: string;
}) => {
	const url = RAFFLE_API.POST_RAFFLE_SUBMIT_SECRET_KEY;
	return POST({ url, body: payload, isAuth: true });
};

const postRaffleSubmitPayment = async (payload: any) => {
	const url = RAFFLE_API.POST_RAFFLE_SUBMIT_PAYMENT;
	return POST({ url, body: payload, isAuth: true });
};

export default {
	getDetailRaffle,
	getRaffles,
	postRaffleJoin,
	postRaffleSubmitSecretKey,
	postRaffleSubmitPayment,
};
