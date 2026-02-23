import { useRafflesContext, RafflesProvider } from '@/context/RafflesContext'
import { Base } from '@/templates/Base'
import { FeaturedArtistsSection } from './FeaturedArtistsSection'
import { HotPopularCarousel } from './HotPopularCarousel'
import { LiveRafflesSection } from './LiveRafflesSection'
import { RaffleFilters } from './RaffleFilters'

const RafflesPageContent = () => {
  const { isLoading } = useRafflesContext()

  // Loading state
  if (isLoading) {
    return (
      <Base>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-gray-600">Đang tải...</div>
        </div>
      </Base>
    )
  }

  return (
    <Base>
      <div className="min-h-screen bg-gray-50">
        {/* Hot & Popular Carousel Section */}
        <HotPopularCarousel />

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <RaffleFilters />

          {/* Main Content Area */}
          <main className="flex-1 min-w-0 space-y-4">
            {/* Featured Section */}
            <FeaturedArtistsSection />

            {/* Live Raffles Section */}
            <LiveRafflesSection />
          </main>
        </div>
      </div>
    </Base>
  )
}

export default function RafflesPage() {
  return (
    <RafflesProvider>
      <RafflesPageContent />
    </RafflesProvider>
  )
}
