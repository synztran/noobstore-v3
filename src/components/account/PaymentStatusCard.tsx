'use client'

import React, { useState, useEffect } from 'react'
import { Collapsible as CollapsiblePrimitive } from 'radix-ui'
import { ChevronDown, ShieldCheck, CheckCircle, Clock, XCircle, AlertTriangle, QrCode, Eye } from 'lucide-react'
import { EnumPaymentStatus, EnumPaymentMethod } from '@/interface/interface'
import dayjs from 'dayjs'

interface PaymentInfo {
  paymentStatus?: EnumPaymentStatus
  paymentMethod?: EnumPaymentMethod
  orderId?: string
  orderedAt?: string
  submittedAt?: string
  verifiedAt?: string
  verifiedBy?: string
  cancelReason?: string
  qrCodeUrl?: string
  paymentDeadline?: string
}

interface PaymentStatusCardProps {
  paymentInfo: PaymentInfo
}

const formatDate = (date?: string, format = 'DD/MM/YYYY') => {
  if (!date) return 'N/A'
  return dayjs(date).format(format)
}

const formatTime = (date?: string) => {
  if (!date) return ''
  return dayjs(date).format('HH:mm')
}

const getPaymentMethodLabel = (method?: EnumPaymentMethod): string => {
  switch (method) {
    case EnumPaymentMethod.BANK_TRANSFER:
      return 'Chuyển khoản ngân hàng'
    case EnumPaymentMethod.MOMO:
      return 'Ví MoMo'
    case EnumPaymentMethod.PAYPAL:
      return 'PayPal'
    case EnumPaymentMethod.CASH_ON_DELIVERY:
      return 'Thanh toán khi nhận hàng (COD)'
    default:
      return 'Chưa xác định'
  }
}

// Countdown Timer Hook
const useCountdown = (deadline?: string) => {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null)

  useEffect(() => {
    if (!deadline) return

    const calculateTimeLeft = () => {
      const now = dayjs()
      const end = dayjs(deadline)
      const diff = end.diff(now, 'second')

      if (diff <= 0) {
        return null
      }

      const hours = Math.floor(diff / 3600)
      const minutes = Math.floor((diff % 3600) / 60)
      const seconds = diff % 60

      return { hours, minutes, seconds }
    }

    setTimeLeft(calculateTimeLeft())
    const timer = setInterval(() => {
      const remaining = calculateTimeLeft()
      setTimeLeft(remaining)
      if (!remaining) clearInterval(timer)
    }, 1000)

    return () => clearInterval(timer)
  }, [deadline])

  return timeLeft
}

// Payment Required - QR Code with countdown
const PaymentPending: React.FC<{ info: PaymentInfo }> = ({ info }) => {
  const defaultDeadline = dayjs().add(24, 'hour').toISOString()
  const deadline = info.orderedAt ? dayjs(info.orderedAt).add(24, 'hour').toISOString() : defaultDeadline
  const countdown = useCountdown(deadline)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 text-primary bg-primary/10 dark:bg-primary/20 p-3 rounded-lg">
        <div className="p-1.5 bg-primary/20 rounded-full">
          <Clock className="size-4" />
        </div>
        <div>
          <p className="text-sm font-semibold">Yêu cầu thanh toán</p>
          <p className="text-xs opacity-80">
            {countdown ? (
              <span className="font-mono font-bold">
                Vui lòng hoàn tất thanh toán trong: {String(countdown.hours).padStart(2, '0')}:{String(countdown.minutes).padStart(2, '0')}:{String(countdown.seconds).padStart(2, '0')}
              </span>
            ) : (
              <span className="text-red-600 text-sm font-bold">Đã hết hạn</span>
            )}
          </p>
        </div>
      </div>

      {/* QR Code */}
      <div className="flex flex-col items-center">
        <div className="relative bg-white p-3 rounded-xl shadow-sm border border-slate-200">
          {info.qrCodeUrl ? (
            <img src={info.qrCodeUrl} alt="Payment QR Code" className="w-32 h-32 object-contain" />
          ) : (
            <div className="w-32 h-32 bg-linear-to-br from-slate-100 to-slate-50 rounded-lg flex items-center justify-center">
              <QrCode className="size-12 text-slate-400" />
            </div>
          )}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center">Quét mã QR để thanh toán</p>
      </div>

      {/* Info */}
      <div className="space-y-2 text-xs border-t border-slate-100 dark:border-slate-700 pt-3">
        <div className="flex justify-between">
          <span className="text-slate-400">Phương thức</span>
          <span className="font-medium text-slate-700 dark:text-slate-300">{getPaymentMethodLabel(info.paymentMethod)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Mã đơn hàng</span>
          <span className="font-medium text-slate-700 dark:text-slate-300 font-mono">#{info.orderId?.slice(-8) || 'N/A'}</span>
        </div>
      </div>
    </div>
  )
}

