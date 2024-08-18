export const HTTP_STATUS = {
	Ok: "OK",
	Error: "ERROR",
	Invalid: "INVALID",
	NotFound: "NOT_FOUND",
	Forbidden: "FORBIDDEN",
	Existed: "EXISTED",
	Unauthorized: "UNAUTHORIZED",
};

export const HTTP_REQUEST_PRIORITY = {
	low: "low",
	high: "high",
	auto: "auto",
};
export default {
	HTTP_STATUS,
	HTTP_REQUEST_PRIORITY,
};

export const RETRY_NUMBER_GET_USER = 3;