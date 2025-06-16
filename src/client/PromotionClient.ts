import { PROMOTION_API } from "@/constants/APIUri";
import { GET } from ".";

const getLuckyWheel = async () => {
	const url = PROMOTION_API.LUCKY_WHEEL;
	return GET({ url, isAuth: true });
};

export default {
	getLuckyWheel,
};
