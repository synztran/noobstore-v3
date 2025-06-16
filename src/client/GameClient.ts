import { LUCKY_WHEEL_API } from "@/constants/APIUri";
import { GET, POST } from ".";
import { IResquestSpinWheel, IResSpin } from "@/interface/Client/Game";

const postSpinWheel = async (
	body: IResquestSpinWheel = {
		wheelCode: "",
		isFree: false,
	}
): Promise<IResSpin> => {
	const url = LUCKY_WHEEL_API.SPIN;
	return POST({
		url,
		body,
		isAuth: true,
	});
};

const getLuckyWheel = async () => {
	const url = LUCKY_WHEEL_API.GET;
	return GET({
		url,
		isAuth: true,
	});
};

export default {
	postSpinWheel,
	getLuckyWheel,
};
