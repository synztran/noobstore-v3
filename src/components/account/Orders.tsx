import React, { useState } from 'react'
import useMyOrdersQuery from '@/react-query/order/api/useMyOrdersQuery'
import { formatCurrency } from '@/utils/FormatNumber'
import { IOrdered, IOrderProduct } from '@/interface/Client/Order'
import { EnumOrderStatus, EnumPaymentStatus } from '@/interface/interface'
import dayjs from 'dayjs'
import useOrderQuery from '@/react-query/order/api/useOrderQueries'
import OrderDetailModal from './OrderDetailModal'
import QuickPayDialog from './QuickPayDialog'
import { Button } from '../ReUIComponent'

type FilterType = 'all' | 'unpaid' | 'shipped'

interface OrderStatusConfig {
  label: string
  bgColor: string
  textColor: string
  borderColor: string
  progressSteps: number
  progressColor: string
}

const getOrderStatusConfig = (paymentStatus?: EnumPaymentStatus, orderStatus?: EnumOrderStatus): OrderStatusConfig => {
  // Pending Payment
  if (paymentStatus === EnumPaymentStatus.PENDING) {
    return {
      label: 'Chờ thanh toán',
      bgColor: 'bg-amber-100 dark:bg-amber-900/40',
      textColor: 'text-amber-800 dark:text-amber-300',
      borderColor: 'border-amber-200 dark:border-amber-800/50',
      progressSteps: 1,
      progressColor: 'bg-amber-500',
    }
  }

  // Awaiting Verification (Submitted)
  if (paymentStatus === EnumPaymentStatus.SUBMITTED) {
    return {
      label: 'Đang xác minh',
      bgColor: 'bg-blue-100 dark:bg-blue-900/40',
      textColor: 'text-blue-800 dark:text-blue-300',
      borderColor: 'border-blue-200 dark:border-blue-800/50',
      progressSteps: 2,
      progressColor: 'bg-blue-500',
    }
  }

  // Paid & Processing
  if (paymentStatus === EnumPaymentStatus.PAID && orderStatus === EnumOrderStatus.PROCESSING) {
    return {
      label: 'Đã thanh toán & Đang xử lý',
      bgColor: 'bg-green-100 dark:bg-green-900/40',
      textColor: 'text-green-800 dark:text-green-300',
      borderColor: 'border-green-200 dark:border-green-800/50',
      progressSteps: 3,
      progressColor: 'bg-green-500',
    }
  }

  // Completed
  if (orderStatus === EnumOrderStatus.COMPLETED) {
    return {
      label: 'Hoàn thành',
      bgColor: 'bg-green-100 dark:bg-green-900/40',
      textColor: 'text-green-800 dark:text-green-300',
      borderColor: 'border-green-200 dark:border-green-800/50',
      progressSteps: 4,
      progressColor: 'bg-green-500',
    }
  }

  // Cancelled
  if (orderStatus === EnumOrderStatus.CANCELLED || paymentStatus === EnumPaymentStatus.CANCELLED) {
    return {
      label: 'Đã huỷ',
      bgColor: 'bg-slate-100 dark:bg-slate-800',
      textColor: 'text-slate-600 dark:text-slate-400',
      borderColor: 'border-slate-200 dark:border-slate-700',
      progressSteps: 0,
      progressColor: 'bg-slate-400',
    }
  }

  // Default - Ordered
  return {
    label: 'Đã đặt hàng',
    bgColor: 'bg-slate-100 dark:bg-slate-800',
    textColor: 'text-slate-800 dark:text-slate-300',
    borderColor: 'border-slate-200 dark:border-slate-700',
    progressSteps: 1,
    progressColor: 'bg-slate-500',
  }
}

const formatOrderDate = (dateStr?: string): string => {
  if (!dateStr) return ''
  return dayjs(dateStr).format('DD/MM/YYYY')
}

const ProgressBar: React.FC<{ steps: number; color: string }> = ({ steps, color }) => {
  const totalSteps = 4
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div key={index} className={`h-1.5 w-8 rounded-full ${index < steps ? color : 'bg-slate-200 dark:bg-slate-700'}`} />
      ))}
    </div>
  )
}

