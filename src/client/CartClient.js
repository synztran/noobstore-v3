import { GET, PUT } from '@/client/index';
import { CART_API } from '@/constants/APIUri';

const updateCart = async (cart) => {
  const url = CART_API.UPDATE_CART;

  return PUT({ url, body: cart, isAuth: true})
}

const getCart = async () => {
  const url = CART_API.GET_CART;
  return GET({ url, isAuth: true});
}

const removeItemCart = async (payload) => {
  const url = CART_API.REMOVE_ITEM_CART;
  const body = {
    cartId: payload.cartId,
    productId: payload.productId,
  }

  return PUT({ url, body, isAuth: true})
}

const updateCartProductQuantity = async (payload) => {
  const url = CART_API.UPDATE_CART_PRODUCT
  const body =  {
    cartId: payload.cartId,
    productId: payload.productId,
    quantity: payload.quantity,
  }

  return PUT({ url, body, isAuth: true})
}

export default {
  updateCart,
  getCart,
  removeItemCart,
  updateCartProductQuantity
}