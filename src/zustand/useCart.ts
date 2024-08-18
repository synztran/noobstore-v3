import { getFirst } from '@/client';
import CartClient from '@/client/CartClient';
import { ICartFee } from '@/interface';
import NotifyUtils from '@/utils/NotifyUtils';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface IRespAddToCart {
  code: number
  message: string
  status: string
  data: any
}

interface IResponseUpdateQuantity {
  code: number
  message: string
  status: string
  data?: any 
}

interface Actions {
  // fetchCartData: () => void
  addToCart: (payload: any) => Promise<IRespAddToCart>
  removeItemCart: (payload: {
    cartId: string
    productId: string
  }) => void
  updateProductCartQuantity: (payload: {
    cartId: string
    productId: string
    quantity: number
  }) => Promise<IResponseUpdateQuantity>
  setIniting: (isFetching: boolean) => void
  setData: (payload: any) => void
}

interface InitialCartState {
  cart: {
    cartId: string
    fees: ICartFee
    products: any[]
    services: any[]
    totalPrice: number
    totalProductQuantity: number
    updatedAt: string
  };
  isIniting: boolean

}

type CartState =  InitialCartState & { actions: Actions}

const InitialState = {
  cart: {
    cartId: '',
    fees: {
      shipping: 0,
      tax: 0,
      handling: 0,
      voucherCode: "",
      voucherDiscount: 0,
    },
    products: [],
    services: [],
    totalPrice: 0,
    totalProductQuantity: 0,
    updatedAt: ''
  },
  isIniting: true
}


const useCart = create<CartState>()(
  devtools((set, get) => ({
    ...InitialState,
    actions: {
      // fetchCartData: async() => {
      //   try {
      //     const { setIniting } = get().actions
      //     const cartResp = await CartClient.getCart();
      //     if (cartResp.status === 'OK') {
      //       set({
      //         cart: getFirst(cartResp)
      //       })
      //     } else {
      //       NotifyUtils.error(cartResp.message)
      //     }
      //     setIniting(false)
      //   }catch(err) {
      //     NotifyUtils.error(err.message)
      //   }
      // },
      addToCart: async (payload) => {
        try {
          const respUpdateCart = await CartClient.updateCart(payload);
          return respUpdateCart;
        } catch (err) {
          NotifyUtils.error(err.message);
        }
      },
      removeItemCart: async (payload) => {
        try {
          const respRemoveItem = await CartClient.removeItemCart(payload);
          if (respRemoveItem.status === 'OK') {
            set({
              cart: getFirst(respRemoveItem)
            })
          } else {
            NotifyUtils.error(respRemoveItem.message)
          }
        } catch (err) {
          NotifyUtils.error(err.message)
        }
      },
      updateProductCartQuantity: async(payload) => {
         try {
          const respUpdateCart: IResponseUpdateQuantity = await CartClient.updateCartProductQuantity(payload);
          if (respUpdateCart.status === 'OK') {
            set({
              cart: getFirst(respUpdateCart)
            })
            return respUpdateCart
          } else {
            return respUpdateCart
          }
         } catch(err) {
          NotifyUtils.error(err.message)
          return {
            code: 500,
            message: err.message,
            status: 'ERROR',
          }
         }
      },
      setIniting: (isIniting) => {
        set((state) => ({
          ...state,
          isIniting
        })) 
      },
      setData: (payload) => {
        set((state) => ({
          ...state,
          cart: payload
        }))
      }
    }
  }))
)

export const useCartAction = () => useCart((state) => state.actions);

export default useCart;