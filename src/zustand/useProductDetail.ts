import { EnumProductType, IProductOption } from "@/interface/interface";
import NotifyUtils from "@/utils/NotifyUtils";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface Actions {
	updateOptSelected: (payload: IProductOption) => void;
	updateQuantity: (payload: number) => void;
	updateQuantityBasedOnProduct: (payload: string) => void;
	toggleResetQuantity: () => void;
}

interface InitialProductDetailState {
	optSelected: IProductOption | null;
	currentQuantity: number;
	triggerResetQuantity: number;
}

interface IInitialState {
	optSelected: Record<EnumProductType, IProductOption[]> | null; // key is product_id
	currentQuantity: number;
	triggerResetQuantity: number;
}

type ProductDetailState = InitialProductDetailState & { actions: Actions };

const InitialState: IInitialState = {
	optSelected: null,
	currentQuantity: 1,
	triggerResetQuantity: 0,
};

const useStoreProductDetail = create<ProductDetailState>()(
	devtools((set, get) => ({
		...InitialState,
		actions: {
			updateOptSelected: (payload) => {
				if (!payload.productId) {
					NotifyUtils.error("Thiếu thông tin. Vui long kiểm tra lại");
					return;
				}
				set({
					optSelected: {
						...get().optSelected,
						[payload.productPart || ""]: [payload],
					},
				});
			},
			updateQuantity: (payload) => {
				set({
					currentQuantity: payload,
				});
			},
			updateQuantityBasedOnProduct: (payload) => {
				//
			},
			toggleResetQuantity: () => {
				set((state) => ({
					triggerResetQuantity: state.triggerResetQuantity + 1,
				}));
			},
		},
	}))
);

export const useStoreProductDetailAction = () =>
	useStoreProductDetail((state) => state.actions);

export default useStoreProductDetail;
