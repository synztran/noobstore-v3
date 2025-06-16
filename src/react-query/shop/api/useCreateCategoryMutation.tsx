import CategoryClient from "@/client/CategoryClient";
import { SuccessCreateCategory } from "@/components/CustomToastMessage";
import { appQueryKeys } from "@/react-query/root";
import NotifyUtils from "@/utils/NotifyUtils";
import {
	useMutation,
	UseMutationOptions,
	useQueryClient,
} from "@tanstack/react-query";

interface IVariable {
	payload: any;
}

export function useCreateCategoryMutation(
	mutationOptions: UseMutationOptions<unknown, Error, IVariable> = {}
) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (variables) => {
			const resp = await CategoryClient.postCreateCategory(
				variables.payload
			);
			return resp;
		},
		onError: (_) => {
			NotifyUtils.error("Có lỗi xảy ra. Không thể tạo danh mục");
		},
		onSuccess: (_, variables) => {
			const { categoryName } = variables.payload;
			NotifyUtils.success(
				<SuccessCreateCategory categoryName={categoryName} />
			);
			queryClient.invalidateQueries(appQueryKeys.category.getAll({}));
		},
		...mutationOptions,
	});
}
