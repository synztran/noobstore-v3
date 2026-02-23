import { getData, getFirst, isValid } from '@/client'
import RaffleClient, { IRaffleListParams } from '@/client/RaffleClient'
import { createQueryKeys } from '@lukemorales/query-key-factory'
import { IPaginatedRafflesResponse } from '@/interface/Client/Raffle'

export const raffleQueryKeys = createQueryKeys('raffle', {
  getDetailRaffle: (params?: { raffleId: string }) => ({
    queryKey: [{ params }],
    async queryFn() {
      const resp = await RaffleClient.getDetailRaffle(params)
      if (!isValid(resp)) return null
      return getFirst(resp)
    },
  }),
  getRaffles: (params?: IRaffleListParams) => ({
    queryKey: [{ params }],
    async queryFn(): Promise<IPaginatedRafflesResponse> {
      const resp = await RaffleClient.getRaffles(params)
      if (!isValid(resp)) {
        return {
          data: [],
          pagination: { page: 1, total: 0, totalPage: 0 },
        }
      }
      return {
        data: getData(resp) || [],
        pagination: resp.pagination || { page: 1, total: 0, totalPage: 0 },
      }
    },
  }),
})
