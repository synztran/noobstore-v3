'use client'

import { Button, Timeline, TimelineConnector, TimelineContent, TimelineDescription, TimelineIndicator, TimelineItem, TimelineTitle } from '@/components/ReUIComponent'
import { LabelPaymentMethod, VNCity } from '@/constants'
import { NEW_MISSING_IMAGE } from '@/constants/Images'
import { useAuth } from '@/context/Auth'
import { IOrderProduct, IOrdered } from '@/interface/Client/Order'
import { IAuthUser } from '@/interface/Context/auth'
import { EnumOrderStatus, EnumPaymentMethod } from '@/interface/interface'
import { cn } from '@/lib/utils'
import useOrderQuery from '@/react-query/order/api/useOrderQueries'
import { Base } from '@/templates/Base'
import { formatCurrency } from '@/utils/FormatNumber'
import NotifyUtils from '@/utils/NotifyUtils'
import { CheckCircle, CreditCard, Home, Package, ShieldCheck, Truck } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useMemo } from 'react'

// ============ TYPES ============
interface TimelineStep {
  id: string
  label: string
  subLabel?: string
  icon: React.ReactNode
  isCompleted: boolean
  isCurrent: boolean
}

// ============ HELPER COMPONENTS ============

// Success Header
interface SuccessHeaderProps {
  orderId: string
  email?: string
}

const SuccessHeader = ({ orderId, email }: SuccessHeaderProps) => (
  <div className="text-center space-y-4">
    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mb-2 shadow-sm ring-4 ring-green-50">
      <CheckCircle className="w-10 h-10" />
    </div>
    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Cảm ơn bạn đã đặt hàng!</h1>
    <p className="text-slate-500 text-lg">
      Đơn hàng của bạn đã được xác nhận. Chúng tôi đã gửi email xác nhận đến <span className="font-semibold text-slate-700">{email || 'email của bạn'}</span>.
    </p>
    <div className="inline-block bg-slate-100 px-4 py-2 rounded-lg mt-2">
      <span className="text-slate-500 text-sm font-medium uppercase tracking-wider">Mã đơn hàng</span>
      <span className="ml-2 text-slate-900 font-bold font-mono">#{orderId?.replace('ORDER-', '')}</span>
    </div>
  </div>
)

// Order Timeline
interface OrderTimelineProps {
  orderStatus: EnumOrderStatus
  orderedAt?: string
}

