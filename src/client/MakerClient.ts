import { MAKER_API } from "@/constants/APIUri";
import { IResponse } from "@/interface/Client/interface";
import {
	IBEResponseMaker,
	IPayloadCreateMaker,
	IPayloadVerifyEmailMaker,
} from "@/interface/Client/Maker";
import { GET, POST } from ".";

const postCreateMaker = async (
	payload: IPayloadCreateMaker,
): Promise<IResponse<unknown>> => {
	const url = MAKER_API.POST_CREATE_MAKER;
	return POST({ url, body: payload, isAuth: true });
};

const getMakerInfo = async (
	makerId?: string,
): Promise<IResponse<IBEResponseMaker>> => {
	const url = MAKER_API.GET_MAKER_INFO.replace("{makerId}", makerId || "");
	return GET({ url, isAuth: true });
};

const postSendVerifyEmail = async (payload: IPayloadVerifyEmailMaker) => {
	const url = MAKER_API.POST_SEND_VERIFY_MAKER_EMAIL;
	return POST({ url, body: payload, isAuth: true });
};

export default {
	postCreateMaker,
	getMakerInfo,
	postSendVerifyEmail,
};
