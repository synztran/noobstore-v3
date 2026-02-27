import { GET } from '@/client/index'
import { ORDER_API } from '@/constants/APIUri'
import { IResponse } from '@/interface/Client/interface'
import { IMyOrderParams, IOrdered } from '@/interface/Client/Order'

const getMyOrders = async ({ skip = 0, limit = 50, signal }: IMyOrderParams): Promise<IResponse<IOrdered>> => {
  const url = ORDER_API.MY_ORDERS
  const params = {
    skip,
    limit,
  }
  return GET({ url, params, isAuth: true, signal })
}

const getOrderDetail = async (orderId: string): Promise<IResponse<IOrdered>> => {
  const url = ORDER_API.ORDER_DETAIL
  const params = {
    orderId,
  }
  return GET({ url, params, isAuth: true })
}

export default {
  getMyOrders,
  getOrderDetail,
}