const OrderTimeline = ({ orderStatus, orderedAt }: OrderTimelineProps) => {
  const steps = useMemo<TimelineStep[]>(() => {
    const statusOrder = [EnumOrderStatus.ORDERED, EnumOrderStatus.PACKING, EnumOrderStatus.SHIPPING, EnumOrderStatus.PROCESSING, EnumOrderStatus.COMPLETED]
    const currentIndex = statusOrder.indexOf(orderStatus)

    const formatDate = (date?: string) => {
      if (!date) return ''
      return new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
    }

    return [
      {
        id: 'ordered',
        label: 'Đã đặt hàng',
        subLabel: orderedAt ? formatDate(orderedAt) : 'Đang chờ',
        icon: <Package className="w-4 h-4" />,
        isCompleted: currentIndex >= 0,
        isCurrent: currentIndex === 0,
      },
      {
        id: 'verification',
        label: 'Xác minh',
        subLabel: currentIndex >= 1 ? 'Đã xác minh' : 'Đang chờ',
        icon: <ShieldCheck className="w-4 h-4" />,
        isCompleted: currentIndex >= 1,
        isCurrent: currentIndex === 1,
      },
      {
        id: 'shipping',
        label: 'Vận chuyển',
        subLabel: currentIndex >= 2 ? 'Đang giao' : 'Dự kiến 2-3 ngày',
        icon: <Truck className="w-4 h-4" />,
        isCompleted: currentIndex >= 2,
        isCurrent: currentIndex === 2,
      },
      {
        id: 'delivered',
        label: 'Giao hàng',
        subLabel: currentIndex >= 3 ? 'Đã giao' : 'Dự kiến 3-5 ngày',
        icon: <Home className="w-4 h-4" />,
        isCompleted: currentIndex >= 3,
        isCurrent: currentIndex === 3,
      },
    ]
  }, [orderStatus, orderedAt])

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-4 md:p-4">
      <h3 className="text-lg font-bold text-slate-900 mb-6">Tiến trình đơn hàng</h3>

      {/* Horizontal Timeline for larger screens */}
      <div className="hidden sm:block">
        <div className="relative">
          {/* Background connector line */}
          <div className="absolute top-4 left-[calc(12.5%)] right-[calc(12.5%)] h-0.5 bg-slate-200" />
          {/* Progress connector line */}
          <div
            className="absolute top-4 left-[calc(12.5%)] h-0.5 bg-primary transition-all duration-500"
            style={{
              width: `${Math.max(0, (steps.filter((s) => s.isCompleted).length - 1) / (steps.length - 1)) * 75}%`,
            }}
          />

          <div className="relative grid grid-cols-4 text-center">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center">
                <TimelineIndicator
                  variant={step.isCompleted || step.isCurrent ? 'primary' : 'muted'}
                  size="icon"
                  hasRing
                  ringClassName={step.isCompleted || step.isCurrent ? 'ring-primary/20' : 'ring-white'}
                  isPulsing={step.isCurrent}
                  className={cn('text-white shadow-lg', !step.isCompleted && !step.isCurrent && 'opacity-50')}
                >
                  {step.icon}
                </TimelineIndicator>
                <div className="mt-3 flex flex-col items-center">
                  <TimelineTitle isActive={step.isCurrent} isMuted={!step.isCompleted && !step.isCurrent} className="text-center">
                    {step.label}
                  </TimelineTitle>
                  <TimelineDescription isMuted={!step.isCompleted && !step.isCurrent} className="mt-0.5 text-center">
                    {step.subLabel}
                  </TimelineDescription>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vertical Timeline for mobile using reUI components */}
      <div className="sm:hidden">
        <Timeline>
          {steps.map((step, index) => (
            <TimelineItem key={step.id} isActive={step.isCurrent} isCompleted={step.isCompleted}>
              {index < steps.length - 1 && <TimelineConnector isCompleted={step.isCompleted && steps[index + 1]?.isCompleted} className="left-3.75 top-8" />}
              <TimelineIndicator variant={step.isCompleted || step.isCurrent ? 'primary' : 'muted'} size="icon" hasRing isPulsing={step.isCurrent} className="text-white">
                {step.icon}
              </TimelineIndicator>
              <TimelineContent className="pb-6">
                <TimelineTitle isActive={step.isCurrent} isMuted={!step.isCompleted && !step.isCurrent}>
                  {step.label}
                </TimelineTitle>
                <TimelineDescription isMuted={!step.isCompleted && !step.isCurrent}>{step.subLabel}</TimelineDescription>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </div>
    </div>
  )
}

// Loyalty Points Banner
interface LoyaltyPointsProps {
  points: number
}

const LoyaltyPointsBanner = ({ points }: LoyaltyPointsProps) => (
  <div className="bg-linear-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center shadow-lg text-yellow-900 animate-pulse">
        <span className="text-2xl">💰</span>
      </div>
      <div>
        <h3 className="text-lg font-bold text-slate-900">Điểm thưởng đã nhận</h3>
        <p className="text-slate-600 text-sm">
          Bạn đã nhận được <span className="font-bold text-yellow-600">{points} điểm</span> từ đơn hàng này!
        </p>
      </div>
    </div>
    <Link href="/rewards" className="whitespace-nowrap font-semibold">
      Xem phần thưởng
    </Link>
  </div>
)

// Product Item
const ProductItem = ({ item }: { item: IOrderProduct }) => {
  const thumbnail = item?.productOptions?.[0]?.thumbnail?.path || item?.thumbnail?.path || NEW_MISSING_IMAGE
  const productOptions = item?.productOptions || []
  const variantText = productOptions
    .map((opt) => opt.name)
    .filter(Boolean)
    .join(' / ')

  return (
    <div className="flex gap-4">
      <div className="w-20 h-20 rounded-xl bg-slate-100 shrink-0 relative overflow-hidden">
        <Image alt={item.productName || 'Product'} className="w-full h-full object-cover" src={thumbnail} width={80} height={80} />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="text-slate-900 font-bold text-sm">{item.categoryName}</h4>
            {variantText && (
              <p className="text-slate-500 text-xs mt-1">
                {item.productName}: {variantText}
              </p>
            )}
            <p className="text-slate-400 text-xs mt-0.5">x{item.quantity}</p>
          </div>
          <p className="text-slate-900 font-semibold text-sm">{formatCurrency(item.totalPrice)}</p>
        </div>
      </div>
    </div>
  )
}

// Order Summary Card
interface OrderSummaryProps {
  order: IOrdered | undefined
}

const OrderSummaryCard = ({ order }: OrderSummaryProps) => {
  console.log('order', order)
  const products = order?.products || []
  const totalProductPrice = products.reduce((sum, p) => sum + p.totalPrice, 0)
  const shippingFee = order?.fees?.shipping || 0
  const taxFee = order?.fees?.tax || 0
  const totalPrice = order?.totalPrice || 0

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-900">Chi tiết đơn hàng</h3>
        <span className="text-sm text-slate-500">{order?.totalQuantity || 0} sản phẩm</span>
      </div>
      <div className="p-4 space-y-6">
        {products.map((item, index) => (
          <ProductItem key={item.productId || index} item={item} />
        ))}
      </div>
      <div className="bg-slate-50 p-4 border-t border-slate-100">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Tạm tính</span>
            <span className="text-slate-900 font-medium">{formatCurrency(totalProductPrice)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Phí vận chuyển</span>
            <span className="text-slate-900 font-medium">{shippingFee === 0 ? 'Miễn phí' : formatCurrency(shippingFee)}</span>
          </div>
          {taxFee > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Thuế</span>
              <span className="text-slate-900 font-medium">{formatCurrency(taxFee)}</span>
            </div>
          )}
          <div className="flex justify-between text-base font-bold pt-3 border-t border-slate-200">
            <span className="text-slate-900">Tổng cộng</span>
            <span className="text-primary">{formatCurrency(totalPrice)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Share Your Build Card
const ShareBuildCard = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-4 text-center">
    <h3 className="text-lg font-bold text-slate-900 mb-2">Chia sẻ với cộng đồng</h3>
    <p className="text-sm text-slate-500 mb-6">Khoe với mọi người về sản phẩm mới của bạn!</p>
    <div className="flex justify-center gap-4">
      <a href="https://discord.gg/noobstore" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-[#5865F2]/10 hover:bg-[#5865F2]/20 text-[#5865F2] flex items-center justify-center transition-colors">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419z" />
        </svg>
      </a>
      <a href="https://www.facebook.com/sharer/sharer.php?u=https://noobstore.vn" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] flex items-center justify-center transition-colors">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      </a>
    </div>
  </div>
)

// Customer Details Card
interface CustomerDetailsProps {
  order: IOrdered | undefined
}

const CustomerDetailsCard = ({ order }: CustomerDetailsProps) => {
  const orderInfo = order?.orderInfo
  const city = VNCity.find((c) => c.code === orderInfo?.city)?.name || orderInfo?.city || ''
  const paymentMethod = order?.paymentMethod || EnumPaymentMethod.CASH_ON_DELIVERY

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-4 space-y-4">
      <h3 className="text-lg font-bold text-slate-900">Thông tin khách hàng</h3>
      <div className="space-y-4 text-sm">
        <div>
          <h4 className="font-bold text-slate-700 mb-1">Địa chỉ giao hàng</h4>
          <p className="text-slate-500">
            {orderInfo?.firstName} {orderInfo?.lastName}
            <br />
            {orderInfo?.address}
            {orderInfo?.apartment && `, ${orderInfo.apartment}`}
            <br />
            {city}, {orderInfo?.postCode}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-slate-700 mb-1">Phương thức thanh toán</h4>
          <div className="flex items-center gap-2 text-slate-500">
            <CreditCard className="w-4 h-4" />
            <span>{LabelPaymentMethod[paymentMethod] || 'Không xác định'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============ MAIN COMPONENT ============
const ThankYouPage = () => {
  const router = useRouter()
  const { id: orderId } = router.query
  const { user } = useAuth() as unknown as { user: IAuthUser | null }
  const { data: order, isPending } = useOrderQuery(orderId as string, {
    enabled: !!orderId,
  })

  // Calculate loyalty points (example: 1 point per 1000 VND)
  const loyaltyPoints = useMemo(() => Math.floor((order?.totalPrice || 0) / 1000), [order?.totalPrice])

  if (!orderId) return null
  if (order?.paymentStatus === 'PENDING' || !order?.paymentMethod) {
    router.push(`/order-confirm/${orderId}`)
    NotifyUtils.warn('Đơn hàng của bạn đang chờ thanh toán. Chuyển hướng đến trang xác nhận đơn hàng...')
    return null
  }

  return (
    <Base isLoading={isPending}>
      <main className="grow flex justify-center py-10 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-200 flex flex-col gap-8">
          {/* Success Header */}
          <SuccessHeader orderId={orderId as string} email={user?.email} />

          {/* Order Timeline */}
          <OrderTimeline orderStatus={order?.orderStatus || EnumOrderStatus.ORDERED} orderedAt={order?.orderedAt} />

          {/* Loyalty Points Banner */}
          {loyaltyPoints > 0 && <LoyaltyPointsBanner points={loyaltyPoints} />}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Order Summary - Left (2 cols) */}
            <div className="lg:col-span-2">
              <OrderSummaryCard order={order} />
            </div>

            {/* Right Sidebar (1 col) */}
            <div className="flex flex-col gap-4">
              <ShareBuildCard />
              <CustomerDetailsCard order={order} />
              <Link href="/" className="block w-full">
                <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-6 rounded-xl text-center shadow-lg transition-all transform hover:-translate-y-0.5">Tiếp tục mua sắm</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </Base>
  )
}

export default ThankYouPage
