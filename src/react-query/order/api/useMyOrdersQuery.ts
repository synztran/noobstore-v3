import { IMyOrderParams, IOrdered } from '@/interface/Client/Order'
import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query'
import { queryPresets } from 'react-query/configs'
import { appQueryKeys } from 'react-query/root'

type IQueryOptions = {
  params?: IMyOrderParams
  enabled?: boolean | (() => boolean)
} & Partial<(typeof queryPresets)[keyof typeof queryPresets]> &
  Partial<UseQueryOptions<IOrdered[], Error>>

export default function useMyOrdersQuery(queryOptions?: IQueryOptions): UseQueryResult<IOrdered[], Error> {
  const enabled = queryOptions?.enabled ?? true
  const queryConfig = {
    ...appQueryKeys.order.getMyOrders(queryOptions?.params),
    ...queryPresets.temporary,
    ...queryOptions,
    enabled,
  }

  const ordersQuery = useQuery(queryConfig)

  return ordersQuery
}
