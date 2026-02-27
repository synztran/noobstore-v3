'use client'

import React, { useState } from 'react'
import { X, QrCode, Building2, User, CreditCard, Copy, Check, CheckCircle, Clipboard } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ReUIComponent'
import { formatCurrency } from '@/utils/FormatNumber'

interface QuickPayDialogProps {
  open: boolean
  onClose: () => void
  orderId?: string
  totalAmount?: number
  qrCodeUrl?: string
  bankInfo?: {
    bankName: string
    accountName: string
    accountNumber: string
  }
  onConfirmTransfer?: () => void
}

const CopyableInfoCard: React.FC<{
  icon: React.ReactNode
  iconBgColor: string
  label: string
  value: string
  isMono?: boolean
}> = ({ icon, iconBgColor, label, value, isMono }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800 hover:border-primary/30 transition-colors group">
      <div className="flex items-center gap-3">
        <div className={`size-10 rounded-full ${iconBgColor} flex items-center justify-center`}>{icon}</div>
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{label}</p>
          <p className={`text-sm font-bold text-slate-900 dark:text-white ${isMono ? 'font-mono tracking-wide' : ''}`}>{value}</p>
        </div>
      </div>
      <button onClick={handleCopy} className="text-slate-400 hover:text-primary p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-md transition-all opacity-0 group-hover:opacity-100 focus:opacity-100" title={`Copy ${label}`}>
        {copied ? <Check className="size-4 text-emerald-500" /> : <Copy className="size-4" />}
      </button>
    </div>
  )
}

const QuickPayDialog: React.FC<QuickPayDialogProps> = ({
  open,
  onClose,
  orderId,
  totalAmount = 0,
  qrCodeUrl,
  bankInfo = {
    bankName: 'NoobStore Finance',
    accountName: 'NoobStore Global LLC',
    accountNumber: '8829 1002 9938 1102',
  },
  onConfirmTransfer,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleConfirmTransfer = async () => {
    setIsSubmitting(true)
    try {
      await onConfirmTransfer?.()
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent size="md" showCloseButton={false} className="p-0 overflow-hidden">
        {/* Header */}
        <div className="bg-primary/5 dark:bg-primary/10 px-8 py-6 border-b border-primary/10 dark:border-primary/20">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-sm font-semibold text-orange-400 uppercase tracking-wider mb-1">Thanh toán đơn hàng</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">#{orderId?.slice(-8) || 'N/A'}</h3>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
              <X className="size-6" />
            </button>
          </div>
          <div className="flex justify-between items-end">
            <p className="text-slate-500 dark:text-slate-400 text-sm">Quét mã để thanh toán</p>
            <div className="text-right">
              <p className="text-xs text-slate-500 dark:text-slate-400">Tổng tiền</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{formatCurrency(totalAmount)}</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-8 py-8 flex flex-col items-center">
          {/* QR Code */}
          <div className="bg-white p-4 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 shadow-sm mb-8 relative group">
            <div className="size-48 bg-[#f7ae5a] flex items-center justify-center rounded-lg overflow-hidden">
              {qrCodeUrl ? (
                <img alt="Payment QR Code" className="w-full h-full object-cover" src={qrCodeUrl} />
              ) : (
                <div className="flex flex-col items-center justify-center text-primary">
                  <QrCode className="size-24" />
                  <span className="text-xs mt-2 text-slate-500">QR Code</span>
                </div>
              )}
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-1.5 whitespace-nowrap">
              <QrCode className="size-4 text-primary" />
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Quét bằng App Ngân hàng</span>
            </div>
          </div>

          {/* Bank Info Cards */}
          <div className="w-full space-y-4 mb-8">
            <CopyableInfoCard icon={<Building2 className="size-5 text-blue-600 dark:text-blue-400" />} iconBgColor="bg-blue-100 dark:bg-blue-900/30" label="Tên ngân hàng" value={bankInfo.bankName} />
            <CopyableInfoCard icon={<User className="size-5 text-purple-600 dark:text-purple-400" />} iconBgColor="bg-purple-100 dark:bg-purple-900/30" label="Tên tài khoản" value={bankInfo.accountName} />
            <CopyableInfoCard icon={<CreditCard className="size-5 text-green-600 dark:text-green-400" />} iconBgColor="bg-green-100 dark:bg-green-900/30" label="Số tài khoản" value={bankInfo.accountNumber} isMono />
            <CopyableInfoCard icon={<Clipboard className="size-5 text-gray-600 dark:text-gray-400" />} iconBgColor="bg-gray-100 dark:bg-gray-900/30" label="Nội dung" value={bankInfo.accountNumber} isMono />
          </div>

          {/* Confirm Button */}
          <button
            onClick={handleConfirmTransfer}
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transform active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle className="size-5" />
            {isSubmitting ? 'Đang xử lý...' : 'Xác nhận đã chuyển khoản'}
          </button>

          {/* Footer Note */}
          <p className="text-center text-xs text-slate-400 mt-4">Thanh toán sẽ được xác minh trong vòng 15 phút.</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default QuickPayDialog
