import { useAuth } from '@/context/Auth'
import useMessageChat from '@/hook/useChat'
import { useCalcBodyHeight } from '@/hook/useConfig'
import { IAuthUser } from '@/interface/Context/auth'
import { websocketService } from '@/services/ChatWS'
import { Drawer } from '@mui/material'
import { X } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import ChatHeader from './ChatHeader'
import ChatInput from './ChatInput'
import ChatConnectionStatus from './connectionStatus'
import CustomerInfoSidebar from './CustomerInfoSidebar'
import MessageList from './MessageList'

interface IProps {
  isModule?: boolean
}

const ChatComponent = ({ isModule = false }: IProps) => {
  const auth = useAuth()
  const user = auth?.user as IAuthUser
  const [isOpen, setIsOpen] = useState(false)
  const [isInitializing, setInitializing] = useState(true)
  const [isSwichCustomer, setSwichCustomer] = useState(false)
  const { listRoom, messages, currentRoom, connectionStatus, connectionStats, getStatusColor, sendMessage } = useMessageChat({ user, isModule, isOpen })
  const { bodyHeight } = useCalcBodyHeight({})
  const messageListRef = useRef<HTMLDivElement>(null)

  const isAdmin = useMemo(() => user && user.role === 'admin', [user]) ?? false

  const handleToggleChat = () => {
    setIsOpen(!isOpen)
    setTimeout(() => {
      setInitializing(false)
    }, 300)
  }

  const scrollToBottom = () => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isSwichCustomer])

  const handleAdminSelectRoom = (roomId: string) => {
    if (currentRoom?.id === roomId) return // if the room is already selected, do nothing
    setSwichCustomer(true)
    websocketService.send({
      action: 'admin_selected_room',
      payload: {
        roomId,
        sendFrom: user?.customerId,
        userRole: user?.role as 'admin' | 'customer',
      },
    })
    setTimeout(() => {
      setSwichCustomer(false)
    }, 300)
  }

  if (isModule && isAdmin) {
    return null
  }

  if (isModule) {
    return (
      <div className="fixed bottom-0 right-0 z-13">
        <button className="bg-black text-white w-[min(25vw,300px)] px-8 py-2 rounded-tl-lg" onClick={handleToggleChat}>
          Liên hệ hỗ trợ 👋
        </button>
        <Drawer
          anchor="bottom"
          open={isOpen}
          onClose={handleToggleChat}
          disableScrollLock
          classes={{
            paper: 'w-[min(35vw,400px)] ml-auto border border-black rounded-tr-lg rounded-tl-lg shadow-lg bottom-0 right-0 bg-gray-100',
          }}
          BackdropComponent={() => <div className="bg-transparent" />}
        >
          <div className="flex items-center justify-between p-3 sticky top-0">
            <ChatConnectionStatus isModule={isModule} connectionStatus={connectionStatus} getStatusColor={getStatusColor} />
            <div className="flex items-center gap-2">
              <button className="p-1.5 bg-gray-600 hover:bg-gray-700 rounded-full transition-colors" onClick={handleToggleChat} type="button">
                <X className="text-white w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex flex-col bg-gray-100 h-full relative">
            {isInitializing ? (
              <div className="absolute flex items-center justify-center h-full w-full bg-white z-[11]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : null}
            <div ref={messageListRef} className={`flex-1 p-4 overflow-y-auto shadow-lg bg-gray-200 relative `} style={{ maxHeight: 'calc(100vh - 300px)' }}>
              {messages.map((msg, index) => (
                <div key={index} className={`flex gap-2 mb-2 ${msg.senderRole ? 'flex-row' : 'flex-row-reverse'}`}>
                  <Image src={msg.senderRole === 'admin' ? currentRoom?.adminInfo?.avatar || '' : currentRoom?.customerInfo?.avatar || user?.avatar} alt="avatar" width={32} height={32} className="w-8 h-8 rounded-full" />
                  <div className={`flex flex-col w-full max-w-[80%] ${msg.senderRole ? 'items-start' : 'items-end'}`}>
                    <div className={`px-4 py-2 rounded-lg max-w-[95%] break-words ${msg.senderRole === 'admin' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'}`}>{msg.message}</div>
                    <span className="text-xs text-gray-500 mt-1">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <ChatInput connectionStatus={connectionStatus} roomId={websocketService.getRoomId()} user={user} isAdmin={isAdmin} currentRoom={currentRoom} isModule={isModule} onSendMessage={sendMessage} />
          </div>
        </Drawer>
      </div>
    )
  }

  return (
    <div
      className="flex bg-gray-50"
      style={{
        height: `${bodyHeight}px`,
        maxHeight: `${bodyHeight}px`,
      }}
    >
      {/* Customer Info Sidebar - Only visible for customers */}
      {!isAdmin && <CustomerInfoSidebar currentRoom={currentRoom} connectionStatus={connectionStatus} connectionStats={connectionStats} isAdmin={isAdmin} user={user} />}

      {/* Left Sidebar with Room List - for admin */}
      {isAdmin && (
        <aside className="w-full max-w-[380px] flex flex-col border-r border-gray-200 bg-white h-full">
          {/* Search & Filters */}
          <div className="p-4 border-b border-gray-200 space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input type="text" className="block w-full rounded-lg border-0 py-2.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-500 bg-gray-50 text-sm" placeholder="Tìm kiếm cuộc trò chuyện..." />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 text-white rounded-full text-xs font-semibold shadow-sm">Tất cả</button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-full text-xs font-medium border border-gray-200 transition-colors whitespace-nowrap">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                Ưu tiên
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-full text-xs font-medium border border-gray-200 transition-colors whitespace-nowrap">Chưa đọc</button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-full text-xs font-medium border border-gray-200 transition-colors whitespace-nowrap">Đã xử lý</button>
            </div>
          </div>
          {/* Chat List Items */}
          <div className="flex-1 overflow-y-auto">
            {listRoom.length > 0 ? (
              listRoom.map((room) => (
                <div onClick={() => handleAdminSelectRoom(room.id)} key={room.customerId} className={`group flex items-start gap-3 p-4 cursor-pointer transition-colors ${currentRoom?.id === room.id ? 'bg-orange-50 border-l-4 border-orange-500' : 'border-b border-gray-100 hover:bg-gray-50'}`}>
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      {room.customerInfo.avatar ? (
                        <Image src={room.customerInfo.avatar} alt="avatar" className="object-cover" fill sizes="48px" />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-lg">{room.customerInfo.name?.charAt(0) || 'K'}</div>
                      )}
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className={`text-sm truncate ${currentRoom?.id === room.id ? 'font-bold text-gray-900' : 'font-semibold text-gray-900'}`}>{room.customerInfo.name || 'Khách hàng'}</h3>
                      <span className={`text-xs ${currentRoom?.id === room.id ? 'text-orange-500 font-medium' : 'text-gray-500'}`}>
                        {new Date(room.updatedAt).toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{room.messages[room.messages.length - 1]?.message || 'Chưa có tin nhắn'}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">Đang chờ</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                  <span className="text-xl">💬</span>
                </div>
                <p className="text-sm text-gray-500">Chưa có cuộc trò chuyện nào</p>
              </div>
            )}
          </div>
        </aside>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-gray-50 relative">
        {/* Loading overlay when switching customer */}
        {isSwichCustomer && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-[11]">
            <MessageList messages={[]} currentRoom={null} user={user} isAdmin={isAdmin} isLoading={true} />
          </div>
        )}

        {/* Chat Header */}
        <ChatHeader currentRoom={currentRoom} isAdmin={isAdmin} />

        {/* Message List */}
        <MessageList ref={messageListRef} messages={messages} currentRoom={currentRoom} user={user} isAdmin={isAdmin} />

        {/* Chat Input */}
        <ChatInput connectionStatus={connectionStatus} roomId={websocketService.getRoomId()} user={user} isAdmin={isAdmin} currentRoom={currentRoom} onSendMessage={sendMessage} />
      </div>
    </div>
  )
}

export default ChatComponent
