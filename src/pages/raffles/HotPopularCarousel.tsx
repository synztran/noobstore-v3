import { ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react'
import Image from 'next/image'

import { Button } from '@/components/ReUIComponent/Button'
import { NEW_MISSING_IMAGE } from '@/constants/Images'
import { useRafflesContext } from '@/context/RafflesContext'
import { calculateTimeLeft } from '@/hook/useRafflesPage'

export const HotPopularCarousel = () => {
  const { currentFeatured, featuredRaffles, carouselIndex, setCarouselIndex, handleCarouselPrev, handleCarouselNext } = useRafflesContext()

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <TrendingUp size={24} className="text-red-500" />
          Nóng & Phổ Biến
        </h2>
        <div className="flex gap-2">
          <button onClick={handleCarouselPrev} className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-blue-500 hover:text-white transition-colors">
            <ChevronLeft size={16} />
          </button>
          <button onClick={handleCarouselNext} className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-blue-500 hover:text-white transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Carousel Container */}
      {currentFeatured && (
        <div className="relative w-full h-80 rounded-2xl overflow-hidden group bg-gray-100">
          {/* Background Image */}
          <Image src={currentFeatured.thumbnail?.path || currentFeatured.images?.[0]?.path || NEW_MISSING_IMAGE} alt={currentFeatured.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />

          {/* Overlay Gradients */}
          <div className="absolute inset-0 bg-linear-to-t from-gray-50 via-gray-50/40 to-transparent"></div>

          {/* Trending Badge */}
          <div className="absolute top-6 left-6 bg-blue-500/10 backdrop-blur-md border border-blue-500/30 text-red-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
            <TrendingUp size={14} className="animate-pulse" />
            Xu Hướng Hiện Tại
          </div>

          {/* Content Area */}
          <div className="absolute bottom-0 left-0 w-full p-8 md:p-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="text-blue-600 font-medium tracking-wide text-sm">{currentFeatured.makerInfo?.brandName || 'Unknown Artist'}</div>
              <h1 className="text-3xl font-bold text-gray-900 leading-tight">{currentFeatured.title}</h1>
              {/* <p className="text-gray-600 text-sm md:text-base max-w-md line-clamp-2">{currentFeatured.description || 'Xổ số phiên bản giới hạn với keycap thủ công độc quyền. Đừng bỏ lỡ cơ hội sở hữu một tác phẩm nghệ thuật có thể sưu tập.'}</p> */}
            </div>
            <div className="flex flex-col gap-3 min-w-60 text-right md:text-left">
              <div className="flex items-center gap-2 text-sm text-gray-600 justify-end md:justify-start">
                <ChevronRight size={16} className="text-blue-600" />
                <span>
                  Kết thúc trong <span className="text-gray-900 font-mono font-bold">{calculateTimeLeft(currentFeatured.endAt)}</span>
                </span>
              </div>
              <Button variant="primary" className="px-6 py-3 font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-2">
                Tham Gia Ngay
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Carousel Indicators */}
      {featuredRaffles.length > 0 && (
        <div className="flex items-center justify-center gap-3 pt-4">
          {featuredRaffles.map((_, index) => (
            <button key={index} onClick={() => setCarouselIndex(index)} className={`transition-all ${index === carouselIndex ? 'w-12 h-1.5 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]' : 'w-3 h-1.5 bg-gray-400/40 rounded-full hover:bg-gray-600/60'}`} />
          ))}
        </div>
      )}
    </section>
  )
}
