import AuthClient from "client/AuthClient";
import { isValid } from "client/index";

export const login = async ({
	email,
	password,
	type = "CUSTOMER",
	refUrl,
	redirectUrl,
}: {
	email: string;
	password?: string;
	type?: string;
	refUrl?: string;
	redirectUrl?: string;
}) => {
	const authRes = await AuthClient.postLogin({
		email,
		password: password || "",
	});
	if (!isValid(authRes)) {
		return authRes;
	}
	return authRes;
};

export default {
	login,
};
