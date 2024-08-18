import { getFirst } from '@/client';
import CartClient from '@/client/CartClient';
import NotifyUtils from '@/utils/NotifyUtils';
import { useCartAction } from '@/zustand/useCart';
import {
  useQuery,
} from '@tanstack/react-query';

const useQueries = () => {
  const { setIniting, setData } = useCartAction(); 
  const cartQuery = useQuery({
    queryKey: ['cartData'],
    queryFn: async () => {
      setIniting(true)
      const response = await CartClient.getCart()
      console.log("responseresponse", response)
      if (response.status === 'OK') {
        console.log("getFirst(response)", getFirst(response))
        setData(getFirst(response))
      } else {
        NotifyUtils.error(response.message || "Error")
      }
      setIniting(false)
      return getFirst(response)
    },
  })

  return {
    cartQuery
  }
}

export default useQueries;