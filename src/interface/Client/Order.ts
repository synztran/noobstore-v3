import { EnumOrderDeliveryMethod, EnumOrderStatus, EnumPaymentMethod, EnumPaymentStatus, IProductOption } from '../interface'
import { ICart, ICartFees } from './Cart'

export interface IOrdered {
  orderInfo: IOrderInfo
  cart: ICart
  orderId?: string
  totalPrice?: number
  orderedAt?: string
  totalQuantity?: number
  paymentStatus?: EnumPaymentStatus
  orderStatus?: EnumOrderStatus
  customerId?: number
  products?: IOrderProduct[]
  services?: any[]
  usedProducts?: unknown[]
  fees?: ICartFees
  paymentMethod: EnumPaymentMethod
  deliveryMethod: EnumOrderDeliveryMethod
  transitionId?: string[]
  updatedAt?: string
}

interface IOrderInfo {
  country: string
  firstName: string
  lastName: string
  company?: string
  address: string
  apartment?: string
  city: string
  province: string
  postCode: string
  phoneNumber: string
  // deliveryMethod: string
  // paymentMethod: EnumPaymentMethod
  billingAddress?: string | Record<string, any>
  note?: string
}

export interface IOrder {
  cartId: string
  customerId: number
  fees: ICartFees
  orderId: string
  orderedAt: string
  products: IOrderProduct[]
  services: any[]
  totalPrice: number
  totalQuantity: number
  orderInfo: {
    paymentMethod: EnumPaymentMethod
    deliverMethod: string
    billingAddress: string
  }
}

export interface IOrderProduct {
  type: string
  productId: string
  productName: string
  sellerName: string
  quantity: number
  price: number
  categoryId: string
  categoryName: string
  thumbnail: {
    path: string
    alt: string
  }
  slug: string
  productOptions: IProductOption[]
  totalPrice: number
}

export interface IMyOrderParams {
  skip?: number
  limit?: number
  signal?: AbortSignal
}
