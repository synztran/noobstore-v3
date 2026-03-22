import OrderProductItem from '@/components/account/OrderDetailModal/OrderProductItem'
import PaymentStatusCard from '@/components/account/PaymentStatusCard'
import { IOrdered } from '@/interface/Client/Order'
import { EnumPaymentStatus } from '@/interface/interface'
import dayjs from 'dayjs'
import { Download, Eye, MessageSquare, Phone, Receipt } from 'lucide-react'
import React from 'react'

interface OrderDetailLeftPanelProps {
  order: IOrdered
}

const formatOrderDate = (date?: string, format = 'DD/MM/YYYY, HH:mm') => {
  if (!date) return 'N/A'
  return dayjs(date).format(format)
}

const OrderDetailLeftPanel: React.FC<OrderDetailLeftPanelProps> = ({ order }) => {
  const orderInfo = order.orderInfo
  const address = orderInfo ? [orderInfo.address, orderInfo.apartment, orderInfo.city, orderInfo.province, orderInfo.country].filter(Boolean).join(', ') : 'Chưa có thông tin địa chỉ'
  const isPaid = order.paymentStatus === EnumPaymentStatus.PAID
  const productCount = order.products?.length || 0

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-10 bg-white dark:bg-[#261814]">
      <div className="flex flex-col h-full">
        <div className="mb-8 flex flex-wrap justify-between items-start gap-4">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3 flex-wrap">
              Đơn hàng #{order.orderId || 'N/A'}
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${isPaid ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' : 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'}`}
              >
                {isPaid ? 'Đã thanh toán' : 'Chờ thanh toán'}
              </span>
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">{productCount} sản phẩm</span>
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Đặt ngày {formatOrderDate(order.orderedAt)}</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-medium transition-colors">
            <MessageSquare className="size-4" />
            Liên hệ hỗ trợ
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {order.products?.map((product, index) => (
            <OrderProductItem key={product.productId || index} product={product} />
          ))}
        </div>

        <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800/50 h-fit">
                <div className="text-base font-bold tracking-wider text-slate-400 mb-2 flex items-center gap-2">Địa chỉ giao hàng</div>
                <address className="not-italic text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  <span className="block font-semibold text-slate-900 dark:text-white text-sm mb-1">
                    {orderInfo?.firstName} {orderInfo?.lastName}
                  </span>
                  {address}
                  {orderInfo?.phoneNumber && (
                    <span className="mt-3 text-slate-500 flex items-center gap-2">
                      <Phone className="size-4" />
                      {orderInfo.phoneNumber}
                    </span>
                  )}
                </address>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800/50 h-fit flex flex-col">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">Hoá đơn</div>
                <div className="flex-1 flex flex-col">
                  <div className="bg-white dark:bg-slate-700/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 dark:bg-primary/20 p-2.5 rounded-lg text-primary">
                        <Receipt className="size-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">INV-{order.orderId || 'N/A'}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">PDF • Hoá đơn điện tử</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 text-slate-400 hover:text-primary dark:text-slate-500 dark:hover:text-primary transition-colors hover:bg-primary/5 rounded-lg" title="Xem">
                        <Eye className="size-5" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-primary dark:text-slate-500 dark:hover:text-primary transition-colors hover:bg-primary/5 rounded-lg" title="Tải xuống">
                        <Download className="size-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <PaymentStatusCard
              paymentInfo={{
                paymentStatus: order.paymentStatus,
                paymentMethod: order.paymentMethod,
                orderId: order.orderId,
                orderedAt: order.orderedAt,
                paymentConfirmedAt: order.paymentConfirmedAt,
                updatedAt: order.updatedAt,
                verifiedBy: order.verifiedBy,
                orderStatus: order.orderStatus,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetailLeftPanel
