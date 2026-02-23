import { Star } from 'lucide-react'

import { useRafflesContext } from '@/context/RafflesContext'
import { RaffleCard } from './RaffleCard'

export const FeaturedArtistsSection = () => {
  const { featuredRaffles } = useRafflesContext()

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Star size={18} className="text-yellow-400" /> Nghệ Sĩ Nổi Bật
        </h2>
        <a href="#" className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors">
          Xem Tất Cả Nổi Bật
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {featuredRaffles.map((raffle) => (
          <RaffleCard key={raffle.raffleId} raffle={raffle} isFeatured />
        ))}
      </div>
    </section>
  )
}
