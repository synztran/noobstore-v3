import { getData, getFirst, isValid } from '@/client'
import OrderClient from '@/client/OrderClient'
import { IMyOrderParams, IOrdered } from '@/interface/Client/Order'
import { createQueryKeys } from '@lukemorales/query-key-factory'

export const orderQueryKeys = createQueryKeys('order', {
  getOrderDetail: (orderId: string) => ({
    queryKey: [{ orderId }],
    async queryFn(): Promise<IOrdered | {}> {
      const response = await OrderClient.getOrderDetail(orderId)
      if (!isValid(response)) {
        return {}
      }
      return getFirst(response) || {}
    },
  }),
  getMyOrders: (params?: IMyOrderParams) => ({
    queryKey: [{ params }],
    async queryFn(): Promise<IOrdered[]> {
      const response = await OrderClient.getMyOrders(params || {})
      if (!isValid(response)) {
        return []
      }
      return getData(response) || []
    },
  }),
})
