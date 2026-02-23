import MiniCountdown from '@/components/MiniCountdown'
import { Button } from '@/components/ReUIComponent/Button'
import { NEW_MISSING_IMAGE } from '@/constants/Images'
import { IBEResponseRaffleInfo } from '@/interface/Client/Raffle'
import { formatCurrency } from '@/utils/FormatNumber'
import { ChevronRight, Timer } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

// Helper function to calculate time left
const calculateTimeLeft = (endAt: Date | string): string => {
  const end = new Date(endAt)
  const now = new Date()
  const diff = end.getTime() - now.getTime()

  if (diff <= 0) return 'Đã kết thúc'

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

interface RaffleCardProps {
  raffle: IBEResponseRaffleInfo
  isFeatured?: boolean
}

export const RaffleCard = ({ raffle, isFeatured }: RaffleCardProps) => {
  const timeLeft = calculateTimeLeft(raffle.endAt)
  const artist = raffle.makerInfo?.brandName || 'Unknown Artist'
  const image = raffle.thumbnail?.path || raffle.images?.[0]?.path || NEW_MISSING_IMAGE
  const price = raffle.productOptions?.[0]?.price || raffle.entryPrice || 0
  const isNew = new Date(raffle.startAt).getTime() > Date.now() - 24 * 60 * 60 * 1000 // New if started within 24h
  const isHot = raffle.status === 'ONGOING' && timeLeft.includes('m') && !timeLeft.includes('h') && !timeLeft.includes('d')

  if (isFeatured) {
    return (
      <Link href={`/raffles/${raffle.raffleId}`}>
        <div className="group relative bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-blue-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 cursor-pointer">
          {/* Featured Ribbon */}
          <div className="absolute -right-12 top-6 rotate-45 bg-linear-to-r from-yellow-400 to-orange-400 py-1 w-40 text-center z-20 shadow-lg">
            <span className="text-[10px] font-bold text-black uppercase tracking-widest">Nổi Bật</span>
          </div>

          <div className="flex h-48">
            <div className="w-1/2 overflow-hidden relative">
              <Image src={image} alt={raffle.title} fill className="object-cover transform group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-linear-to-r from-transparent to-white"></div>
            </div>

            <div className="w-1/2 p-6 flex flex-col justify-center">
              <div className="mb-1 text-xs font-bold text-blue-600 uppercase tracking-wide">{artist}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight line-clamp-2">{raffle.title}</h3>
              <div className="flex items-center gap-2 text-gray-600 text-sm mb-4">
                <Timer size={16} /> Còn {timeLeft}
              </div>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-gray-900 font-bold text-lg">${price.toFixed(2)}</span>
                <button className="w-8 h-8 rounded-full bg-blue-500/10 hover:bg-blue-500 text-blue-600 hover:text-white flex items-center justify-center transition-all">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/raffles/${raffle.raffleId}`}>
      <div className="group relative bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-blue-500/20 hover:-translate-y-1 cursor-pointer h-full">
        <div className="relative overflow-hidden aspect-square">
          <Image src={image} alt={raffle.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />

          {isNew && <div className="absolute top-3 left-3 bg-blue-500 text-white px-2 py-1 rounded-md text-xs font-bold shadow-lg">Mới</div>}
          {isHot && <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold shadow-lg">Hot</div>}
          {/* {raffle.status === 'ENDED' && <div className="absolute top-3 right-3 bg-gray-500 text-white px-2 py-1 rounded-md text-xs font-bold shadow-lg">Đã kết thúc</div>} */}
          <div className="absolute bottom-2 left-2">
            <MiniCountdown startDate={raffle?.startAt} endDate={raffle?.endAt} raffleStatus={raffle?.status} />
          </div>
        </div>

        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <div className="min-w-0 flex-1 mr-2">
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">{raffle.title}</h3>
              <p className="text-sm text-gray-600 truncate">{artist}</p>
            </div>
            {/* <div className="bg-blue-500/10 text-blue-600 px-2 py-1 rounded text-xs font-bold shrink-0">{formatCurrency(price)}</div> */}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
            <div className="h-full bg-blue-500/10 text-blue-600 px-2 py-1 rounded text-sm font-bold shrink-0">{formatCurrency(price)}</div>
            <Button variant="outline" size="sm" className="text-xs font-bold uppercase tracking-wider">
              Join Raffle
            </Button>
          </div>
        </div>
      </div>
    </Link>
  )
}
