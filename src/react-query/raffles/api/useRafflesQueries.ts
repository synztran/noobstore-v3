import { IRaffleListParams } from '@/client/RaffleClient'
import { IPaginatedRafflesResponse } from '@/interface/Client/Raffle'
import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query'
import { queryPresets } from 'react-query/configs'
import { appQueryKeys } from 'react-query/root'

type IQueryOptions = {
  params?: IRaffleListParams
  enabled?: boolean | (() => boolean)
} & Partial<(typeof queryPresets)[keyof typeof queryPresets]> &
  Partial<UseQueryOptions<IPaginatedRafflesResponse, Error>>

export default function useRafflesQuery(queryOptions?: IQueryOptions): UseQueryResult<IPaginatedRafflesResponse, Error> {
  const enabled = queryOptions?.enabled ?? true
  const queryConfig = {
    ...appQueryKeys.raffle.getRaffles(queryOptions?.params),
    ...queryPresets.temporary,
    ...queryOptions,
    enabled,
  }

  const rafflesQuery = useQuery(queryConfig)
  return rafflesQuery
}
