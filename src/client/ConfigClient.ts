import { CONFIG_API } from "constants/APIUri";
import { GET } from "./index";

export const getAllConfig = async () => {
	const url = CONFIG_API.ALL_CONFIG;
	return GET({ url, isAuth: true });
};

export default {
	getAllConfig,
};
