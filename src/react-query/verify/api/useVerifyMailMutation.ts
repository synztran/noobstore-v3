import AuthClient from "@/client/AuthClient";
import NotifyUtils from "@/utils/NotifyUtils";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

interface Variables {
	token: string;
	type: "customer" | "maker";
}

export function useVerifyMailMutation(
	mutationOptions: UseMutationOptions<unknown, Error, Variables> = {},
) {
	return useMutation({
		mutationFn: async (variables) => {
			const data = {
				token: variables.token,
				type: variables.type,
			};
			const resp = await AuthClient.postVerifyMail(data);
			return resp;
		},
		onError: () => {
			NotifyUtils.error("Có lỗi xảy ra. Không thể xác thực email");
		},
		onSuccess: (resp: any, variables) => {
			console.log("resp", resp);
			if (resp.status !== "OK") {
				NotifyUtils.error("Xác thực email thất bại");
				return;
			}
			NotifyUtils.success(`Tài khoản xác thực thành công`);
		},
		...mutationOptions,
	});
}
