import { RAFFLE_API } from '@/constants/APIUri'
import { IResponse } from '@/interface/Client/interface'
import { IBEResponseRaffleInfo, IPayloadSubmitRafflePayment, IRequestRaffleCreation } from '@/interface/Client/Raffle'
import { GET, POST } from '.'

const getDetailRaffle = async (params?: { raffleId: string; participantEmail?: string }): Promise<IResponse<IBEResponseRaffleInfo>> => {
  const url = RAFFLE_API.GET_RAFFLES
  return GET({
    url,
    isAuth: true,
    params,
  })
}

export interface IRaffleListParams {
  featuredOnly?: boolean
  page?: number
  limit?: number
  search?: string
  sortBy?: string
}

const getRaffles = async (params?: IRaffleListParams): Promise<IResponse<IBEResponseRaffleInfo>> => {
  const url = RAFFLE_API.GET_RAFFLES
  return GET({ url, params, isAuth: true })
}

const postRaffleJoin = async (payload: any) => {
  const url = RAFFLE_API.POST_RAFFLE_JOIN
  return POST({ url, body: payload, isAuth: true })
}

const postRaffleSubmitSecretKey = async (payload: { secretKey: string; raffleId: string }) => {
  const url = RAFFLE_API.POST_RAFFLE_SUBMIT_SECRET_KEY
  return POST({ url, body: payload, isAuth: true })
}

const postRaffleSubmitPayment = async (payload: IPayloadSubmitRafflePayment) => {
  const url = RAFFLE_API.POST_RAFFLE_SUBMIT_PAYMENT
  return POST({ url, body: payload, isAuth: true })
}

const postRaffleCreation = async (payload: IRequestRaffleCreation) => {
  const url = RAFFLE_API.POST_RAFFLE_CREATE
  return POST({ url, body: payload, isAuth: true })
}

const getSingleRaffle = async (params: { raffleId: string }): Promise<IResponse<IBEResponseRaffleInfo>> => {
  const url = RAFFLE_API.GET_RAFFLE_DETAIL
  return GET({ url, isAuth: false, params })
}

export default {
  getDetailRaffle,
  getRaffles,
  postRaffleJoin,
  postRaffleSubmitSecretKey,
  postRaffleSubmitPayment,
  postRaffleCreation,
  getSingleRaffle,
}
