import { Timeline, TimelineConnector, TimelineContent, TimelineDescription, TimelineIndicator, TimelineItem, TimelineTitle } from '@/components/ReUIComponent'
import { IOrdered } from '@/interface/Client/Order'
import { EnumOrderStatus, EnumPaymentStatus } from '@/interface/interface'
import dayjs from 'dayjs'
import React from 'react'

interface TimelineStep {
  id: string
  label: string
  date?: string
  status: 'completed' | 'current' | 'pending'
}

interface OrderDetailTimelineProps {
  order: IOrdered
}

const formatOrderDate = (date?: string, format = 'DD/MM/YYYY, HH:mm') => {
  if (!date) return 'N/A'
  return dayjs(date).format(format)
}

const getTimelineSteps = (order: IOrdered): TimelineStep[] => {
  const placedStep: TimelineStep = {
    id: 'placed',
    label: 'Đặt hàng',
    date: order.orderedAt ? formatOrderDate(order.orderedAt, 'DD/MM, HH:mm') : undefined,
    status: 'completed',
  }

  const isRefunded = order.paymentStatus === EnumPaymentStatus.REFUNDED
  const isCancelled = order.orderStatus === EnumOrderStatus.CANCELLED || order.paymentStatus === EnumPaymentStatus.CANCELLED

  if (isRefunded || isCancelled) {
    const finalStep: TimelineStep = isRefunded
      ? {
          id: 'refunded',
          label: 'Đã hoàn tiền',
          date: order.updatedAt ? formatOrderDate(order.updatedAt, 'DD/MM, HH:mm') : undefined,
          status: 'current',
        }
      : {
          id: 'cancelled',
          label: 'Đã huỷ',
          date: order.updatedAt ? formatOrderDate(order.updatedAt, 'DD/MM, HH:mm') : undefined,
          status: 'current',
        }

    return [placedStep, finalStep]
  }

  return [
    placedStep,
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
    {
      id: 'cancelled',
      label: 'Đã huỷ',
      date: order.updatedAt && (order.orderStatus === EnumOrderStatus.CANCELLED || order.paymentStatus === EnumPaymentStatus.CANCELLED) ? formatOrderDate(order.updatedAt, 'DD/MM, HH:mm') : undefined,
      status: 'pending',
    },
    {
      id: 'refunded',
      label: 'Đã hoàn tiền',
      date: order.updatedAt && order.paymentStatus === EnumPaymentStatus.REFUNDED ? formatOrderDate(order.updatedAt, 'DD/MM, HH:mm') : undefined,
      status: 'pending',
    },
  ]
}

const OrderDetailTimeline: React.FC<OrderDetailTimelineProps> = ({ order }) => {
  const timelineSteps = getTimelineSteps(order)

  return (
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
  )
}

export default OrderDetailTimeline
