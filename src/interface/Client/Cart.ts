import { IProductOption } from '../interface'

export interface IRemoveCartItem {
  cartId: string
  productId: string
  productOptionId?: string
}

export interface IUpdateCartProductQuantity {
  cartId: string
  productId: string
  quantity: number
  productOptionId?: string
}

export interface ICartProduct {
  type: string
  productId: string
  productName: string
  sellerName: string
  quantity: number
  price: number
  cartId: string
  categoryId: string
  categoryName: string
  thumbnail: {
    path: string
    alt: string
  }
  slug: string
  total: number
  productOptions: IProductOption[]
  totalPrice: number
  isBuyGroup?: boolean
}

export interface ICartService {
  type: string
  serviceId: string
  quantity: number
  price: number
  total: number
  options: unknown
}

export interface ICartFees {
  shipping: number
  tax: number
  handling: number
  voucherCode: string
  voucherDiscount: number
}

export interface ICart {
  customerId: number
  cartId: string
  products: ICartProduct[]
  services: ICartService[]
  usedProducts: unknown[]
  fees: ICartFees
  totalPrice: number
  updatedAt: string
  totalProductQuantity: number
}
