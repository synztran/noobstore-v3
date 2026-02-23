import React from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ReUIComponent/Tooltip'
import { classNames } from '@/utils/AppConfig'
import { Bookmark, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import { NEW_MISSING_IMAGE } from '@/constants/Images'

interface SideUtilitiesProps {
  showAvatar?: boolean
  avatarUrl?: string
  avatarBadge?: React.ReactNode
  onOpen?: () => void
  onSave?: () => void
  isSaved?: boolean
}

const SideUtilities: React.FC<SideUtilitiesProps> = ({ showAvatar = false, avatarUrl, avatarBadge, onOpen, onSave, isSaved = false }) => {
  return (
    <TooltipProvider>
      <div className={classNames('flex flex-col items-center gap-2 bg-white rounded-2xl p-2 shadow-md max-h-max', 'w-full')}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button onClick={onOpen} className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-300 hover:border-black transition-all duration-300">
              <ExternalLink size={16} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="left">Thông tin từ hãng</TooltipContent>
        </Tooltip>

        {/* Save/Bookmark Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button onClick={onSave} className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-300 hover:border-black transition-all duration-300">
              <Bookmark size={16} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="left">Quan tâm</TooltipContent>
        </Tooltip>

        {/* Optional Avatar */}
        {showAvatar && avatarUrl && (
          <div className="relative mt-2">
            <Image src={NEW_MISSING_IMAGE} alt="avatar" width={36} height={36} className="w-9 h-9 rounded-full border border-white shadow-sm object-cover" />
            {avatarBadge !== undefined ? <span className="absolute -bottom-1 -right-1">{avatarBadge}</span> : <span className="absolute -bottom-1 -right-1 flex items-center justify-center w-5 h-5 bg-pink-500 rounded-full border-2 border-white text-white text-xs font-bold">+</span>}
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}

export default SideUtilities
