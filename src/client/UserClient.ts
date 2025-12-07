import { ACCOUNT_API } from "@/constants/APIUri";
import { IResponse } from "@/interface/Client/interface";
import { IAuthUser, IRequestShippingAddress } from "@/interface/Context/auth";
import { GET } from "./index";

const getCurrentUser = async (ctx?: unknown): Promise<IResponse<IAuthUser>> => {
	const url = ACCOUNT_API.CURRENT_ACCOUNT;
	return GET({ ctx, url });
};

const postNewUserShippingAddress = async (
	payload: IRequestShippingAddress
): Promise<IResponse<void>> => {
	const url = ACCOUNT_API.POST_NEW_USER_SHIPPING_ADDRESS;
	return GET({ url, body: payload });
};

export default {
	getCurrentUser,
	postNewUserShippingAddress,
};
