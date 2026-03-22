import UserClient from '@/client/UserClient'
import { IResponse } from '@/interface/Client/interface'
import { TPayloadSubmitOrderPayment } from '@/interface/Context/auth'
import { appQueryKeys } from '@/react-query/root'
import NotifyUtils from '@/utils/NotifyUtils'
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query'

interface IVariable {
  payload?: TPayloadSubmitOrderPayment
}

export function useSubmitOrderPaymentMutation(mutationOptions: UseMutationOptions<unknown, Error, IVariable> = {}) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (variables) => {
      if (!variables.payload) throw new Error('Missing payload')
      const resp = await UserClient.putSubmitOrderPayment(variables.payload)
      return resp
    },
    onError: (_) => {
      NotifyUtils.error('Có lỗi xảy ra. Không thể gửi thanh toán đơn hàng')
    },
    onSuccess: (resp: IResponse<any>, variables: IVariable) => {
      if (resp.status !== 'OK') return
      NotifyUtils.success('Gửi thanh toán đơn hàng thành công')
      // Invalidate raffle list query to refetch updated data
      queryClient.invalidateQueries({
        queryKey: ['order', 'getMyOrders', appQueryKeys.order.getOrderDetail],
      })
    },
    ...mutationOptions,
  })
}
