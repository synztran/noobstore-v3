import { Button } from '@/components/ReUIComponent'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ReUIComponent/Popover'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ReUIComponent/Tooltip'
import { IOrdered } from '@/interface/Client/Order'
import { IAuthUser } from '@/interface/Context/auth'
import { EnumOrderStatus, EnumPaymentStatus } from '@/interface/interface'
import useMyOrdersQuery from '@/react-query/order/api/useMyOrdersQuery'
import { IChatOrderInfo, IRoom } from '@/services/ChatWS'
import { formatCurrency } from '@/utils/FormatNumber'
import EmojiPicker from 'emoji-picker-react'
import { ImagePlus, Paperclip, Receipt, Send, Smile, X } from 'lucide-react'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { TConnectionStatus } from '../interface'

interface IAttachment {
  name: string
  type: 'image' | 'file'
}

interface ISendMessageOptions {
  messageType?: 'text' | 'order'
  orderInfo?: IChatOrderInfo
}

interface IProps {
  connectionStatus: TConnectionStatus
  roomId: string | null
  user: IAuthUser
  isAdmin: boolean
  currentRoom: IRoom | null
  isModule?: boolean
  onSendMessage?: (message: string, roomId: string, isAdmin: boolean, sendTo?: number, options?: ISendMessageOptions) => void
}

const getOrderStatusLabel = (status?: EnumOrderStatus) => {
  switch (status) {
    case EnumOrderStatus.PROCESSING:
      return 'Đang xử lý'
    case EnumOrderStatus.COMPLETED:
      return 'Hoàn thành'
    case EnumOrderStatus.CANCELLED:
      return 'Đã huỷ'
    default:
      return 'Chưa cập nhật'
  }
}

const getPaymentStatusLabel = (status?: EnumPaymentStatus) => {
  switch (status) {
    case EnumPaymentStatus.PAID:
      return 'Đã thanh toán'
    case EnumPaymentStatus.PENDING:
      return 'Chờ thanh toán'
    case EnumPaymentStatus.CANCELLED:
      return 'Đã huỷ thanh toán'
    case EnumPaymentStatus.REFUNDED:
      return 'Đã hoàn tiền'
    default:
      return 'Chưa cập nhật'
  }
}

const mapOrderToInfo = (order: IOrdered): IChatOrderInfo | null => {
  if (!order.orderId) return null

  return {
    orderId: order.orderId,
    totalPrice: order.totalPrice || 0,
    totalQuantity: order.totalQuantity || order.products?.length || 0,
    orderedAt: order.orderedAt,
    paymentStatus: order.paymentStatus,
    orderStatus: order.orderStatus,
  }
}

