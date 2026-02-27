import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ReUIComponent/Tooltip'
import { MappingConnectionStatus, TConnectionStatus } from '../interface'
import { CircleHelp } from 'lucide-react'
import { useAuth } from '@/context/Auth'
import { IAuthUser } from '@/interface/Context/auth'

interface IProps {
  isModule?: boolean
  connectionStatus?: TConnectionStatus
  getStatusColor?: (status: TConnectionStatus) => string
  connectionStats?: any
}

const ChatConnectionStatus = ({ isModule = false, connectionStatus, getStatusColor, connectionStats }: IProps) => {
  const { user } = useAuth() as unknown as { user: IAuthUser }

  if (isModule) {
    return (
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${getStatusColor?.(connectionStatus || 'disconnected')}`} />
        <span className="text-sm font-medium capitalize">{MappingConnectionStatus[connectionStatus || 'disconnected']}</span>
        <div className="flex items-center justify-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" className="inline-flex items-center justify-center">
                  <CircleHelp className="w-4 h-4 cursor-pointer text-gray-500 hover:text-gray-700" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <a href="https://www.facebook.com/noobassembly" target="_blank" rel="noopener noreferrer" className="text-white hover:text-orange-300">
                  Lỗi kết nối? Ấn vào đây để được hỗ trợ ngay
                </a>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 rounded-lg text-black bg-gray-200">
      <div className="text-sm flex flex-col gap-2">
        <div className="flex items-center justify-between space-x-2">
          <span>Trạng thái: </span>
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${getStatusColor?.(connectionStatus || 'disconnected')}`} />
              <span className="text-sm font-medium capitalize">{MappingConnectionStatus[connectionStatus || 'disconnected']}</span>
              <div className="flex items-center justify-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" className="inline-flex items-center justify-center">
                        <CircleHelp className="w-4 h-4 cursor-pointer text-gray-500 hover:text-gray-700" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <a href="https://www.facebook.com/noobassembly" target="_blank" rel="noopener noreferrer" className="text-white hover:text-orange-300">
                        Lỗi kết nối? Ấn vào đây để được hỗ trợ ngay
                      </a>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </div>
        {connectionStats && (
          <div className="flex items-center justify-between">
            Mã phòng: <span className="font-medium py-0.5 px-2 bg-gray-600 rounded-sm text-white">{connectionStats.roomId}</span>
          </div>
        )}
        {user && (
          <div className="flex items-center justify-between">
            Mã khách hàng: <span className="font-medium py-0.5 px-2 bg-gray-600 rounded-sm text-white">{user.customerId}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatConnectionStatus
