import { EnumProductType, ICategory, IProduct, IProductOption } from '@/interface/interface'
import useProductQuery from '@/react-query/products/api/useProductQueries'
import Skeleton from '@mui/material/Skeleton'
import { useState } from 'react'
import { classNames } from '@/utils/AppConfig'
import ProductReviews from '../ProductReviews'
import { useAuth } from '@/context/Auth'
import { IAuthUser } from '@/interface/Context/auth'
import { ProductImageGallery, ProductDetailInfo, ProductDetailTabs } from '../productDetail'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface Props {
  slug: string
}

const ProductCard = ({ slug }: Props) => {
  const { isAuthenticated = false } = useAuth() as unknown as {
    user: IAuthUser | null
    isAuthenticated: boolean
  }
  const { data: productData, isFetching: isLoading } = useProductQuery(
    { categoryId: slug as string },
    {
      enabled: !!slug,
    }
  )

  const { categoryDetail, products, productOptions } = productData || {
    categoryDetail: {} as ICategory,
    products: [],
    productOptions: {},
  }
  const { images = [], brand, categoryName, collapseContent, description } = categoryDetail || {}

  const [selectedOpt, setSelectedOpt] = useState<Record<EnumProductType, IProductOption[]>>(() => {
    const initialSelectedOpt = {} as Record<EnumProductType, IProductOption[]>
    if (products instanceof Array && products.length === 0) {
      products?.forEach((product: IProduct) => {
        product?.productOpts?.forEach((opt) => {
          if (opt.productPart) {
            if (!initialSelectedOpt[opt.productPart]) {
              initialSelectedOpt[opt.productPart] = []
            } else {
              initialSelectedOpt[opt.productPart].push(opt)
            }
          }
        })
      })
    }

    return initialSelectedOpt
  })

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <SkeletonBlock className="w-full h-150 rounded-xl" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
        <Link href="/" className="hover:text-primary transition-colors">
          Trang chủ
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/shop" className="hover:text-primary transition-colors">
          Shop
        </Link>
        {brand && (
          <>
            <ChevronRight className="w-4 h-4" />
            <Link href={`/shop?brand=${brand}`} className="hover:text-primary transition-colors">
              {brand}
            </Link>
          </>
        )}
        <ChevronRight className="w-4 h-4" />
        <span className="text-slate-900 dark:text-white font-medium truncate max-w-50">{categoryName}</span>
      </nav>

      {/* Main Product Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
        {/* Product Header: Image + Info */}
        <div className="flex flex-col lg:flex-row">
          {/* Image Gallery */}
          <ProductImageGallery images={images || []} status={categoryDetail?.status} productName={categoryName || ''} />

          {/* Product Info */}
          <ProductDetailInfo category={categoryDetail as ICategory} products={products} productOptions={productOptions as Record<EnumProductType, IProductOption[]>} selectedOpt={selectedOpt} setSelectedOpt={setSelectedOpt} />
        </div>

        {/* Product Tabs */}
        <ProductDetailTabs description={description} collapseContent={collapseContent} brand={brand} />
      </div>

      {/* Reviews Section */}
      <div className="mt-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm p-6 lg:p-10">
        <ProductReviews productId={productData?.categoryDetail?.categoryId || ''} canReview={isAuthenticated} />
      </div>
    </div>
  )
}

export default ProductCard

export function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div className={classNames(className || '', 'w-full h-full')}>
      <Skeleton variant="rectangular" width="100%" height="100%" animation="wave" />
    </div>
  )
}
