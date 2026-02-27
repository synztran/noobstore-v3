import { IRoom } from '@/services/ChatWS'
import Image from 'next/image'
import { Search, MoreVertical, MapPin, User } from 'lucide-react'
import { Button } from '@/components/ReUIComponent/Button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ReUIComponent/Tooltip'

interface IProps {
  currentRoom: IRoom | null
  isAdmin: boolean
}

const ChatHeader = ({ currentRoom, isAdmin }: IProps) => {
  const supporterInfo = isAdmin ? currentRoom?.customerInfo : currentRoom?.adminInfo

  // Admin view - shows customer info with stats
  if (isAdmin) {
    return (
      <header className="flex-shrink-0 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-cover bg-center overflow-hidden">
            {supporterInfo?.avatar ? (
              <Image src={supporterInfo.avatar} alt="Customer avatar" fill sizes="40px" className="object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-sm font-bold text-gray-500">{supporterInfo?.name?.charAt(0) || 'K'}</span>
              </div>
            )}
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">{supporterInfo?.name || 'Khách hàng'}</h2>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                Việt Nam
              </span>
              <span className="w-1 h-1 bg-gray-300 rounded-full" />
              <span className="text-green-600 font-medium">Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center divide-x divide-gray-200">
          <div className="px-6 text-center">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Tổng đơn</p>
            <p className="text-lg font-bold text-gray-900">--</p>
          </div>
          <div className="px-6 text-center">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Điểm</p>
            <p className="text-lg font-bold text-orange-500">--</p>
          </div>
          <div className="px-6 text-center">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Tổng chi</p>
            <p className="text-lg font-bold text-gray-900">--</p>
          </div>
          <div className="pl-6 flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-orange-500 transition-colors">
                    <User className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Xem hồ sơ</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-orange-500 transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Tùy chọn khác</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </header>
    )
  }

  // Customer view - shows support agent info
  return (
    <header className="flex-shrink-0 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 shadow-sm z-10">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="h-10 w-10 rounded-full bg-cover bg-center ring-2 ring-orange-500/10 overflow-hidden">
              {supporterInfo?.avatar ? (
                <Image src={supporterInfo.avatar} alt="Supporter avatar" fill sizes="40px" className="object-cover" />
              ) : (
                <div className="w-full h-full bg-orange-100 flex items-center justify-center">
                  <span className="text-sm font-bold text-orange-600">NS</span>
                </div>
              )}
            </div>
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
          </div>
          <div>
            <h2 className="text-base font-bold leading-tight text-gray-900">NoobStore Supporter</h2>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
              Online • Thường phản hồi trong 5 phút
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="flex items-center justify-center h-10 w-10 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
                <Search className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Tìm kiếm tin nhắn</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="flex items-center justify-center h-10 w-10 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Tùy chọn</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </header>
  )
}

export default ChatHeader
