import { GET, POST } from '@/client/index'
import { CHECKOUT_API } from '@/constants/APIUri'
import { IDataPostCheckout } from '@/interface/Client/Checkout'
import { IResponse } from '@/interface/Client/interface'
import { IOrder, IOrdered } from '@/interface/Client/Order'

const postCheckout = async (data: IDataPostCheckout): Promise<IResponse<IOrder>> => {
  const url = CHECKOUT_API.CHECKOUT
  const body = {
    ...data,
  }
  return POST({ url, body, isAuth: true })
}

export default {
  postCheckout,
}
