import { forwardRef } from 'react'
import { IMessage, IRoom } from '@/services/ChatWS'
import { IAuthUser } from '@/interface/Context/auth'
import Image from 'next/image'
import { Info, ExternalLink } from 'lucide-react'

interface IProps {
  messages: IMessage[]
  currentRoom: IRoom | null
  user: IAuthUser | null
  isAdmin: boolean
  isLoading?: boolean
}

const MessageList = forwardRef<HTMLDivElement, IProps>(({ messages, currentRoom, user, isAdmin, isLoading = false }, ref) => {
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    const today = new Date()
    if (date.toDateString() === today.toDateString()) {
      return 'Hôm nay'
    }
    return date.toLocaleDateString('vi-VN', {
      day: 'numeric',
      month: 'long',
    })
  }

  const getSenderAvatar = (message: IMessage) => {
    if (message.senderRole === 'admin') {
      return currentRoom?.adminInfo?.avatar || ''
    }
    return currentRoom?.customerInfo?.avatar || user?.avatar || ''
  }

  const getSenderName = (message: IMessage) => {
    if (message.senderRole === 'admin') {
      return currentRoom?.adminInfo?.name || 'NoobStore Supporter'
    }
    return currentRoom?.customerInfo?.name || 'Khách hàng'
  }

  const isMyMessage = (message: IMessage) => {
    if (isAdmin) {
      return message.senderRole === 'admin'
    }
    return message.senderRole === 'customer'
  }

  // Loading skeleton
  if (isLoading) {
    return (
      <div ref={ref} className="flex-1 overflow-y-auto bg-gray-50 px-6 py-6">
        <div className="mx-auto max-w-4xl flex flex-col gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={`admin-${i}`} className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
              <div className="flex flex-col gap-2">
                <div className="h-12 w-48 bg-gray-200 rounded-2xl animate-pulse" />
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={`customer-${i}`} className="flex gap-3 flex-row-reverse">
              <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
              <div className="flex flex-col gap-2 items-end">
                <div className="h-12 w-48 bg-gray-200 rounded-2xl animate-pulse" />
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <main ref={ref} className="flex-1 overflow-y-auto bg-gray-50 px-6 py-6 scroll-smooth">
      <div className="mx-auto max-w-4xl flex flex-col gap-6">
        {/* Date Divider */}
        {messages.length > 0 && messages[0]?.timestamp && (
          <div className="flex items-center justify-center py-4">
            <span className="rounded-full bg-gray-200/60 px-3 py-1 text-xs font-medium text-gray-500">{formatDate(messages[0].timestamp)}</span>
          </div>
        )}

        {/* Session Start Info */}
        {currentRoom && (
          <div className="flex gap-4 px-4 py-3 bg-white border border-gray-200 rounded-xl mx-auto w-full max-w-md shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-500/10 text-orange-500">
              <Info className="w-5 h-5" />
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-sm font-medium text-gray-900">Phiên chat #{currentRoom.id.slice(0, 8)}</p>
              <p className="text-xs text-gray-500">Bắt đầu lúc {formatTime(currentRoom.createdAt)}</p>
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((msg, index) => {
          const isMe = isMyMessage(msg)

          return (
            <div key={index} className={`flex items-end gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
              <div className="h-10 w-10 shrink-0 rounded-full overflow-hidden bg-gray-200">
                {getSenderAvatar(msg) ? (
                  <Image src={getSenderAvatar(msg)} alt="Avatar" width={40} height={40} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-orange-100 text-orange-600 font-bold text-sm">{getSenderName(msg).charAt(0)}</div>
                )}
              </div>
              <div className={`flex flex-col gap-1 max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
                <span className={`text-xs text-gray-500 ${isMe ? 'mr-1' : 'ml-1'}`}>
                  {isMe ? 'Tôi' : getSenderName(msg)}, {formatTime(msg.timestamp)}
                </span>
                <div className={`px-5 py-4 text-sm leading-relaxed shadow-sm ${isMe ? 'rounded-2xl rounded-br-none bg-orange-500 text-white' : 'rounded-2xl rounded-bl-none bg-white border border-gray-200 text-gray-900'}`} style={{ wordBreak: 'break-word' }}>
                  <p>{msg.message}</p>
                </div>
              </div>
            </div>
          )
        })}

        {/* Typing Indicator - Placeholder for future use */}
        {/* <div className="flex items-end gap-3">
						<div className="h-10 w-10 shrink-0 rounded-full overflow-hidden bg-orange-100 flex items-center justify-center">
							<span className="text-sm font-bold text-orange-600">NS</span>
						</div>
						<div className="flex items-center gap-1 rounded-2xl rounded-bl-none bg-gray-200/50 px-5 py-4">
							<div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]" />
							<div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]" />
							<div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
						</div>
					</div> */}

        {/* Empty State */}
        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-4">
              <span className="text-3xl">👋</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Bắt đầu cuộc trò chuyện</h3>
            <p className="text-sm text-gray-500 max-w-sm">Gửi tin nhắn để nhận hỗ trợ từ đội ngũ NoobStore. Chúng tôi sẵn sàng giúp đỡ bạn!</p>
          </div>
        )}
      </div>
    </main>
  )
})

MessageList.displayName = 'MessageList'

export default MessageList
