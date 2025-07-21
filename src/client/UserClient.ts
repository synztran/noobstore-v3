import { ACCOUNT_API } from "@/constants/APIUri";
import { GET } from "./index";
import { IResponse } from "@/interface/Client/interface";
import { IAuthUser } from "@/interface/Context/auth";

const getCurrentUser = async (ctx?: unknown): Promise<IResponse<IAuthUser>> => {
	const url = ACCOUNT_API.CURRENT_ACCOUNT;
	return GET({ ctx, url });
};

export default {
	getCurrentUser,
};
