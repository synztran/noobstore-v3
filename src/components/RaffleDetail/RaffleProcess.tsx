import { IBEResponseRaffleInfo } from '@/interface/Client/Raffle'
import Image from 'next/image'

interface RaffleProcessProps {
  raffle: IBEResponseRaffleInfo
  galleryImages?: { path: string; alt: string }[]
}

export const RaffleProcess = ({ raffle, galleryImages = [] }: RaffleProcessProps) => {
  const displayImages = galleryImages.slice(0, 4)

  return (
    <section>
      <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 flex items-center gap-3">⚗️ Quy Trình Tạo Tác</h3>
      <p className="text-sm md:text-base text-slate-600 mb-8 leading-relaxed max-w-2xl">Từ bước điêu khắc ban đầu đến bước đánh bóng cuối cùng, chứng kiến hành quả của bộ series Ether-Glow. Phương pháp đúc hai lần đảm bảo lõi nebula được giữ nguyên vẹn trong vẻ nhựa trong suốt.</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {displayImages.length > 0 ? (
          displayImages.map((img, idx) => (
            <div key={idx} className="space-y-2 group cursor-pointer">
              <div className="aspect-square rounded-xl overflow-hidden border border-slate-200 hover:border-amber-400/60 transition-all relative shadow-sm">
                <Image src={img.path} alt={img.alt} fill className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] md:text-xs font-bold text-slate-900 uppercase tracking-wider">{['Chạm Khắc', 'Tạo Khuôn', 'Đúc Hình', 'Đánh Bóng'][idx]}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-4 text-center text-slate-500 py-8">No process images available</div>
        )}
      </div>
    </section>
  )
}
