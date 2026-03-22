import OrderCostSummary from '@/components/account/OrderDetailModal/OrderCostSummary'
import OrderDetailTimeline from '@/components/account/OrderDetailModal/OrderDetailTimeline'
import { IOrdered } from '@/interface/Client/Order'
import React from 'react'

interface OrderDetailRightPanelProps {
  order: IOrdered
}

const OrderDetailRightPanel: React.FC<OrderDetailRightPanelProps> = ({ order }) => {
  return (
    <div className="w-full lg:w-80 shrink-0 bg-background-light dark:bg-neutral-dark border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 flex flex-col overflow-y-auto">
      <div className="p-6 lg:p-8 flex-1 space-y-4">
        <div className="font-bold text-slate-900 dark:text-white mb-2">Trạng thái đơn hàng</div>
        <OrderDetailTimeline order={order} />
        <div className="w-full h-1 border-t border-slate-200" />
        <OrderCostSummary order={order} />
      </div>
    </div>
  )
}

export default OrderDetailRightPanel
