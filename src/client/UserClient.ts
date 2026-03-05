import { ACCOUNT_API } from '@/constants/APIUri'
import { IResponse } from '@/interface/Client/interface'
import { IAuthUser, IRequestShippingAddress, TPayloadSubmitOrderPayment, TResponseRaffleEntry } from '@/interface/Context/auth'
import { GET, PUT } from './index'

const getCurrentUser = async (ctx?: unknown): Promise<IResponse<IAuthUser>> => {
  const url = ACCOUNT_API.CURRENT_ACCOUNT
  return GET({ ctx, url })
}

const postNewUserShippingAddress = async (payload: IRequestShippingAddress): Promise<IResponse<void>> => {
  const url = ACCOUNT_API.POST_NEW_USER_SHIPPING_ADDRESS
  return GET({ url, body: payload })
}

const getRaffleEntries = async (ctx?: unknown): Promise<IResponse<TResponseRaffleEntry>> => {
  const url = ACCOUNT_API.GET_RAFFLE_ENTRIES
  return GET({ ctx, url, isAuth: true })
}

const putSubmitOrderPayment = async (payload: TPayloadSubmitOrderPayment): Promise<IResponse<void>> => {
  const url = ACCOUNT_API.PUT_SUBMIT_ORDER_PAYMENT
  return PUT({ url, body: payload, isAuth: true })
}

export default {
  getCurrentUser,
  postNewUserShippingAddress,
  getRaffleEntries,
  putSubmitOrderPayment,
}
