import { toast, ToastOptions, TypeOptions, Id } from "react-toastify";
import { hashCode } from "./StringUtils";

type ShowOptions = ToastOptions & { [key: string]: any };

const show = (
	text: string,
	type: TypeOptions,
	options: ShowOptions = {}
): void => {
	// create toastId
	const toastId: Id = hashCode(`${text}-${Date.now()}`)?.toString() || "";

	// prevent duplicate message
	if (toast.isActive(toastId)) {
		toast.update(toastId, { autoClose: 1500 });
	} else {
		toast(text, {
			toastId,
			type,
			position: "bottom-right",
			...options,
		});
	}
};

const info = (text: string, options?: ShowOptions): void => {
	show(text, "info", options);
};

const success = (text: string | JSX.Element, options?: ShowOptions): void => {
	show(typeof text === "string" ? text : text.toString(), "success", options);
};

const dark = (text: string, options?: ShowOptions): void => {
	show(text, "dark" as TypeOptions, options);
};

const error = (text: string, options?: ShowOptions): void => {
	show(text, "error", options);
};

const warn = (text: string, options?: ShowOptions): void => {
	show(text, "warn" as TypeOptions, options);
};

const NotifyUtils = { info, success, dark, error, warn };

export default NotifyUtils;
