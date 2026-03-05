import { NEW_MISSING_IMAGE, QUICK_ACCESS_KEYCAPS_ICON, QUICK_ACCESS_LUBRICANT_ICON, SERVICE_KEYBOARD_ICON, SERVICE_NEW_SWITCH_ICON } from '@/constants/Images'
import { ICart, ICartProduct } from '@/interface/Client/Cart'
import useCartQuery from '@/react-query/cart/api/useCartQueries'
import { useRemoveItemMutation } from '@/react-query/cart/api/useRemoveItemMutation'
import { formatCurrency } from '@/utils/FormatNumber'
import NotifyUtils from '@/utils/NotifyUtils'
import { CircularProgress } from '@mui/material'
import { Lock, Plus, ShoppingBag, ShoppingCart, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import InputQuantity from '../InputQuatity'
import { Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from '../ReUIComponent'

interface Props {
  open: boolean
  handleClose: () => void
}

const quickAccess = [
  { icon: SERVICE_KEYBOARD_ICON, title: 'Bàn phím', url: '/products/keyboards' },
  { icon: SERVICE_NEW_SWITCH_ICON, title: 'Switches', url: '/products/switches' },
  { icon: QUICK_ACCESS_KEYCAPS_ICON, title: 'Keycaps', url: '/products/keycaps' },
  { icon: QUICK_ACCESS_LUBRICANT_ICON, title: 'Dầu lube', url: '/products/lubricant' },
]

const ModalCartItem = ({ open, handleClose }: Props) => {
  const { data: cart } = useCartQuery()
  console.log('Cart data:', cart)
  const router = useRouter()
  const handleRemoveProduct = useRemoveItemMutation()
  const [isRemoving, setRemoving] = useState(false)

  const handleRemoveItemCart = async (productId: string, productName: string) => {
    if (!cart?.cartId) return NotifyUtils.error('Giỏ hàng không tồn tại')
    setRemoving(true)
    handleRemoveProduct.mutate({
      payload: { cartId: cart?.cartId as string, productId, productName },
    })
    setRemoving(false)
  }

  const handleCheckout = () => {
    handleClose()
    router.push('/checkout')
  }

  const hasProducts = cart?.products && cart.products.length > 0

  return (
    <Drawer open={open} onOpenChange={(isOpen: boolean) => !isOpen && handleClose()} direction="right">
      <DrawerContent size="sm" showCloseButton>
        {/* Header */}
        <DrawerHeader className="flex-row items-center gap-3">
          <ShoppingBag className="w-6 h-6 text-primary" />
          <DrawerTitle>Giỏ hàng</DrawerTitle>
        </DrawerHeader>

        {/* Content */}
        {hasProducts ? (
          <>
            {/* Cart Items List */}
            <DrawerBody className="space-y-6">
              {cart?.products.map((item: ICartProduct, index: number) => (
                <CartItem key={item.productId || index} item={item} cart={cart} handleRemoveItemCart={handleRemoveItemCart} isRemoving={isRemoving} />
              ))}
            </DrawerBody>

            {/* Footer / Summary */}
            <DrawerFooter className="bg-slate-50/50">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-slate-500">
                  <span className="text-sm">Tạm tính</span>
                  <span className="text-sm font-medium">{formatCurrency(cart?.totalPrice || 0)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span className="text-sm">Phí vận chuyển</span>
                  <span className="text-sm font-medium">Tính khi thanh toán</span>
                </div>
                <div className="flex justify-between text-slate-900 pt-2 border-t border-slate-200">
                  <span className="text-base font-bold">Tổng cộng</span>
                  <span className="text-xl font-bold">{formatCurrency(cart?.totalPrice || 0)}</span>
                </div>
              </div>
              <button onClick={handleCheckout} className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                <Lock className="w-5 h-5" />
                Thanh toán ngay
              </button>
              <button onClick={handleClose} className="w-full text-slate-600 py-2 text-sm font-semibold hover:text-primary transition-colors underline underline-offset-4">
                Tiếp tục mua sắm
              </button>
              <p className="text-xs text-slate-500 text-center">Miễn phí vận chuyển nội thành HCM cho đơn từ {formatCurrency(3000000)}</p>
            </DrawerFooter>
          </>
        ) : (
          /* Empty Cart State */
          <DrawerBody>
            <div className="h-full flex flex-col items-center text-center py-16 px-4">
              <div className="size-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                <ShoppingCart className="w-12 h-12 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Giỏ hàng trống</h3>
              <p className="text-slate-500 mb-8 max-w-60">Chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá các sản phẩm của chúng tôi!</p>
              <Link href="/products" onClick={handleClose} className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Khám phá sản phẩm
              </Link>

              {/* Quick Access / Recommended */}
              <div className="w-full mt-10 text-left">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Gợi ý cho bạn</h4>
                <div className="space-y-3">
                  {quickAccess.map((item) => (
                    <Link key={item.title} href={item.url} onClick={handleClose} className="flex items-center gap-3 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors group cursor-pointer">
                      <div className="size-12 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden">
                        <Image src={item.icon} alt={item.title} width={32} height={32} className="object-contain" />
                      </div>
                      <div className="flex-1">
                        <h5 className="text-sm font-semibold text-slate-800">{item.title}</h5>
                      </div>
                      <div className="p-1.5 rounded-full bg-slate-100 text-slate-400 group-hover:bg-primary group-hover:text-white transition-all">
                        <Plus className="w-4 h-4" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </DrawerBody>
        )}
      </DrawerContent>
    </Drawer>
  )
}

export default ModalCartItem

// Cart Item Component
interface CartItemProps {
  item: ICartProduct
  cart: ICart
  isRemoving: boolean
  handleRemoveItemCart: (productId: string, productName: string) => void
}

const CartItem = ({ item, isRemoving, handleRemoveItemCart }: CartItemProps) => {
  if (!item?.productOptions?.length) return null

  const firstOption = item.productOptions[0]
  const totalOptionPrice = item.productOptions.reduce((acc, opt) => acc + (opt.price || 0), 0)
  const itemPrice = (item.price + totalOptionPrice) * item.quantity

  return (
    <div className="flex gap-4 group">
      {/* Product Image */}
      <div className="size-24 shrink-0 rounded-xl overflow-hidden border border-slate-100 bg-slate-50">
        <div className="relative w-full h-full">
          <Image src={firstOption?.thumbnail?.path || NEW_MISSING_IMAGE} alt={firstOption?.thumbnail?.alt || item.productName} fill className="object-cover" />
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div>
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-semibold text-slate-900 leading-tight truncate">{item.categoryName || item.productName}</h3>
            <p className="font-bold text-slate-900 shrink-0">{formatCurrency(itemPrice)}</p>
          </div>
          <p className="text-sm text-slate-500 mt-1 truncate">
            {item.productName}: {firstOption?.name}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-2">
          <InputQuantity quantity={item?.quantity} productId={item?.productId} productOptionId={firstOption?.productOptionId || ''} isBuyGroup={item.isBuyGroup} />
          <button onClick={() => handleRemoveItemCart(item.productId, item.productName)} disabled={isRemoving} className="text-xs font-semibold text-red-500 hover:text-red-600 flex items-center gap-1 uppercase tracking-wider transition-colors disabled:opacity-50">
            {isRemoving ? <CircularProgress size={12} /> : <Trash2 className="w-4 h-4" />}
            Xóa
          </button>
        </div>
      </div>
    </div>
  )
}
