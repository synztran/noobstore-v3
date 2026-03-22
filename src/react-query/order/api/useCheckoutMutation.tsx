import CheckoutClient from '@/client/CheckoutClient'
import { IResponse } from '@/interface/Client/interface'
import { IPayloadCheckout } from '@/interface/Client/Order'
import NotifyUtils from '@/utils/NotifyUtils'
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query'
import { appQueryKeys } from 'react-query/root'

interface IVariable {
  payload?: IPayloadCheckout
}

export function useCheckoutMutation(mutationOptions: UseMutationOptions<unknown, Error, IVariable> = {}) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (variables) => {
      if (!variables.payload) throw new Error('Missing payload')
      const resp = await CheckoutClient.postCheckout(variables.payload)
      return resp
    },
    onError: (_) => {
      NotifyUtils.error('Có lỗi xảy ra. Vui lòng thử lại sau')
    },
    onSuccess: (resp: IResponse<any>, variables: IVariable) => {
      console.log(variables)
      if (resp.status !== 'OK') return
      NotifyUtils.success('Đặt hàng thành công !')
      queryClient.invalidateQueries({
        queryKey: ['order', 'getMyOrders'],
      })
      queryClient.invalidateQueries({
        queryKey: appQueryKeys.cart.cartData.queryKey,
      })
    },
    ...mutationOptions,
  })
}
