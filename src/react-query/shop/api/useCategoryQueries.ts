import { ICategoryListResult } from '@/react-query/router/category'
import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query'
import { queryPresets } from 'react-query/configs'
import { appQueryKeys } from 'react-query/root'

type TQueryOptions = {
  enabled?: boolean | (() => boolean)
} & Partial<(typeof queryPresets)[keyof typeof queryPresets]> &
  Partial<UseQueryOptions<ICategoryListResult, Error>>

export default function useCategoryQuery(params: Parameters<typeof appQueryKeys.category.getAll>[0], queryOptions?: TQueryOptions): UseQueryResult<ICategoryListResult, Error> {
  const enabled = queryOptions?.enabled ?? true
  const queryConfig = {
    ...appQueryKeys.category.getAll(params),
    ...queryPresets.temporary,
    ...queryOptions,
    enabled,
  }
  const query = useQuery(queryConfig)

  return query
}