// Payment Submitted - Awaiting verification
const PaymentSubmitted: React.FC<{ info: PaymentInfo }> = ({ info }) => (
  <div className="space-y-4">
    {/* Header */}
    <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
      <div className="p-1.5 bg-blue-100 dark:bg-blue-800/50 rounded-full">
        <ShieldCheck className="size-4" />
      </div>
      <div>
        <p className="text-sm font-semibold">Đang xác minh thanh toán</p>
        <p className="text-xs opacity-80">Chúng tôi đang xử lý giao dịch của bạn</p>
      </div>
    </div>

    {/* Info */}
    <div className="space-y-2 text-xs">
      <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
        <span className="text-slate-400 uppercase tracking-wide text-[10px] font-semibold">Phương thức</span>
        <span className="font-medium text-slate-700 dark:text-slate-300">{getPaymentMethodLabel(info.paymentMethod)}</span>
      </div>
      <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
        <span className="text-slate-400 uppercase tracking-wide text-[10px] font-semibold">Ngày gửi</span>
        <span className="font-medium text-slate-700 dark:text-slate-300">{formatDate(info.submittedAt || info.orderedAt)}</span>
      </div>
      <div className="flex justify-between items-center py-2">
        <span className="text-slate-400 uppercase tracking-wide text-[10px] font-semibold">Mã giao dịch</span>
        <span className="font-medium text-slate-700 dark:text-slate-300 font-mono">TRX-{info.orderId?.slice(-6) || 'N/A'}</span>
      </div>
    </div>
  </div>
)

// Payment Verified/Paid
const PaymentVerified: React.FC<{ info: PaymentInfo }> = ({ info }) => (
  <div className="space-y-4">
    {/* Header */}
    <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 p-3 rounded-lg">
      <div className="p-1.5 bg-emerald-100 dark:bg-emerald-800/50 rounded-full">
        <CheckCircle className="size-4" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold">{getPaymentMethodLabel(info.paymentMethod)}</p>
      </div>
      <div className="text-right">
        <span className="inline-flex items-center gap-1 text-xs bg-emerald-100 dark:bg-emerald-800/50 px-2 py-1 rounded-full">
          <CheckCircle className="size-3" />
          Đã xác minh {formatTime(info.verifiedAt)}
        </span>
      </div>
    </div>

    {/* Info */}
    <div className="space-y-2 text-xs">
      <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
        <span className="text-slate-400 uppercase tracking-wide text-[10px] font-semibold">Mã giao dịch</span>
        <span className="font-medium text-slate-700 dark:text-slate-300 font-mono">TRX-{info.orderId?.slice(-6) || 'N/A'}</span>
      </div>
      <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
        <span className="text-slate-400 uppercase tracking-wide text-[10px] font-semibold">Ngày gửi</span>
        <span className="font-medium text-slate-700 dark:text-slate-300">{formatDate(info.submittedAt || info.orderedAt)}</span>
      </div>
      <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
        <span className="text-slate-400 uppercase tracking-wide text-[10px] font-semibold">Ngày xác minh</span>
        <span className="font-medium text-slate-700 dark:text-slate-300">{formatDate(info.verifiedAt)}</span>
      </div>
      <div className="flex justify-between items-center py-2">
        <span className="text-slate-400 uppercase tracking-wide text-[10px] font-semibold">Xác minh bởi</span>
        <span className="font-medium text-slate-700 dark:text-slate-300">{info.verifiedBy || 'Hệ thống'}</span>
      </div>
    </div>

    {/* View Receipt */}
    <button className="w-full flex items-center justify-center gap-2 text-sm text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary py-2 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors hover:border-primary/50">
      <Eye className="size-4" />
      Xem biên lai
    </button>
  </div>
)

