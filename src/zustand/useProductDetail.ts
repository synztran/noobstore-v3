import { IOption } from '@/interface';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface Actions {
  updateOptSelected: (payload: IOption) => void;
  updateQuantity: (payload: number) => void;
  updateQuantityBasedOnProduct: (payload: string) => void;
}

interface InitialProductDetailState {
  optSelected: IOption | null;
  currentQuantity: number;
}

type ProductDetailState =  InitialProductDetailState & { actions: Actions}

const InitialState = {
  optSelected: null,
  currentQuantity: 1
}

const useStoreProductDetail = create<ProductDetailState>()(
  devtools((set, get) => ({
    ...InitialState,
    actions: {
      updateOptSelected: (payload) => {
        set({
          optSelected: payload
        })
      },
      updateQuantity: (payload) => {
        set({
          currentQuantity: payload
        })
      },
      updateQuantityBasedOnProduct: (payload) => {
        // 
      }
    }
  }))
)

export const useStoreProductDetailAction = () => useStoreProductDetail((state) => state.actions);

export default useStoreProductDetail;