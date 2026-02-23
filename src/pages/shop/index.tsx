import Pagination from '@/components/Pagination'
import ShopFilterSection from '@/components/shop/ShopFilterSection'
import ShopProductCard, { ProductCardData } from '@/components/shop/ShopProductCard'
import ShopSearchBar from '@/components/shop/ShopSearchBar'
import { useAuth } from '@/context/Auth'
import useShop from '@/hook/useShop'
import { EnumSaleStatus, ICategory } from '@/interface/interface'
import useCategoryQuery from '@/react-query/shop/api/useCategoryQueries'
import { Base } from '@/templates/Base'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { CircularProgress } from '@mui/material'
import { SlidersHorizontal } from 'lucide-react'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'

const ShopPage = () => {
  const router = useRouter()
  const { status } = router.query
  const { isAuthenticated } = useAuth() as unknown as {
    isAuthenticated: boolean
  }

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9

  const { setMobileFiltersOpen, priceRange, searchQuery, sortOption, updateSearch } = useShop()

  const { data: categoryList, isLoading } = useCategoryQuery({
    status: status as string,
    isValidate: true,
  })

  // Transform category data to product card format
  const products: ProductCardData[] = useMemo(() => {
    if (!categoryList) return []
    return categoryList.map((category: ICategory) => ({
      id: category.categoryId || category.slug || '',
      name: category.categoryName,
      brand: category.brand || 'NoobStore',
      description: category.description,
      price: category.minPrice || 0,
      originalPrice: category.maxPrice !== category.minPrice ? category.maxPrice : undefined,
      rating: typeof category.rating === 'object' ? category.rating.star : 4.5,
      reviewCount: typeof category.rating === 'object' ? category.rating.rateMessages?.length || 0 : 0,
      images: category.images?.length ? category.images.map((img) => img.path) : [category.thumbnail?.path || '/images/placeholder.png'],
      status: mapStatus(category.status),
      isFavorited: false,
      slug: category.slug || '',
    }))
  }, [categoryList])

  // Map EnumSaleStatus to ProductCardData status
  function mapStatus(status: ICategory['status']): ProductCardData['status'] {
    switch (status) {
      case EnumSaleStatus.INSTOCK:
        return 'IN_STOCK'
      case EnumSaleStatus.OUTSTOCK:
        return 'SOLD_OUT'
      case EnumSaleStatus.GB:
        return 'PRE_ORDER'
      case EnumSaleStatus.TBD:
        return 'NEW'
      default:
        return undefined
    }
  }

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter((p) => p.name.toLowerCase().includes(query) || p.brand.toLowerCase().includes(query) || p.description?.toLowerCase().includes(query))
    }

    // Price filter
    result = result.filter((p) => p.price >= priceRange.min && p.price <= priceRange.max)

    // Sort
    switch (sortOption) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price_desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'newest':
        result.sort((a, b) => String(b.id).localeCompare(String(a.id)))
        break
      case 'popular':
      default:
        result.sort((a, b) => b.reviewCount - a.reviewCount)
        break
    }

    return result
  }, [products, searchQuery, priceRange, sortOption])

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleProductClick = (slug: string) => {
    router.push(`/product/${slug}`)
  }

  const handleFavoriteToggle = (id: string | number) => {
    // TODO: Implement favorite toggle
    console.log('Toggle favorite:', id)
  }

  return (
    <Base>
      <div className="max-w-screen-2xl mx-auto py-6 px-6 lg:px-8 relative z-1 min-h-[calc(100vh-280px-130px)]">
        {/* Main Content */}
        <div className="flex gap-6">
          {/* Filter Sidebar */}
          <ShopFilterSection />

          {/* Product Section */}
          <div className="flex-1 flex flex-col">
            {/* Search Bar + Sort + Results - above product grid */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-b border-slate-200 dark:border-slate-700 pb-4 mb-6">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors w-fit"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Bộ lọc
              </button>

              {/* Search Bar + Sort + Results */}
              <ShopSearchBar resultCount={filteredProducts.length} />
            </div>

            {/* Product Grid */}
            {isLoading ? (
              <div className="flex justify-center items-center w-full h-96">
                <CircularProgress size={32} />
              </div>
            ) : null}

            {!isLoading && filteredProducts.length === 0 ? (
              <div className="flex flex-col justify-center items-center w-full h-96 text-center">
                <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                  <MagnifyingGlassIcon className="w-12 h-12 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{!isAuthenticated ? 'Vui lòng đăng nhập' : 'Không tìm thấy sản phẩm'}</h3>
                <p className="text-slate-500 dark:text-slate-400">{!isAuthenticated ? 'Đăng nhập để xem sản phẩm' : 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'}</p>
                {isAuthenticated && searchQuery && (
                  <button onClick={() => updateSearch('')} className="mt-4 px-4 py-2 text-primary font-medium hover:bg-primary/10 rounded-lg transition-colors">
                    Xóa tìm kiếm
                  </button>
                )}
              </div>
            ) : null}

            {!isLoading && paginatedProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-x-4 gap-y-8">
                  {paginatedProducts.map((product) => (
                    <ShopProductCard key={product.id} product={product} onClick={handleProductClick} onFavoriteToggle={handleFavoriteToggle} />
                  ))}
                </div>

                {/* Pagination */}
                <div className="mt-8">
                  <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filteredProducts.length} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage} isLoading={isLoading} showInfo={false} />
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </Base>
  )
}

export default ShopPage
