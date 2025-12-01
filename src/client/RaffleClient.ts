import { RAFFLE_API } from "@/constants/APIUri";
import { GET, POST } from ".";
import { IResponse } from "@/interface/Client/interface";
import { IBEResponseRaffleInfo } from "@/interface/Client/Raffle";

const getDetailRaffle = async (params?: {
	raffleId: string;
	participantEmail?: string;
}): Promise<IResponse<IBEResponseRaffleInfo>> => {
	const url = RAFFLE_API.GET_RAFFLES;
	return GET({
		url,
		isAuth: false,
		params,
	});
};

const getRaffles = async (params?: { featuredOnly?: boolean }) => {
	const url = RAFFLE_API.GET_RAFFLES;
	return GET({ url, params, isAuth: false });
};

const postRaffleJoin = async (payload: any) => {
	const url = RAFFLE_API.POST_RAFFLE_JOIN;
	return POST({ url, body: payload, isAuth: true });
};

export default {
	getDetailRaffle,
	getRaffles,
	postRaffleJoin,
};
