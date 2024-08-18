import { useAuth } from "@/context/Auth";
import useQueryData from "@/hook/useQueries";
import debounce300 from "@/utils/Debounce";
import NotifyUtils from "@/utils/NotifyUtils";
import useCart, { useCartAction } from "@/zustand/useCart";
import { useStoreProductDetailAction } from "@/zustand/useProductDetail";
import { Button, Input } from "@material-ui/core";
import { memo, useCallback, useEffect, useState } from "react";


interface Props {
  triggerResetQuantity?: number
  quantity?:number
  productId?: string
}

const InputQuantity = ({triggerResetQuantity, quantity, productId}:Props) => {
  const { updateQuantity } = useStoreProductDetailAction();
  const [currentQuantity, setCurrentQuantity] = useState(quantity || 1)
  const { updateProductCartQuantity } = useCartAction();
  const { cartQuery } = useQueryData()
  const { user }: any = useAuth();
  const { cart }:any = useCart();

  const handleDecreaseQuantity = async (e:React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    if (currentQuantity <= 1) return
    setCurrentQuantity(currentQuantity - 1)
    updateQuantity(currentQuantity - 1)
  }

  const handleDecreaseQuantityCart = async () => {
    if (currentQuantity <= 1) return
    if (productId) {
      const respUpdateQuantity = await updateProductCartQuantity({
        productId,
        quantity: quantity as number - 1,
        cartId: user?.cartId
      })
      if (respUpdateQuantity?.status === 'OK') {
        setCurrentQuantity(currentQuantity - 1)
        cartQuery.refetch()
        NotifyUtils.success('Cập nhật số lượng thành công')
      } else {
        NotifyUtils.error("Có lỗi xảy ra. Vui lòng thử lại")
      }
    }
  }

  const handleIncreaseQuantity = async (e:React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setCurrentQuantity(currentQuantity + 1)
    updateQuantity(currentQuantity + 1)
  }

  const handleIncreaseQuantityCart = useCallback(async () => {
    if (productId) {
      const respUpdateQuantity = await updateProductCartQuantity({
        productId,
        quantity: quantity as number + 1,
        cartId: user?.cartId
      })
      if (respUpdateQuantity?.status === 'OK') {
        setCurrentQuantity(quantity as number)
        cartQuery.refetch()
        NotifyUtils.success('Cập nhật số lượng thành công')
      } else {
        NotifyUtils.error("Có lỗi xảy ra. Vui lòng thử lại")
      }
    }
  }, [quantity, productId])

  const debouncedIncreaseQuantityCart = useCallback(debounce300(handleIncreaseQuantityCart, 300), [handleIncreaseQuantityCart]);
  const debounceDecreaseQuantityCart = useCallback(debounce300(handleDecreaseQuantityCart, 300), [handleDecreaseQuantityCart]);

  useEffect(() => {
    setCurrentQuantity(1)
    updateQuantity(1)
  }, [triggerResetQuantity])

  useEffect(() => {
    if (quantity) setCurrentQuantity(quantity)
  }, [quantity, cart])

  return (
    <div className="flex align-middle items-centers mt-4">
      <MinusButton handleDecreaseQuantity={(e) => {
        productId ? debounceDecreaseQuantityCart() : handleDecreaseQuantity(e)
      }} isDisabled={currentQuantity <= 0} />
      <ProductQuantity quantity={currentQuantity} />
      <AddMoreButton handleIncreaseQuantity={(e) => {
        productId ? debouncedIncreaseQuantityCart() : handleIncreaseQuantity(e)
      }} isDisabled={currentQuantity >= 99} />
    </div>
  )
}

export default InputQuantity;

const MinusButton = ({handleDecreaseQuantity, isDisabled = false}: {handleDecreaseQuantity: (e:React.MouseEvent<HTMLElement>) => void, isDisabled: boolean}) => {
  return (
    <Button className="w-8 min-w-4 border border-r-0 border-1 border-solid border-gray-400 rounded-none" onClick={handleDecreaseQuantity} disabled={isDisabled}>
      -
    </Button>
  )
}

const ProductQuantity = memo(({quantity}: {quantity: number}) => {
  return (
    <Input 
      type="text"
      classes={
        {
          root: 'w-16 border border-1 border-solid border-gray-400 border-l-0 border-r-0 bg-transparent',
          input: 'px-0 text-center bg-transparent',
          focused: '',
        }
      }
      disableUnderline
      placeholder="0"
      value={quantity}
      defaultValue={0}
      disabled
      endAdornment={null}
    />
  )
})

const AddMoreButton = ({handleIncreaseQuantity, isDisabled = false}: {handleIncreaseQuantity: (e: React.MouseEvent<HTMLElement>) => void, isDisabled: boolean}) => {
  return (
    <Button className="w-8 min-w-4  border border-l-0 border-1 border-solid border-gray-400 rounded-none" onClick={handleIncreaseQuantity} disabled={isDisabled}>
      +
    </Button>
  )
}

