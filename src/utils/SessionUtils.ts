import Cookies from "js-cookie";
import {
	ACCESS_TOKEN,
	ACCESS_TOKEN_LONGLIVE,
	GENERAL_DOMAIN,
} from "../systemconfig";

export function getSessionTokenClient() {
	// js-cookie get only accepts one argument (the key)
	const tk = Cookies.get(ACCESS_TOKEN);
	if (tk && tk.length > 0) {
		return tk;
	}
	const tkLong = Cookies.get(ACCESS_TOKEN_LONGLIVE) || "";
	return tkLong && tkLong !== "null" ? tkLong : "";
}

// TODO: refactor constants
export const removeSessionToken = () => {
	// js-cookie remove accepts options, but get does not
	Cookies.remove(ACCESS_TOKEN, { domain: GENERAL_DOMAIN });
	Cookies.remove(ACCESS_TOKEN);
	Cookies.remove(ACCESS_TOKEN_LONGLIVE, { domain: GENERAL_DOMAIN });
	Cookies.remove(ACCESS_TOKEN_LONGLIVE);
};

export default {
	getSessionTokenClient,
	removeSessionToken,
};
