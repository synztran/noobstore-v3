import { NEW_MISSING_IMAGE } from '@/constants/Images'
import { IOrderProduct } from '@/interface/Client/Order'
import { IProductOption } from '@/interface/interface'
import { formatCurrency } from '@/utils/FormatNumber'
import Image from 'next/legacy/image'
import React from 'react'

interface OrderProductItemProps {
  product: IOrderProduct
}

interface ProductOptionItemProps {
  product: IOrderProduct
  productOption: IProductOption
}

const ProductOptionItem: React.FC<ProductOptionItemProps> = ({ product, productOption }) => {
  const totalPrice = (product.price || 0) + (productOption.price || 0)

  return (
    <div className="flex gap-4 w-full">
      <div className="size-24 shrink-0 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
        <Image src={productOption?.thumbnail?.path || NEW_MISSING_IMAGE} alt={productOption?.name} layout="fill" objectFit="cover" />
      </div>
      <div className="flex flex-col w-full">
        <div className="font-semibold text-slate-900 dark:text-white text-lg line-clamp-2">{product.productName}</div>
        <p className="text-sm text-slate-500 dark:text-slate-400">{productOption.name}</p>
        <div className="flex items-center justify-between gap-4 mt-auto">
          <span className="text-sm font-bold text-slate-900 dark:text-white">{formatCurrency(totalPrice)}</span>
          <span className="text-xs text-slate-400">SL: {product.quantity}</span>
        </div>
      </div>
    </div>
  )
}

const OrderProductItem: React.FC<OrderProductItemProps> = ({ product }) => {
  const productOptions = product.productOptions || []

  return (
    <div className="flex gap-4 p-3 rounded-xl border border-slate-100 dark:border-slate-800/50 hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group">
      {productOptions.map((option) => (
        <ProductOptionItem key={option.name} product={product} productOption={option} />
      ))}
    </div>
  )
}

export default OrderProductItem
