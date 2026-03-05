'use client'

import { Dialog, DialogBody, DialogContent, DialogDescription, DialogHeader, DialogTitle, Timeline, TimelineConnector, TimelineContent, TimelineDescription, TimelineIndicator, TimelineItem, TimelineTitle } from '@/components/ReUIComponent'
import { NEW_MISSING_IMAGE } from '@/constants/Images'
import { IOrdered, IOrderProduct } from '@/interface/Client/Order'
import { EnumOrderStatus, EnumPaymentStatus } from '@/interface/interface'
import { formatCurrency } from '@/utils/FormatNumber'
import dayjs from 'dayjs'
import { Download, Eye, MessageSquare, Phone, Receipt } from 'lucide-react'
import Image from 'next/legacy/image'
import React from 'react'
import PaymentStatusCard from './PaymentStatusCard'

interface OrderDetailModalProps {
  open: boolean
  onClose: () => void
  order: IOrdered | null
}

interface TimelineStep {
  id: string
  label: string
  date?: string
  status: 'completed' | 'current' | 'pending'
}

const formatOrderDate = (date?: string, format = 'DD/MM/YYYY, HH:mm') => {
  if (!date) return 'N/A'
  return dayjs(date).format(format)
}

const getTimelineSteps = (order: IOrdered): TimelineStep[] => {
  const steps: TimelineStep[] = [
    {
      id: 'placed',
      label: 'Đặt hàng',
      date: order.orderedAt ? formatOrderDate(order.orderedAt, 'DD/MM, HH:mm') : undefined,
      status: 'completed',
    },
    {
      id: 'payment',
      label: 'Xác nhận thanh toán',
      date: order.paymentStatus === EnumPaymentStatus.PAID ? formatOrderDate(order.orderedAt, 'DD/MM, HH:mm') : undefined,
      status: order.paymentStatus === EnumPaymentStatus.PAID ? 'completed' : order.paymentStatus === EnumPaymentStatus.PENDING ? 'current' : 'pending',
    },
    {
      id: 'processing',
      label: 'Đang xử lý',
      date: 'Dự kiến: Hôm nay',
      status: order.orderStatus === EnumOrderStatus.PROCESSING ? 'current' : order.orderStatus === EnumOrderStatus.COMPLETED ? 'completed' : 'pending',
    },
    {
      id: 'shipping',
      label: 'Đang giao hàng',
      date: 'Dự kiến: 2-3 ngày',
      status: 'pending',
    },
    {
      id: 'delivered',
      label: 'Đã giao hàng',
      date: 'Dự kiến: 5-7 ngày',
      status: order.orderStatus === EnumOrderStatus.COMPLETED ? 'completed' : 'pending',
    },
  ]

  if (order.orderStatus === EnumOrderStatus.CANCELLED || order.paymentStatus === EnumPaymentStatus.CANCELLED) {
    return steps.map((step) => ({
      ...step,
      status: step.status === 'completed' ? 'completed' : 'pending',
    })) as TimelineStep[]
  }

  return steps
}

