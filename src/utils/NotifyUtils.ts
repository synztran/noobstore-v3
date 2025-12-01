import { ReactNode } from "react";
import { toast, ToastOptions, TypeOptions, Id } from "react-toastify";
import { hashCode } from "./StringUtils";

type ShowContent = string | ReactNode;
type ShowOptions = ToastOptions & { timeout?: number }; // Add timeout to ShowOptions

const show = (
	content: ShowContent,
	type: TypeOptions,
	options: ShowOptions = {}
): void => {
	let toastId: Id | undefined = options.toastId;
	if (!toastId && typeof content === "string") {
		toastId = hashCode(`${content || ""}-${Date.now()}`)?.toString();
	}

	if (toastId && toast.isActive(toastId)) {
		toast.update(toastId, { autoClose: options.timeout || 1500 }); // Use timeout if provided
		return;
	}

	toast(content, {
		type,
		position: "top-right",
		autoClose: options.timeout || 5000, // Default to 5000ms if no timeout is provided
		toastId,
		...options,
	});
};

const info = (content: ShowContent, options?: ShowOptions): void =>
	show(content, "info", options);

const success = (content: ShowContent, options?: ShowOptions): void =>
	show(content, "success", options);

const error = (content: ShowContent, options?: ShowOptions): void =>
	show(content, "error", options);

const warn = (content: ShowContent, options?: ShowOptions): void =>
	show(content, "warning", options);

const NotifyUtils = { info, success, error, warn };

export default NotifyUtils;
