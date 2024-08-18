import { GET, POST } from '@/client/index';
import { CHECKOUT_API } from '@/constants/APIUri';

const postCheckout = async (data) => {
  const url = CHECKOUT_API.CHECKOUT;
  const body = {
    ...data
  }
  return POST({url, body, isAuth: true});
}

const getOrderDetail = async (orderId) => {
  const url = CHECKOUT_API.ORDER_DETAIL
  const params = {
    orderId
  }
  return GET({url, params, isAuth: true});
}

export default {
  postCheckout,
  getOrderDetail
}