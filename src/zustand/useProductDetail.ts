import { IProductOption } from "@/interface/interface";
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

type ProductDetailState = InitialProductDetailState & { actions: Actions };

const InitialState = {
	optSelected: null,
	currentQuantity: 1,
	triggerResetQuantity: 0,
};

const useStoreProductDetail = create<ProductDetailState>()(
	devtools((set, get) => ({
		...InitialState,
		actions: {
			updateOptSelected: (payload) => {
				set({
					optSelected: payload,
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