const ProductThumbnails: React.FC<{ products?: IOrderProduct[] }> = ({ products }) => {
  if (!products || products.length === 0) return null

  const displayProducts = products.slice(0, 2)
  const remainingCount = products.length - 2

  return (
    <div className="flex -space-x-3 overflow-hidden py-1 pl-1 shrink-0">
      {displayProducts.map((product, index) => (
        <div
          key={product.productId || index}
          className="relative inline-block size-20 rounded-lg border-2 border-white dark:border-neutral-dark bg-slate-100 shadow-sm bg-center bg-cover"
          style={{
            backgroundImage: product.thumbnail?.path ? `url('${product.thumbnail.path}')` : undefined,
          }}
        >
          {!product.thumbnail?.path && (
            <div className="flex items-center justify-center h-full text-slate-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
      ))}
      {remainingCount > 0 && <div className="relative inline-flex size-20 rounded-lg border-2 border-white dark:border-neutral-dark bg-slate-50 dark:bg-slate-800 shadow-sm items-center justify-center text-xs font-medium text-slate-600 dark:text-slate-400">+{remainingCount}</div>}
    </div>
  )
}

const OrderCard: React.FC<{ order: IOrdered; isFirst?: boolean; onViewDetail?: () => void; onPay?: () => void }> = ({ order, isFirst, onViewDetail, onPay }) => {
  const statusConfig = getOrderStatusConfig(order.paymentStatus, order.orderStatus)
  const isPendingPayment = order.paymentStatus === EnumPaymentStatus.PENDING
  const isCancelled = order.orderStatus === EnumOrderStatus.CANCELLED || order.paymentStatus === EnumPaymentStatus.CANCELLED
  const isPaidProcessing = order.paymentStatus === EnumPaymentStatus.PAID && order.orderStatus === EnumOrderStatus.PROCESSING

  return (
    <div className="relative group">
      {/* Timeline dot */}
      {/* <div className="absolute -left-[2.2rem] sm:-left-[2.7rem] top-6 flex items-center justify-center">
        {isFirst && isPendingPayment ? <div className="size-6 bg-white dark:bg-neutral-dark rounded-full border-4 border-amber-500 shadow-sm z-10" /> : <div className="size-4 bg-slate-200 dark:bg-slate-700 rounded-full border-4 border-white dark:border-neutral-dark" />}
      </div> */}

      <div className="bg-white dark:bg-neutral-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-2">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <span className="font-bold text-lg text-slate-900 dark:text-white">Đơn hàng #{order.orderId?.slice(-8) || 'N/A'}</span>
                <span className="text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">{formatOrderDate(order.orderedAt)}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <ProgressBar steps={statusConfig.progressSteps} color={statusConfig.progressColor} />
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 ml-1">{statusConfig.label}</span>
              </div>
            </div>
            <span className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full text-sm font-bold ${statusConfig.bgColor} ${statusConfig.textColor} border ${statusConfig.borderColor} self-start`}>{statusConfig.label}</span>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 flex flex-col md:flex-row gap-6 border-t border-slate-100 dark:border-slate-800/50 pt-6">
          <ProductThumbnails products={order.products} />

          <div className="flex-1 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Tổng tiền</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(order.totalPrice || 0)}</p>
              <p className="text-xs text-slate-400">{order.totalQuantity || order.products?.length || 0} sản phẩm</p>
            </div>

            <div className="flex gap-3 flex-col sm:flex-row w-full sm:w-auto">
              {isPendingPayment && (
                <>
                  <button onClick={onViewDetail} className="px-6 py-3 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    Chi tiết
                  </button>
                  <button onClick={onPay} className="flex items-center justify-center gap-2 px-8 py-3 rounded-lg text-sm font-bold text-white bg-primary hover:bg-primary/90 transition-all shadow-md shadow-primary/20 hover:shadow-lg hover:-translate-y-0.5 w-full sm:w-auto">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Thanh toán
                  </button>
                </>
              )}

              {isCancelled && <Button className="px-6 py-3 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Đặt lại</Button>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const OrdersSkeleton: React.FC = () => (
  <div className="space-y-8">
    {[1, 2, 3].map((i) => (
      <div key={i} className="bg-white dark:bg-neutral-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 animate-pulse">
        <div className="flex justify-between mb-4">
          <div className="flex gap-3">
            <div className="h-6 w-32 bg-slate-200 dark:bg-slate-700 rounded" />
            <div className="h-6 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
          </div>
          <div className="h-8 w-32 bg-slate-200 dark:bg-slate-700 rounded-full" />
        </div>
        <div className="flex gap-6 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="flex -space-x-3">
            <div className="size-20 bg-slate-200 dark:bg-slate-700 rounded-lg" />
            <div className="size-20 bg-slate-200 dark:bg-slate-700 rounded-lg" />
          </div>
          <div className="flex-1 flex justify-between items-center">
            <div>
              <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
              <div className="h-8 w-32 bg-slate-200 dark:bg-slate-700 rounded" />
            </div>
            <div className="flex gap-3">
              <div className="h-12 w-24 bg-slate-200 dark:bg-slate-700 rounded-lg" />
              <div className="h-12 w-32 bg-slate-200 dark:bg-slate-700 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
)

const EmptyOrders: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-neutral-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
    <svg className="w-24 h-24 text-slate-300 dark:text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Chưa có đơn hàng nào</h3>
    <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Bắt đầu mua sắm để tạo đơn hàng đầu tiên của bạn</p>
    <button className="px-6 py-3 rounded-lg text-sm font-bold text-white bg-primary hover:bg-primary/90 transition-all shadow-md">Khám phá sản phẩm</button>
  </div>
)

const Orders: React.FC = () => {
  const [filter, setFilter] = useState<FilterType>('all')
  const [selectedOrder, setSelectedOrder] = useState<IOrdered | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isQuickPayOpen, setIsQuickPayOpen] = useState(false)
  const [payingOrder, setPayingOrder] = useState<IOrdered | null>(null)

  const { data: orders, isLoading, error } = useMyOrdersQuery()

  const handleViewDetail = (order: IOrdered) => {
    setSelectedOrder(order)
    setIsDetailModalOpen(true)
  }

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false)
    setSelectedOrder(null)
  }

  const handleOpenQuickPay = (order: IOrdered) => {
    setPayingOrder(order)
    setIsQuickPayOpen(true)
  }

  const handleCloseQuickPay = () => {
    setIsQuickPayOpen(false)
    setPayingOrder(null)
  }

  const handleConfirmTransfer = async () => {
    // TODO: Call API to confirm transfer
    console.log('Confirming transfer for order:', payingOrder?.orderId)
    handleCloseQuickPay()
  }

  const filteredOrders = React.useMemo(() => {
    if (!orders) return []

    switch (filter) {
      case 'unpaid':
        return orders.filter((order) => order.paymentStatus === EnumPaymentStatus.PENDING)
      case 'shipped':
        return orders.filter((order) => order.orderStatus === EnumOrderStatus.COMPLETED || (order.paymentStatus === EnumPaymentStatus.PAID && order.orderStatus === EnumOrderStatus.PROCESSING))
      default:
        return orders
    }
  }, [orders, filter])

  const filterButtons: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'Tất cả' },
    { key: 'unpaid', label: 'Chưa thanh toán' },
    { key: 'shipped', label: 'Đã giao' },
  ]

  return (
    <div className="flex-1 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-neutral-dark p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Đơn hàng của tôi</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Theo dõi hành trình mua sắm của bạn</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {filterButtons.map((btn) => (
            <button
              key={btn.key}
              onClick={() => setFilter(btn.key)}
              className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm transition-all ${
                filter === btn.key ? 'text-white bg-slate-900 dark:bg-white dark:text-slate-900' : 'text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {isLoading ? (
        <OrdersSkeleton />
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-neutral-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
          <p className="text-red-500 mb-4">Có lỗi xảy ra khi tải đơn hàng</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary/90">
            Thử lại
          </button>
        </div>
      ) : filteredOrders.length === 0 ? (
        <EmptyOrders />
      ) : (
        <div className="relative pl-6 sm:pl-10 space-y-12 before:absolute before:inset-y-0 before:left-2 sm:before:left-4 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
          {filteredOrders.map((order, index) => (
            <OrderCard key={order.orderId || index} order={order} isFirst={index === 0} onViewDetail={() => handleViewDetail(order)} onPay={() => handleOpenQuickPay(order)} />
          ))}
        </div>
      )}

      {/* Order Detail Modal */}
      <OrderDetailModal open={isDetailModalOpen} onClose={handleCloseDetailModal} order={selectedOrder} />

      {/* Quick Pay Dialog */}
      <QuickPayDialog open={isQuickPayOpen} onClose={handleCloseQuickPay} orderId={payingOrder?.orderId} totalAmount={payingOrder?.totalPrice} onConfirmTransfer={handleConfirmTransfer} />
    </div>
  )
}

export default Orders
