import AuthClient from "@/client/AuthClient";
import NotifyUtils from "@/utils/NotifyUtils";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

interface Variables {
	token: string;
}

export function useVerifyMailMutation(
	mutationOptions: UseMutationOptions<unknown, Error, Variables> = {}
) {
	return useMutation({
		mutationFn: async (variables) => {
			console.log("variables", variables);
			const data = {
				token: variables.token,
			};
			const resp = await AuthClient.postVerifyMail(data);
			console.log("resp", resp);
			return resp;
		},
		onError: () => {
			NotifyUtils.error("Có lỗi xảy ra. Không thể xác thực email");
		},
		onSuccess: (_, variables) => {
			console.log(variables);
			NotifyUtils.success(`Tài khoản xác thực thành công`);
		},
		...mutationOptions,
	});
}
