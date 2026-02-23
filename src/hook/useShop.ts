import { EnumSaleStatus, ICategory } from '@/interface/interface'
import useCategoryQuery from '@/react-query/shop/api/useCategoryQueries'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useState } from 'react'

// Types
export interface FilterOption {
  value: string
  label: string
  checked: boolean
}

export interface FilterSection {
  id: string
  name: string
  options: FilterOption[]
  isExpanded?: boolean
}

export interface PriceRange {
  min: number
  max: number
}

export type SortOption = 'popular' | 'newest' | 'price_asc' | 'price_desc'

interface ShopFilters {
  status: string
  brands: string[]
  materials: string[]
  priceRange: PriceRange
  search: string
  sort: SortOption
}

// Filter sections configuration
const FILTER_SECTIONS: FilterSection[] = [
  {
    id: 'brand',
    name: 'Thương hiệu',
    isExpanded: true,
    options: [
      { value: 'keychron', label: 'Keychron', checked: false },
      { value: 'glorious', label: 'Glorious', checked: false },
      { value: 'akko', label: 'Akko', checked: false },
      { value: 'noobstore', label: 'NoobStore', checked: false },
    ],
  },
  {
    id: 'material',
    name: 'Chất liệu',
    isExpanded: false,
    options: [
      { value: 'pbt', label: 'PBT', checked: false },
      { value: 'abs', label: 'ABS', checked: false },
      { value: 'resin', label: 'Resin', checked: false },
    ],
  },
  {
    id: 'mounting',
    name: 'Kiểu lắp đặt',
    isExpanded: false,
    options: [
      { value: 'gasket', label: 'Gasket Mount', checked: false },
      { value: 'top', label: 'Top Mount', checked: false },
      { value: 'tray', label: 'Tray Mount', checked: false },
    ],
  },
]

export const SORT_OPTIONS = [
  { value: 'popular', label: 'Phổ biến' },
  { value: 'newest', label: 'Mới nhất' },
  { value: 'price_asc', label: 'Giá: Thấp đến Cao' },
  { value: 'price_desc', label: 'Giá: Cao đến Thấp' },
] as const

const DEFAULT_PRICE_RANGE: PriceRange = { min: 0, max: 5000000 }

const useShop = () => {
  const router = useRouter()
  const { status, search: querySearch, sort: querySort } = router.query

  // State
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [filterSections, setFilterSections] = useState<FilterSection[]>(FILTER_SECTIONS)
  const [priceRange, setPriceRange] = useState<PriceRange>(DEFAULT_PRICE_RANGE)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOption, setSortOption] = useState<SortOption>('popular')

  // Sync with URL query params
  useEffect(() => {
    if (querySearch && typeof querySearch === 'string') {
      setSearchQuery(querySearch)
    }
    if (querySort && typeof querySort === 'string') {
      setSortOption(querySort as SortOption)
    }
  }, [querySearch, querySort])

  // API Query
  const {
    data: categoryList,
    isLoading,
    refetch,
  } = useCategoryQuery({
    status: status as string,
    isValidate: true,
  })

  // Computed values
  const totalResults = useMemo(() => categoryList?.length || 0, [categoryList])

  const filteredProducts = useMemo(() => {
    if (!categoryList) return []

    let filtered = [...categoryList]

    // Filter by search
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase()
      filtered = filtered.filter((item: ICategory) => item.categoryName?.toLowerCase().includes(searchLower) || item.description?.toLowerCase().includes(searchLower) || item.brand?.toLowerCase().includes(searchLower))
    }

    // Filter by price range
    filtered = filtered.filter((item: ICategory) => {
      const price = item.minPrice || 0
      return price >= priceRange.min && price <= priceRange.max
    })

    // Sort
    switch (sortOption) {
      case 'newest':
        // Sort by dateStart or categoryId as proxy for creation date
        filtered.sort((a, b) => {
          const dateA = a.dateStart ? new Date(a.dateStart).getTime() : 0
          const dateB = b.dateStart ? new Date(b.dateStart).getTime() : 0
          return dateB - dateA
        })
        break
      case 'price_asc':
        filtered.sort((a, b) => (a.minPrice || 0) - (b.minPrice || 0))
        break
      case 'price_desc':
        filtered.sort((a, b) => (b.minPrice || 0) - (a.minPrice || 0))
        break
      default:
        // popular - keep original order or sort by rating
        filtered.sort((a, b) => (b.rating?.star || 0) - (a.rating?.star || 0))
    }

    return filtered
  }, [categoryList, searchQuery, priceRange, sortOption])

  // Actions
  const toggleMobileFilters = useCallback(() => {
    setMobileFiltersOpen((prev) => !prev)
  }, [])

  const closeMobileFilters = useCallback(() => {
    setMobileFiltersOpen(false)
  }, [])

  const toggleFilterSection = useCallback((sectionId: string) => {
    setFilterSections((prev) => prev.map((section) => (section.id === sectionId ? { ...section, isExpanded: !section.isExpanded } : section)))
  }, [])

  const toggleFilterOption = useCallback((sectionId: string, optionValue: string) => {
    setFilterSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              options: section.options.map((opt) => (opt.value === optionValue ? { ...opt, checked: !opt.checked } : opt)),
            }
          : section
      )
    )
  }, [])

  const updatePriceRange = useCallback((range: Partial<PriceRange>) => {
    setPriceRange((prev) => ({ ...prev, ...range }))
  }, [])

  const updateSearch = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  const updateSort = useCallback((sort: SortOption) => {
    setSortOption(sort)
  }, [])

  const resetFilters = useCallback(() => {
    setFilterSections(FILTER_SECTIONS)
    setPriceRange(DEFAULT_PRICE_RANGE)
    setSearchQuery('')
    setSortOption('popular')
    router.replace({ pathname: router.pathname, query: {} }, undefined, { shallow: true })
  }, [router])

  const applyFilters = useCallback(() => {
    const query: Record<string, string> = {}

    if (searchQuery) query.search = searchQuery
    if (sortOption !== 'popular') query.sort = sortOption

    router.replace({ pathname: router.pathname, query }, undefined, { shallow: true })
    closeMobileFilters()
  }, [router, searchQuery, sortOption, closeMobileFilters])

  const getActiveFiltersCount = useCallback(() => {
    let count = 0
    filterSections.forEach((section) => {
      count += section.options.filter((opt) => opt.checked).length
    })
    if (priceRange.min !== DEFAULT_PRICE_RANGE.min || priceRange.max !== DEFAULT_PRICE_RANGE.max) {
      count++
    }
    return count
  }, [filterSections, priceRange])

  return {
    // State
    mobileFiltersOpen,
    setMobileFiltersOpen,
    filterSections,
    priceRange,
    searchQuery,
    sortOption,
    isLoading,
    categoryList: filteredProducts,
    totalResults,

    // Actions
    toggleMobileFilters,
    closeMobileFilters,
    toggleFilterSection,
    toggleFilterOption,
    updatePriceRange,
    updateSearch,
    updateSort,
    resetFilters,
    applyFilters,
    getActiveFiltersCount,
    refetch,
  }
}

export default useShop
