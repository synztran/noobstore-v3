import { IOrdered } from '@/interface/Client/Order'
import { formatCurrency } from '@/utils/FormatNumber'
import React from 'react'

interface OrderCostSummaryProps {
  order: IOrdered
}

const OrderCostSummary: React.FC<OrderCostSummaryProps> = ({ order }) => {
  const subtotal = (order.totalPrice || 0) - (order.fees?.shipping || 0) - (order.fees?.tax || 0) + (order.fees?.voucherDiscount || 0)

  return (
    <div>
      <div className="font-bold text-slate-900 dark:text-white mb-2">Chi phí</div>
      <div className="bg-white dark:bg-neutral-dark rounded-xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="space-y-3 text-sm">
          <div className="flex justify-between text-slate-500 dark:text-slate-400">
            <span>Tạm tính</span>
            <span>{formatCurrency(subtotal)}</span>
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
  )
}

export default OrderCostSummary