export default function ChatInput({ connectionStatus, roomId, user, isAdmin = false, currentRoom = null, isModule = false, onSendMessage }: IProps) {
  const [inputValue, setInputValue] = useState('')
  const [showEmoji, setShowEmoji] = useState(false)
  const [attachments, setAttachments] = useState<IAttachment[]>([])
  const [showOrderPopover, setShowOrderPopover] = useState(false)
  const [orderSearch, setOrderSearch] = useState('')
  const [linkedOrders, setLinkedOrders] = useState<IChatOrderInfo[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const emojiPickerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const { data: myOrders = [], isLoading: isLoadingOrders } = useMyOrdersQuery({ enabled: !isAdmin })

  const filteredOrders = useMemo(() => {
    const keyword = orderSearch.trim().toLowerCase()
    const sortedOrders = [...myOrders].sort((a, b) => {
      const aTime = a.orderedAt ? new Date(a.orderedAt).getTime() : 0
      const bTime = b.orderedAt ? new Date(b.orderedAt).getTime() : 0
      return bTime - aTime
    })

    if (!keyword) return sortedOrders

    return sortedOrders.filter((order) => {
      const orderId = order.orderId?.toLowerCase() || ''
      return orderId.includes(keyword)
    })
  }, [myOrders, orderSearch])

  const linkedOrderIds = useMemo(() => new Set(linkedOrders.map((order) => order.orderId)), [linkedOrders])

  const handleEmojiClick = (emojiData: { emoji: string }) => {
    const cursorPos = textareaRef?.current?.selectionStart || inputValue.length
    const newText = inputValue.slice(0, cursorPos) + emojiData.emoji + inputValue.slice(cursorPos)
    setInputValue(newText)
    setShowEmoji(false)
    setTimeout(() => textareaRef.current?.focus(), 0)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAttachments((prev) => [...prev, { name: file.name, type: 'file' }])
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAttachments((prev) => [...prev, { name: file.name, type: 'image' }])
    }
  }

  const handleRemoveAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSend = () => {
    if (!roomId) return

    const message = inputValue.trim()
    const hasOrderLinks = linkedOrders.length > 0

    if (!message && !hasOrderLinks) return

    if (onSendMessage) {
      const sendTo = isAdmin ? currentRoom?.customerId : currentRoom?.adminId

      if (message) {
        onSendMessage(message, roomId, isAdmin, sendTo, { messageType: 'text' })
      }

      linkedOrders.forEach((order) => {
        onSendMessage(`Đơn hàng #${order.orderId}`, roomId, isAdmin, sendTo, {
          messageType: 'order',
          orderInfo: order,
        })
      })
    }

    setInputValue('')
    setAttachments([])
    setLinkedOrders([])
    setOrderSearch('')
    setShowOrderPopover(false)
  }

  const handleToggleOrderLink = (order: IOrdered) => {
    const orderInfo = mapOrderToInfo(order)
    if (!orderInfo) return

    setLinkedOrders((prev) => {
      const exists = prev.some((item) => item.orderId === orderInfo.orderId)
      if (exists) {
        return prev.filter((item) => item.orderId !== orderInfo.orderId)
      }
      return [...prev, orderInfo]
    })
  }

  const handleRemoveLinkedOrder = (orderId: string) => {
    setLinkedOrders((prev) => prev.filter((order) => order.orderId !== orderId))
  }

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 128)}px`
    }
  }, [inputValue])

  useEffect(() => {
    if (!showEmoji) return
    function handleClickOutside(event: MouseEvent) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node) && (event.target as HTMLElement).getAttribute('aria-label') !== 'emoji') {
        setShowEmoji(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showEmoji])

  const isDisabled = connectionStatus !== 'connected'
  const isSendDisabled = isDisabled || (!inputValue.trim() && linkedOrders.length === 0)

  const renderLinkedOrders = () => {
    if (linkedOrders.length === 0) return null

    return (
      <div className="flex flex-wrap gap-2">
        {linkedOrders.map((order) => (
          <div key={order.orderId} className="flex min-w-55 items-start gap-2 rounded-lg border border-orange-500/20 bg-orange-500/10 px-2 py-2 text-xs">
            <Receipt className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
            <div className="flex-1">
              <p className="font-semibold text-gray-800">Đơn #{order.orderId}</p>
              <p className="text-gray-600">
                {formatCurrency(order.totalPrice)} • {order.totalQuantity} sản phẩm
              </p>
            </div>
            <button type="button" className="rounded-full p-0.5 text-gray-500 transition-colors hover:bg-orange-500/20 hover:text-orange-600" onClick={() => handleRemoveLinkedOrder(order.orderId)}>
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    )
  }

  const renderOrderPopover = () => (
    <Popover open={showOrderPopover} onOpenChange={setShowOrderPopover}>
      <PopoverTrigger asChild>
        <Button type="button" className="group flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-orange-500 border border-gray-200/60 transition-all text-xs font-medium whitespace-nowrap disabled:opacity-50" disabled={isDisabled || isAdmin}>
          <Receipt className="w-4 h-4" />
          Liên kết đơn
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-90 p-0">
        <div className="border-b border-gray-200 px-3 py-3">
          <p className="text-sm font-semibold text-gray-900">Liên kết đơn hàng</p>
          <p className="text-xs text-gray-500">Chọn đơn để gửi nhanh trong đoạn chat</p>
          <input type="text" value={orderSearch} onChange={(e) => setOrderSearch(e.target.value)} className="mt-3 block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-orange-500" placeholder="Tìm theo mã đơn..." />
        </div>

        <div className="max-h-72 overflow-y-auto p-2">
          {isLoadingOrders && <p className="px-2 py-4 text-center text-sm text-gray-500">Đang tải đơn hàng...</p>}

          {!isLoadingOrders && filteredOrders.length === 0 && <p className="px-2 py-4 text-center text-sm text-gray-500">Không tìm thấy đơn hàng phù hợp</p>}

          {!isLoadingOrders &&
            filteredOrders.map((order) => {
              const orderId = order.orderId || 'N/A'
              const isLinked = linkedOrderIds.has(orderId)
              const quantity = order.totalQuantity || order.products?.length || 0

              return (
                <button
                  key={`${orderId}-${order.orderedAt || ''}`}
                  type="button"
                  className={`mb-1 w-full rounded-lg border px-3 py-2 text-left transition-colors ${isLinked ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-white hover:border-orange-300 hover:bg-orange-50/40'}`}
                  onClick={() => handleToggleOrderLink(order)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Đơn #{orderId}</p>
                      <p className="text-xs text-gray-500">{order.orderedAt ? new Date(order.orderedAt).toLocaleString('vi-VN') : 'Chưa có ngày đặt'}</p>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${isLinked ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}`}>{isLinked ? 'Đã chọn' : 'Chọn'}</span>
                  </div>

                  <div className="mt-1 space-y-0.5 text-xs text-gray-600">
                    <p>Tổng tiền: {formatCurrency(order.totalPrice || 0)}</p>
                    <p>
                      {quantity} sản phẩm • {getOrderStatusLabel(order.orderStatus)}
                    </p>
                    <p>Thanh toán: {getPaymentStatusLabel(order.paymentStatus)}</p>
                  </div>
                </button>
              )
            })}
        </div>
      </PopoverContent>
    </Popover>
  )

  if (isModule) {
    return (
      <div className="bg-white px-4 py-3 border-t border-gray-200">
        {renderLinkedOrders()}
        <div className="flex items-end gap-2">
          <div className="relative flex items-end gap-2 flex-1 rounded-xl border border-gray-200 bg-gray-50 p-2 shadow-sm focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500 transition-all">
            <textarea
              ref={textareaRef}
              className="flex-1 resize-none bg-transparent border-none py-2 px-3 text-sm placeholder:text-gray-400 focus:ring-0 focus:outline-none max-h-32 min-h-10"
              placeholder="Nhập tin nhắn..."
              rows={1}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isDisabled}
            />
            <div className="flex items-center gap-1 pb-1">
              {renderOrderPopover()}
              <button type="button" className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-200/50 hover:text-yellow-500 transition-colors disabled:opacity-50" onClick={() => setShowEmoji((v) => !v)} disabled={isDisabled} aria-label="emoji">
                <Smile className="w-5 h-5" />
              </button>
              <button type="button" className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500 text-white shadow-sm hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleSend} disabled={isSendDisabled}>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Emoji Picker */}
        {showEmoji && (
          <div ref={emojiPickerRef} className="absolute bottom-20 right-4 z-50">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
      </div>
    )
  }

  return (
    <footer className="bg-white p-6 border-t border-gray-200 z-20">
      <div className="mx-auto max-w-4xl w-full flex flex-col gap-3">
        {renderLinkedOrders()}
        {/* Action Buttons */}
        <div className="flex items-center gap-3 px-1 pb-1 overflow-x-auto">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  className="group flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-orange-500 border border-gray-200/60 transition-all text-xs font-medium whitespace-nowrap disabled:opacity-50"
                  onClick={() => imageInputRef.current?.click()}
                  disabled={isDisabled}
                >
                  <ImagePlus className="w-4 h-4" />
                  Tải ảnh
                </Button>
              </TooltipTrigger>
              <TooltipContent>Tải ảnh lên</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  className="group flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-orange-500 border border-gray-200/60 transition-all text-xs font-medium whitespace-nowrap disabled:opacity-50"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isDisabled}
                >
                  <Paperclip className="w-4 h-4" />
                  Đính kèm
                </Button>
              </TooltipTrigger>
              <TooltipContent>Đính kèm tệp</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileUpload} />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>{renderOrderPopover()}</div>
              </TooltipTrigger>
              <TooltipContent>{isAdmin ? 'Chỉ khách hàng có thể liên kết đơn' : 'Liên kết đơn hàng'}</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Attachments */}
          {attachments.length > 0 && (
            <>
              <div className="h-4 w-px bg-gray-200 mx-1" />
              {attachments.map((attachment, index) => (
                <div key={index} className="flex items-center gap-2 pl-2 pr-1 py-1 bg-orange-500/10 border border-orange-500/20 rounded-md text-orange-500 text-xs font-medium">
                  {attachment.type === 'image' ? <ImagePlus className="w-4 h-4" /> : <Paperclip className="w-4 h-4" />}
                  <span className="max-w-25 truncate">{attachment.name}</span>
                  <Button type="button" className="hover:bg-orange-500/20 rounded-full p-0.5 transition-colors" onClick={() => handleRemoveAttachment(index)}>
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="relative flex items-end gap-2 rounded-xl border border-gray-200 bg-gray-50 p-2 shadow-sm focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500 transition-all">
          <textarea
            ref={textareaRef}
            className="flex-1 resize-none bg-transparent border-none py-2.5 px-3 text-sm placeholder:text-gray-400 focus:ring-0 focus:outline-none max-h-32 min-h-12"
            placeholder="Nhập tin nhắn của bạn..."
            rows={1}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isDisabled}
          />
          <div className="flex items-center gap-2 pb-1 pr-1">
            <button type="button" className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-200/50 hover:text-yellow-500 transition-colors disabled:opacity-50" title="Chèn emoji" onClick={() => setShowEmoji((v) => !v)} disabled={isDisabled} aria-label="emoji">
              <Smile className="w-5 h-5" />
            </button>
            <button type="button" className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500 text-white shadow-sm hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleSend} disabled={isSendDisabled}>
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Emoji Picker */}
        {showEmoji && (
          <div ref={emojiPickerRef} className="absolute bottom-32 right-8 z-50">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}

        {/* Help Text */}
        <div className="text-center">
          <p className="text-[11px] text-gray-500">Enter để gửi, Shift + Enter để xuống dòng</p>
        </div>
      </div>
    </footer>
  )
}