// Payment Cancelled/Voided
const PaymentCancelled: React.FC<{ info: PaymentInfo }> = ({ info }) => (
  <div className="space-y-4">
    {/* Header */}
    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 p-3 rounded-lg">
      <div className="p-1.5 bg-slate-200 dark:bg-slate-700 rounded-full">
        <XCircle className="size-4" />
      </div>
      <div>
        <p className="text-sm font-bold uppercase tracking-wide">Giao dịch đã huỷ</p>
      </div>
    </div>

    {/* Warning */}
    <div className="flex items-start gap-3 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg text-xs">
      <AlertTriangle className="size-4 shrink-0 mt-0.5" />
      <p>Đơn hàng này đã bị huỷ theo yêu cầu của người dùng. Không có khoản tiền nào được ghi nhận.</p>
    </div>

    {/* Info */}
    <div className="space-y-2 text-xs border-t border-slate-100 dark:border-slate-700 pt-3">
      <div className="flex justify-between items-center py-1">
        <span className="text-slate-400">Lý do</span>
        <span className="font-medium text-slate-700 dark:text-slate-300">{info.cancelReason || 'Người dùng yêu cầu'}</span>
      </div>
      <div className="flex justify-between items-center py-1">
        <span className="text-slate-400">Phương thức</span>
        <span className="font-medium text-slate-700 dark:text-slate-300">{getPaymentMethodLabel(info.paymentMethod)}</span>
      </div>
    </div>
  </div>
)

// Main Component
const PaymentStatusCard: React.FC<PaymentStatusCardProps> = ({ paymentInfo }) => {
  const [expanded, setExpanded] = useState(false)
  const { paymentStatus } = paymentInfo

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case EnumPaymentStatus.PAID:
        return <ShieldCheck className="size-5 text-emerald-600 dark:text-emerald-400" />
      case EnumPaymentStatus.SUBMITTED:
        return <ShieldCheck className="size-5 text-blue-600 dark:text-blue-400" />
      case EnumPaymentStatus.CANCELLED:
        return <XCircle className="size-5 text-slate-500 dark:text-slate-400" />
      default:
        return <Clock className="size-5 text-primary" />
    }
  }

  const getStatusLabel = () => {
    switch (paymentStatus) {
      case EnumPaymentStatus.PAID:
        return 'Đã thanh toán'
      case EnumPaymentStatus.SUBMITTED:
        return 'Đang xác minh'
      case EnumPaymentStatus.CANCELLED:
        return 'Đã huỷ'
      default:
        return 'Chờ thanh toán'
    }
  }

  const renderContent = () => {
    switch (paymentStatus) {
      case EnumPaymentStatus.PAID:
        return <PaymentVerified info={paymentInfo} />
      case EnumPaymentStatus.SUBMITTED:
        return <PaymentSubmitted info={paymentInfo} />
      case EnumPaymentStatus.CANCELLED:
        return <PaymentCancelled info={paymentInfo} />
      default:
        return <PaymentPending info={paymentInfo} />
    }
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-800/50 dark:border-slate-800 h-fit p-4 border border-slate-100 rounded-lg space-y-2">
      <span className="text-base font-bold tracking-wider text-slate-400 flex items-center gap-2">Thông tin thanh toán</span>
      <div className="overflow-hidden">
        <div className="relative clear-both">
          <div className="bg-white dark:bg-neutral-dark p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">{renderContent()}</div>
        </div>
      </div>
    </div>
  )
}

export default PaymentStatusCard
