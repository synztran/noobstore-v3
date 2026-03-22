'use client'

import { Dialog, DialogBody, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ReUIComponent'
import OrderDetailLeftPanel from '@/components/account/OrderDetailModal/OrderDetailLeftPanel'
import OrderDetailRightPanel from '@/components/account/OrderDetailModal/OrderDetailRightPanel'
import { IOrdered } from '@/interface/Client/Order'
import React from 'react'

interface OrderDetailModalProps {
  open: boolean
  onClose: () => void
  order: IOrdered | null
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ open, onClose, order }) => {
  if (!order) return null

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent size="6xl" className="max-h-[80vh]">
        <DialogHeader className="border-b-0 pb-0">
          <DialogTitle className="sr-only">Chi tiết đơn hàng</DialogTitle>
          <DialogDescription className="sr-only">Xem thông tin chi tiết đơn hàng của bạn</DialogDescription>
        </DialogHeader>
        <DialogBody className="p-0">
          <div className="flex flex-col lg:flex-row h-full">
            <OrderDetailLeftPanel order={order} />
            <OrderDetailRightPanel order={order} />
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  )
}

export default OrderDetailModal
