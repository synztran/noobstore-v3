import { useEffect, useMemo, useRef, useState } from 'react'

import { IBEResponseRaffleInfo } from '@/interface/Client/Raffle'
import useRafflesQuery from '@/react-query/raffles/api/useRafflesQueries'

// Helper function to get price from raffle
export const getRafflePrice = (raffle: IBEResponseRaffleInfo): number => {
  return raffle.productOptions?.[0]?.price || raffle.entryPrice || 0
}

// Helper function to calculate price range bounds from raffles list
export const getPriceRangeBounds = (raffles: IBEResponseRaffleInfo[], defaultMin = 0, defaultMax = 500): [number, number] => {
  if (!raffles?.length) return [defaultMin, defaultMax]

  const prices = raffles.map(getRafflePrice).filter((price) => price > 0)

  if (prices.length === 0) return [defaultMin, defaultMax]

  const minPrice = Math.floor(Math.min(...prices))
  const maxPrice = Math.ceil(Math.max(...prices))

  return [minPrice, maxPrice]
}

// Helper function to calculate time left
export const calculateTimeLeft = (endAt: Date | string): string => {
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

const ITEMS_PER_PAGE = 6

export interface UseRafflesPageReturn {
  // Filter states
  selectedArtists: string[]
  setSelectedArtists: React.Dispatch<React.SetStateAction<string[]>>
  selectedSculptTypes: string[]
  setSelectedSculptTypes: React.Dispatch<React.SetStateAction<string[]>>
  filterEndingSoon: boolean
  setFilterEndingSoon: React.Dispatch<React.SetStateAction<boolean>>
  filterRecentlyAdded: boolean
  setFilterRecentlyAdded: React.Dispatch<React.SetStateAction<boolean>>
  filterWaitlist: boolean
  setFilterWaitlist: React.Dispatch<React.SetStateAction<boolean>>
  priceRange: [number, number]
  setPriceRange: React.Dispatch<React.SetStateAction<[number, number]>>

  // Search & Sort states
  searchQuery: string
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>
  sortBy: string
  setSortBy: React.Dispatch<React.SetStateAction<string>>

  // Pagination states
  currentPage: number
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
  totalPages: number
  itemsPerPage: number

  // Carousel states
  carouselIndex: number
  setCarouselIndex: React.Dispatch<React.SetStateAction<number>>

  // Query states
  isLoading: boolean
  isFetching: boolean

  // Computed data
  raffles: IBEResponseRaffleInfo[]
  pagination: { page: number; total: number; totalPage: number }
  featuredRaffles: IBEResponseRaffleInfo[]
  availableArtists: string[]
  paginatedRaffles: IBEResponseRaffleInfo[]
  currentFeatured: IBEResponseRaffleInfo | null
  priceRangeBounds: [number, number]

  // Handlers
  handleClearFilters: () => void
  handleCarouselNext: () => void
  handleCarouselPrev: () => void
  handlePageChange: (page: number) => void
  handleSearchChange: (value: string) => void
  handleSortChange: (value: string) => void
}

export default function useRafflesPage(): UseRafflesPageReturn {
  // Filter states
  const [selectedArtists, setSelectedArtists] = useState<string[]>([])
  const [selectedSculptTypes, setSelectedSculptTypes] = useState<string[]>([])
  const [filterEndingSoon, setFilterEndingSoon] = useState(false)
  const [filterRecentlyAdded, setFilterRecentlyAdded] = useState(false)
  const [filterWaitlist, setFilterWaitlist] = useState(false)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0])

  // Search & Sort states
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('Kết Thúc Sớm')

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)

  // Carousel states
  const [carouselIndex, setCarouselIndex] = useState(0)

  // Server-side pagination query
  const {
    data: rafflesResponse,
    isPending: isLoading,
    isFetching,
  } = useRafflesQuery({
    params: {
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      search: searchQuery || undefined,
      sortBy: sortBy,
    },
  })

  const raffles = rafflesResponse?.data || []
  const pagination = rafflesResponse?.pagination || { page: 1, total: 0, totalPage: 0 }
  const totalPages = pagination.totalPage

  // Get featured raffles (filter by featured or first 2 ongoing)
  const featuredRaffles = useMemo(() => {
    if (!raffles?.length) return []
    const featured = raffles.filter((r) => r.featured && r.status === 'ONGOING')
    if (featured.length >= 2) return featured.slice(0, 2)
    // Fallback to first 2 ongoing raffles
    return raffles.filter((r) => r.status === 'ONGOING').slice(0, 2)
  }, [raffles])

  // Extract unique artists from raffles data
  const availableArtists = useMemo(() => {
    const artistNames = raffles.map((r) => r.makerInfo?.brandName).filter((name): name is string => Boolean(name))
    return Array.from(new Set(artistNames))
  }, [raffles])

  // Calculate price range bounds from API data
  const priceRangeBounds = useMemo(() => getPriceRangeBounds(raffles), [raffles])

  // Track if price range has been initialized from API data
  const isPriceRangeInitialized = useRef(false)

  // Initialize price range from API data on first load
  useEffect(() => {
    if (!isPriceRangeInitialized.current && raffles.length > 0) {
      setPriceRange(priceRangeBounds)
      isPriceRangeInitialized.current = true
    }
  }, [raffles.length])

  // Get live raffles (excluding featured)
  const liveRaffles = useMemo(() => {
    if (!raffles?.length) return []
    const featuredIds = featuredRaffles.map((r) => r.raffleId)
    return raffles.filter((r) => !featuredIds.includes(r.raffleId))
  }, [raffles, featuredRaffles])

  // Filter and sort logic
  const filteredAndSortedRaffles = useMemo(() => {
    let filtered = liveRaffles.filter((raffle) => {
      // Search filter
      const matchesSearch = raffle.title.toLowerCase().includes(searchQuery.toLowerCase()) || raffle.makerInfo?.brandName?.toLowerCase().includes(searchQuery.toLowerCase())

      // Price filter
      const rafflePrice = getRafflePrice(raffle)
      const matchesPrice = rafflePrice >= priceRange[0] && rafflePrice <= priceRange[1]

      // Artist filter (multiple selection)
      const matchesArtist = selectedArtists.length === 0 || selectedArtists.includes(raffle.makerInfo?.brandName || '')

      // Sculpt type filter (multiple selection)
      const matchesSculptType = selectedSculptTypes.length === 0

      // Time filter - ending soon (less than 2 hours)
      const timeLeftMs = new Date(raffle.endAt).getTime() - Date.now()
      const matchesEndingSoon = !filterEndingSoon || (timeLeftMs > 0 && timeLeftMs < 2 * 60 * 60 * 1000)

      // Recently added (within 24 hours)
      const isRecentlyAdded = Date.now() - new Date(raffle.startAt).getTime() < 24 * 60 * 60 * 1000
      const matchesRecentlyAdded = !filterRecentlyAdded || isRecentlyAdded

      const matchesWaitlist = !filterWaitlist

      return matchesSearch && matchesPrice && matchesArtist && matchesSculptType && matchesEndingSoon && matchesRecentlyAdded && matchesWaitlist
    })

    // Sorting logic (client-side for local filters)
    const sorted = [...filtered].sort((a, b) => {
      const priceA = getRafflePrice(a)
      const priceB = getRafflePrice(b)

      switch (sortBy) {
        case 'Giá: Thấp đến Cao':
          return priceA - priceB
        case 'Giá: Cao đến Thấp':
          return priceB - priceA
        case 'Mới Nhất':
          return new Date(b.startAt).getTime() - new Date(a.startAt).getTime()
        case 'Kết Thúc Sớm':
        default:
          return new Date(a.endAt).getTime() - new Date(b.endAt).getTime()
      }
    })

    return sorted
  }, [liveRaffles, searchQuery, selectedArtists, selectedSculptTypes, priceRange, filterEndingSoon, filterRecentlyAdded, filterWaitlist, sortBy])

  // Current featured raffle for carousel
  const currentFeatured = featuredRaffles[carouselIndex] || null

  // Use server pagination data directly
  const paginatedRaffles = filteredAndSortedRaffles

  // Handlers
  const handleClearFilters = () => {
    setSelectedArtists([])
    setSelectedSculptTypes([])
    setFilterEndingSoon(false)
    setFilterRecentlyAdded(false)
    setFilterWaitlist(false)
    setPriceRange(priceRangeBounds)
    setSearchQuery('')
    setCurrentPage(1)
  }

  const handleCarouselNext = () => {
    if (featuredRaffles.length === 0) return
    setCarouselIndex((prev) => (prev + 1) % featuredRaffles.length)
  }

  const handleCarouselPrev = () => {
    if (featuredRaffles.length === 0) return
    setCarouselIndex((prev) => (prev === 0 ? featuredRaffles.length - 1 : prev - 1))
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages || 1)))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    setCurrentPage(1)
  }

  return {
    // Filter states
    selectedArtists,
    setSelectedArtists,
    selectedSculptTypes,
    setSelectedSculptTypes,
    filterEndingSoon,
    setFilterEndingSoon,
    filterRecentlyAdded,
    setFilterRecentlyAdded,
    filterWaitlist,
    setFilterWaitlist,
    priceRange,
    setPriceRange,

    // Search & Sort states
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,

    // Pagination states
    currentPage,
    setCurrentPage,
    totalPages,
    itemsPerPage: ITEMS_PER_PAGE,

    // Carousel states
    carouselIndex,
    setCarouselIndex,

    // Query states
    isLoading,
    isFetching,

    // Computed data
    raffles,
    pagination,
    featuredRaffles,
    availableArtists,
    paginatedRaffles,
    currentFeatured,
    priceRangeBounds,

    // Handlers
    handleClearFilters,
    handleCarouselNext,
    handleCarouselPrev,
    handlePageChange,
    handleSearchChange,
    handleSortChange,
  }
}
