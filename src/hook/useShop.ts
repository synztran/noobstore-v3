import { ProductCardData } from '@/components/shop/ShopProductCard'
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

export enum EnumSortOption {
  POPULAR = 'POPULAR',
  NEWEST = 'NEWEST',
  PRICE_ASC = 'PRICE_ASC',
  PRICE_DESC = 'PRICE_DESC',
  RATING_DESC = 'RATING_DESC',
  RATING_ASC = 'RATING_ASC',
}

export type SortOption = EnumSortOption

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

export const SORT_OPTIONS: { value: EnumSortOption; label: string }[] = [
  { value: EnumSortOption.POPULAR, label: 'Phổ biến' },
  { value: EnumSortOption.NEWEST, label: 'Mới nhất' },
  { value: EnumSortOption.PRICE_ASC, label: 'Giá: Thấp đến Cao' },
  { value: EnumSortOption.PRICE_DESC, label: 'Giá: Cao đến Thấp' },
  { value: EnumSortOption.RATING_DESC, label: 'Đánh giá: Cao đến Thấp' },
  { value: EnumSortOption.RATING_ASC, label: 'Đánh giá: Thấp đến Cao' },
] as const

const DEFAULT_PRICE_RANGE: PriceRange = { min: 0, max: 5000000 }

function mapCategoryStatus(status: ICategory['status']): ProductCardData['status'] {
  switch (status) {
    case EnumSaleStatus.INSTOCK:
      return 'IN_STOCK'
    case EnumSaleStatus.OUTSTOCK:
      return 'SOLD_OUT'
    case EnumSaleStatus.GB:
    case EnumSaleStatus.GROUPBUY:
      return 'PRE_ORDER'
    case EnumSaleStatus.TBD:
      return 'NEW'
    default:
      return undefined
  }
}

const useShop = () => {
  const router = useRouter()
  const { status, search: querySearch, sort: querySort } = router.query

  // State
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [filterSections, setFilterSections] = useState<FilterSection[]>(FILTER_SECTIONS)
  const [priceRange, setPriceRange] = useState<PriceRange>(DEFAULT_PRICE_RANGE)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOption, setSortOption] = useState<SortOption>(EnumSortOption.POPULAR)

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
    data: categoryQueryResult,
    isLoading,
    refetch,
  } = useCategoryQuery({
    status: status as string,
    isValidate: true,
  })

  const categoryList = categoryQueryResult?.items ?? []

  // Transform ICategory → ProductCardData
  const products = useMemo<ProductCardData[]>(
    () =>
      categoryList.map((category) => ({
        id: category.categoryId || category.slug || '',
        name: category.categoryName,
        brand: category.brand || category.author || 'NoobStore',
        description: category.description,
        price: category.minPrice || category.maxPrice || 0,
        // originalPrice: category.maxPrice !== category.minPrice ? category.maxPrice : undefined,
        rating: typeof category.rating === 'object' ? category.rating.star : 4.5,
        reviewCount: typeof category.rating === 'object' ? category.rating.rateMessages?.length || 0 : 0,
        images: category.images?.length ? category.images.map((img) => img.path) : [category.thumbnail?.path || '/images/placeholder.png'],
        status: mapCategoryStatus(category.status),
        isFavorited: false,
        slug: category.slug || '',
        salePrice: category.salePrice || 0,
        salePricePercent: category.salePricePercent || 0,
      })),
    [categoryList]
  )

  // Computed values
  const totalResults = useMemo(() => products.length, [products])

  const filteredProducts = useMemo(() => {
    if (!products.length) return []

    let filtered = [...products]

    // Filter by search
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase()
      filtered = filtered.filter((item) => item.name?.toLowerCase().includes(searchLower) || item.description?.toLowerCase().includes(searchLower) || item.brand?.toLowerCase().includes(searchLower))
    }

    // Filter by price range
    filtered = filtered.filter((item) => item.price >= priceRange.min && item.price <= priceRange.max)

    // Sort
    switch (sortOption) {
      case EnumSortOption.NEWEST:
        filtered.sort((a, b) => String(b.id).localeCompare(String(a.id)))
        break
      case EnumSortOption.PRICE_ASC:
        filtered.sort((a, b) => a.price - b.price)
        break
      case EnumSortOption.PRICE_DESC:
        filtered.sort((a, b) => b.price - a.price)
        break
      case EnumSortOption.RATING_DESC:
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case EnumSortOption.RATING_ASC:
        filtered.sort((a, b) => (a.rating || 0) - (b.rating || 0))
        break
      default:
        // popular — sort by review count
        filtered.sort((a, b) => b.reviewCount - a.reviewCount)
    }

    return filtered
  }, [products, searchQuery, priceRange, sortOption])

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
    setSortOption(EnumSortOption.POPULAR)
    router.replace({ pathname: router.pathname, query: {} }, undefined, { shallow: true })
  }, [router])

  const applyFilters = useCallback(() => {
    const query: Record<string, string> = {}

    if (searchQuery) query.search = searchQuery
    if (sortOption !== EnumSortOption.POPULAR) query.sort = sortOption

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
