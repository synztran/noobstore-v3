import { IRoom } from '@/services/ChatWS'
import { TConnectionStatus, MappingConnectionStatus } from '../interface'
import Image from 'next/image'
import { Badge, History, Ban, Headphones } from 'lucide-react'
import { Button } from '@/components/ReUIComponent/Button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ReUIComponent/Tooltip'
import { IAuthUser } from '@/interface/Context/auth'

interface IProps {
  currentRoom: IRoom | null
  connectionStatus: TConnectionStatus
  connectionStats?: any
  isAdmin?: boolean
  user?: IAuthUser | null
}

const CustomerInfoSidebar = ({ currentRoom, connectionStatus, connectionStats, isAdmin = false, user }: IProps) => {
  // For admin: show customer info
  // For customer: show support agent info (NoobStore Supporter)
  const displayInfo = isAdmin
    ? {
        name: currentRoom?.customerInfo?.name || 'Khách hàng',
        avatar: currentRoom?.customerInfo?.avatar,
        role: 'Khách hàng',
        phone: currentRoom?.customerInfo?.phone,
      }
    : {
        name: currentRoom?.adminInfo?.name || 'NoobStore Supporter',
        avatar: currentRoom?.adminInfo?.avatar,
        role: 'Hỗ trợ viên',
        phone: null,
      }

  const customerId = currentRoom?.customerId
  const roomId = currentRoom?.id

  const getStatusColor = (status: TConnectionStatus) => {
    switch (status) {
      case 'connected':
        return 'bg-green-500'
      case 'connecting':
        return 'bg-yellow-500'
      case 'disconnected':
      case 'error':
        return 'bg-red-500'
    }
  }

  const getStatusBgColor = (status: TConnectionStatus) => {
    switch (status) {
      case 'connected':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'connecting':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'disconnected':
      case 'error':
        return 'bg-red-50 text-red-700 border-red-200'
    }
  }

  return (
    <aside className="w-80 shrink-0 bg-white border-r border-gray-200 flex flex-col h-full shadow-sm z-20">
      {/* Avatar and Info */}
      <div className="p-8 flex flex-col items-center border-b border-gray-200/50">
        <div className="relative mb-4">
          <div className="h-24 w-24 rounded-full bg-cover bg-center shadow-md ring-4 ring-gray-50 overflow-hidden">
            {displayInfo.avatar ? (
              <Image src={displayInfo.avatar} alt="Avatar" fill sizes="96px" className="object-cover" />
            ) : (
              <div className={`w-full h-full flex items-center justify-center ${isAdmin ? 'bg-gray-200' : 'bg-orange-100'}`}>{isAdmin ? <span className="text-2xl text-gray-500">{displayInfo.name?.charAt(0) || 'K'}</span> : <Headphones className="w-10 h-10 text-orange-500" />}</div>
            )}
          </div>
          <div className={`absolute bottom-1 right-1 h-5 w-5 rounded-full ${getStatusColor(connectionStatus)} border-2 border-white`} />
        </div>
        <h2 className="text-xl font-bold text-gray-900">{displayInfo.name}</h2>
        <p className="text-sm text-gray-500">{displayInfo.role}</p>
        <div className={`mt-4 px-3 py-1.5 text-xs font-semibold rounded-full border flex items-center gap-1.5 ${getStatusBgColor(connectionStatus)}`}>
          <span className={`h-2 w-2 rounded-full ${getStatusColor(connectionStatus)} ${connectionStatus === 'connected' ? 'animate-pulse' : ''}`} />
          Trạng thái: {MappingConnectionStatus[connectionStatus]}
        </div>
      </div>

      {/* Session Details */}
      <div className="p-6 flex-1 overflow-y-auto">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Thông tin phiên</h3>
        <div className="space-y-4">
          {isAdmin && (
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-500">Mã khách hàng</span>
              <div className="font-medium text-sm flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-200/50">
                <Badge className="w-4 h-4 text-gray-500" />
                #USER-{customerId || '---'}
              </div>
            </div>
          )}
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-500">Mã khách hàng</span>
            <div className="font-medium text-sm flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-200/50">
              <span className="text-gray-500">#</span>
              {customerId}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-500">Mã phòng</span>
            <div className="font-medium text-sm flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-200/50">
              <span className="text-gray-500">#</span>
              {roomId || connectionStats?.roomId || '---'}
            </div>
          </div>
          {isAdmin && displayInfo.phone && (
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-500">Số điện thoại</span>
              <div className="font-medium text-sm flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-200/50">
                <span className="text-gray-500">📞</span>
                {displayInfo.phone}
              </div>
            </div>
          )}
          {!isAdmin && (
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-500">Thời gian phản hồi</span>
              <div className="font-medium text-sm flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-200/50">
                <span className="text-gray-500">⏱️</span>
                Thường trả lời trong 5 phút
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 pt-6 border-t border-gray-200/50">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Thao tác nhanh</h3>
          <div className="grid grid-cols-2 gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" className="flex flex-col items-center justify-center gap-1 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 hover:text-orange-500 transition-colors border border-gray-200/50 h-auto">
                    <History className="w-5 h-5" />
                    <span className="text-xs font-medium">Lịch sử</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Xem lịch sử chat</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {isAdmin && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" className="flex flex-col items-center justify-center gap-1 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 hover:text-red-500 transition-colors border border-gray-200/50 h-auto">
                      <Ban className="w-5 h-5" />
                      <span className="text-xs font-medium">Chặn</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Chặn khách hàng</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 text-center">
        <p className="text-[10px] text-gray-500">Kết nối bảo mật • TLS 1.3</p>
      </div>
    </aside>
  )
}

export default CustomerInfoSidebar