const ProductItem: React.FC<{ product: IOrderProduct }> = ({ product }) => (
  <div className="flex gap-4 p-3 rounded-xl border border-slate-100 dark:border-slate-800/50 hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group">
    <div className="size-24 shrink-0 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
      <Image src={product?.thumbnail?.path || NEW_MISSING_IMAGE} alt={product?.productName} layout="fill" objectFit="cover" />
    </div>
    <div className="flex flex-col justify-center w-full">
      <div className="font-semibold text-slate-900 dark:text-white text-sm line-clamp-2">{product.productName}</div>
      {product.productOptions && product.productOptions.length > 0 && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{product.productOptions.map((opt) => opt.name).join(' • ')}</p>}
      <div className="mt-2 flex items-center justify-between gap-4">
        <span className="text-sm font-bold text-slate-900 dark:text-white">{formatCurrency(product.totalPrice || product.price)}</span>
        <span className="text-xs text-slate-400">SL: {product.quantity}</span>
      </div>
    </div>
  </div>
)

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ open, onClose, order }) => {
  if (!order) return null

  const timelineSteps = getTimelineSteps(order)
  const orderInfo = order.orderInfo
  const address = orderInfo ? [orderInfo.address, orderInfo.apartment, orderInfo.city, orderInfo.province, orderInfo.country].filter(Boolean).join(', ') : 'Chưa có thông tin địa chỉ'
  const isPaid = order.paymentStatus === EnumPaymentStatus.PAID
  const productCount = order.products?.length || 0

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent size="6xl" className="max-h-[80vh]">
        <DialogHeader className="border-b-0 pb-0">
          <DialogTitle className="sr-only">Chi tiết đơn hàng</DialogTitle>
          <DialogDescription className="sr-only">Xem thông tin chi tiết đơn hàng của bạn</DialogDescription>
        </DialogHeader>
        <DialogBody className="p-0">
          <div className="flex flex-col lg:flex-row h-full">
            {/* Left Panel - Order Details */}
            <div className="flex-1 overflow-y-auto p-6 lg:p-10 bg-white dark:bg-[#261814]">
              <div className="flex flex-col h-full">
                {/* Order Header */}
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

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {order.products?.map((product, index) => (
                    <ProductItem key={product.productId || index} product={product} />
                  ))}
                </div>

                {/* Bottom Section - Shipping & Invoice */}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      {/* Shipping Address Card */}
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

                      {/* Invoice Card */}
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800/50 h-fit flex flex-col">
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">Hoá đơn</div>
                        <div className="flex-1 flex flex-col">
                          <div className="bg-white dark:bg-slate-700/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-3">
                              <div className="bg-primary/10 dark:bg-primary/20 p-2.5 rounded-lg text-primary">
                                <Receipt className="size-5" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-slate-900 dark:text-white">INV-{order.orderId?.slice(-8) || 'N/A'}</p>
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
                    {/* Payment Info Collapsible */}
                    <PaymentStatusCard
                      paymentInfo={{
                        paymentStatus: order.paymentStatus,
                        paymentMethod: order.paymentMethod,
                        orderId: order.orderId,
                        orderedAt: order.orderedAt,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Timeline & Summary */}
            <div className="w-full lg:w-80 shrink-0 bg-background-light dark:bg-neutral-dark border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 flex flex-col overflow-y-auto">
              <div className="p-6 lg:p-8 flex-1 space-y-4">
                <div className="font-bold text-slate-900 dark:text-white mb-2">Trạng thái đơn hàng</div>

                {/* Timeline */}
                <Timeline>
                  {timelineSteps.map((step, index) => (
                    <TimelineItem key={step.id}>
                      {index < timelineSteps.length - 1 && <TimelineConnector isCompleted={step.status === 'completed'} />}
                      <TimelineIndicator variant={step.status === 'completed' ? 'primary' : step.status === 'current' ? 'primary' : 'muted'} hasRing isPulsing={step.status === 'current'} className="mt-1" />
                      <TimelineContent>
                        <TimelineTitle isActive={step.status === 'current'} isMuted={step.status === 'pending'}>
                          {step.label}
                        </TimelineTitle>
                        <TimelineDescription isMuted={step.status === 'pending'}>{step.date}</TimelineDescription>
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>

                <div className="w-full h-1 border-t border-slate-200" />

                {/* Cost Summary */}
                <div className="">
                  <div className="font-bold text-slate-900 dark:text-white mb-2">Chi phí</div>
                  <div className="bg-white dark:bg-neutral-dark rounded-xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between text-slate-500 dark:text-slate-400">
                        <span>Tạm tính</span>
                        <span>{formatCurrency((order.totalPrice || 0) - (order.fees?.shipping || 0) - (order.fees?.tax || 0) + (order.fees?.voucherDiscount || 0))}</span>
                      </div>
                      <div className="flex justify-between text-slate-500 dark:text-slate-400">
                        <span>Phí vận chuyển</span>
                        <span>{formatCurrency(order.fees?.shipping || 0)}</span>
                      </div>
                      {order.fees?.voucherDiscount && order.fees.voucherDiscount > 0 && (
                        <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                          <span>Giảm giá</span>
                          <span>-{formatCurrency(order.fees.voucherDiscount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-slate-500 dark:text-slate-400">
                        <span>Thuế</span>
                        <span>{formatCurrency(order.fees?.tax || 0)}</span>
                      </div>
                      <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-700 flex justify-between font-bold text-slate-900 dark:text-white text-base">
                        <span>Tổng cộng</span>
                        <span className="text-orange-600 font-bold">{formatCurrency(order.totalPrice || 0)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  )
}

export default OrderDetailModal
