import { mapCategoryStatus, RCategoryType } from '@/constants'
import { EnumProductType, ICategory, IProduct, IProductOption } from '@/interface/interface'
import { useAddToCartMutation } from '@/react-query/cart/api/useAddToCartMutation'
import { formatCurrency } from '@/utils/FormatNumber'
import useStoreProductDetail, { useStoreProductDetailAction } from '@/zustand/useProductDetail'
import { CircularProgress } from '@mui/material'
import { Dot, Heart, ShoppingCart } from 'lucide-react'
import { Dispatch, SetStateAction, useMemo, useState } from 'react'
import InputQuantity from '../InputQuatity'
import ItemSelectGroupBlock from '../ItemSelectGroupBlock'
import RatingComponent from '../productCard/rating'

interface ProductDetailInfoProps {
  category: ICategory
  products: IProduct[]
  productOptions: Record<EnumProductType, IProductOption[]>
  selectedOpt: Record<EnumProductType, IProductOption[]>
  setSelectedOpt: Dispatch<SetStateAction<Record<EnumProductType, IProductOption[]>>>
}

const ProductDetailInfo = ({ category, products, productOptions, selectedOpt, setSelectedOpt }: ProductDetailInfoProps) => {
  const { currentQuantity, triggerResetQuantity } = useStoreProductDetail()
  const { toggleResetQuantity } = useStoreProductDetailAction()
  const handleAddToCart = useAddToCartMutation()
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [showSpecs, setShowSpecs] = useState(false)
  const { rating, brand, categoryName, description, minPrice, maxPrice, status, salePrice, collapseContent, author } = category || {}

  console.log('selectedOpt', selectedOpt)

  // Calculate total price
  const totalPriceCurrentOpt = useMemo(() => {
    const basePrice = products?.reduce((acc, product) => {
      return acc + (product.salePrice || product.basePrice || 0)
    }, 0)

    const selectedPrice = selectedOpt
      ? Object.values(selectedOpt)?.reduce((acc, options) => {
          return acc + options.reduce((optAcc, option) => optAcc + (option.price || 0), 0)
        }, 0)
      : 0

    return basePrice + selectedPrice
  }, [products, selectedOpt])

  // Calculate max quantity for selected options
  const maxQuantityCurrentOpt = useMemo(() => {
    const totalProduct = products && products?.length
    const quantityAllProductOpt =
      selectedOpt &&
      Object.entries(selectedOpt)?.map(([_, option]) => {
        const dataOption = option?.[0]
        return dataOption?.quantity || undefined
      })

    if (totalProduct === quantityAllProductOpt?.length) {
      return Math.min(...quantityAllProductOpt?.filter((item): item is number => item !== undefined))
    }

    return null
  }, [selectedOpt, products])

  // Build products with selected options for cart
  const productsWithSelectedOpt: IProductOption[] = useMemo(() => {
    if (Object.keys(selectedOpt)?.length === 0 || Object.keys(selectedOpt)?.length < products?.length) return []

    return (
      products.map((product) => ({
        productId: product.productId,
        productName: product.productName,
        replaceProductName: product?.replaceProductName,
        price: product?.salePrice || product?.basePrice,
        categoryId: product?.categoryId,
        productPart: product?.productPart,
        productOptions: selectedOpt?.[product?.productPart] || [],
        quantity: currentQuantity || 0,
      })) || []
    )
  }, [selectedOpt, products, currentQuantity])

  const isOutOfStock = maxQuantityCurrentOpt === 0
  const canAddToCart = maxQuantityCurrentOpt !== null && maxQuantityCurrentOpt > 0 && productsWithSelectedOpt?.length >= products?.length

  // Calculate discount percentage if salePrice exists
  const discountPercent = useMemo(() => {
    if (salePrice && minPrice && salePrice < minPrice) {
      return Math.round(((minPrice - salePrice) / minPrice) * 100)
    }
    return 0
  }, [salePrice, minPrice])

  // Display price logic
  const displayPrice = totalPriceCurrentOpt > 0 ? totalPriceCurrentOpt : salePrice || minPrice
  const originalPrice = salePrice && salePrice < minPrice ? minPrice : null

  return (
    <div className="w-full lg:w-1/2 p-4 lg:p-8 flex flex-col h-full gap-4">
      {/* Header: Brand, Series & Rating */}
      <div className="relative clear-both">
        <div className="flex items-center gap-0.5">
          <a className="text-sm font-bold uppercase tracking-wider hover:underline cursor-pointer text-orange-600" href="#">
            {brand || author}
          </a>
          <Dot className="text-gray-300 scale-150" />
          <a className="text-sm font-bold uppercase tracking-widest hover:underline cursor-pointer text-gray-600" href="#">
            {RCategoryType[category.type]}
          </a>
        </div>

        {/* Product Name */}
        <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight">{categoryName}</div>

        {/* Rating & Status */}
        <div className="flex items-center gap-4 flex-wrap">
          <RatingComponent star={rating?.star || 0} />
          <span className="w-px h-4 bg-gray-300" />
          <div className={`${mapCategoryStatus[status]?.bgColor} bg-primary/10 px-2 py-0.5 rounded text-sm font-medium ${mapCategoryStatus[status]?.color}`}>{mapCategoryStatus[status]?.label}</div>
        </div>
      </div>

      {/* Price Section */}
      <div className="clear-both relative">
        <div className="flex items-center gap-3 mb-2 relative">
          <span className="text-2xl font-bold text-gray-900">{formatCurrency(displayPrice)}</span>
          {originalPrice ? <span className="text-lg text-gray-500 line-through decoration-orange-400">{formatCurrency(originalPrice || 0)}</span> : null}
          {discountPercent > 0 && <span className="text-sm font-bold bg-red-100 text-orange-600 px-2 py-0.5 rounded">-{discountPercent}%</span>}
        </div>
        <p className="text-gray-500 text-sm">Miễn phí vận chuyển cho đơn hàng trên 500k</p>
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-gray-200" />

      {/* Options */}
      <div className="flex flex-col gap-6 mb-8">
        {products &&
          products?.map((product) => {
            const selectedOption = selectedOpt?.[product?.productPart]?.[0]
            return <ItemSelectGroupBlock product={product} productOptions={productOptions[product.productPart]} selectedOpt={selectedOpt} setSelectedOpt={setSelectedOpt} toggleResetQuantity={toggleResetQuantity} />
          })}
      </div>

      {/* Quantity & Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {maxQuantityCurrentOpt != null && (
          <div className="flex flex-col gap-2">
            <InputQuantity triggerResetQuantity={triggerResetQuantity} maxQuantity={maxQuantityCurrentOpt || 0} />
            {maxQuantityCurrentOpt && maxQuantityCurrentOpt < 10 && <span className="text-xs text-gray-500">Còn lại {maxQuantityCurrentOpt} sản phẩm</span>}
          </div>
        )}
        <button
          onClick={() =>
            handleAddToCart.mutate({
              payload: {
                products: productsWithSelectedOpt || [],
              },
            })
          }
          disabled={!canAddToCart || handleAddToCart.isPending}
          className="flex-1 h-12 bg-primary hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2"
        >
          {handleAddToCart.isPending ? (
            <CircularProgress size={20} style={{ color: 'white' }} />
          ) : (
            <>
              <ShoppingCart className="w-5 h-5" />
              {productsWithSelectedOpt?.length < products?.length ? 'Vui lòng chọn option' : 'Thêm vào giỏ'}
            </>
          )}
        </button>
        <button className="h-12 w-12 border border-gray-300 rounded-xl flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary hover:bg-primary/5 transition-all">
          <Heart className="w-6 h-6" />
        </button>
      </div>

      {/* Description Box */}
      {description && (
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 mb-6">
          <h3 className="font-bold text-gray-900 mb-2">Mô tả sản phẩm</h3>
          <p className={`text-gray-500 text-sm leading-relaxed ${!showFullDescription ? 'line-clamp-3' : ''}`}>{description}</p>
          {description.length > 150 && (
            <button onClick={() => setShowFullDescription(!showFullDescription)} className="text-primary text-sm font-bold hover:underline flex items-center gap-1 mt-2">
              {showFullDescription ? 'Thu gọn' : 'Xem thêm'}
              <svg className={`w-4 h-4 transition-transform ${showFullDescription ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
        </div>
      )}

      {/* Technical Specifications */}
      {collapseContent && collapseContent.length > 0 && (
        <div>
          <button onClick={() => setShowSpecs(!showSpecs)} className="w-full flex justify-between items-center mb-3 group">
            <h3 className="font-bold text-gray-900">Thông số kỹ thuật</h3>
            <svg className={`w-5 h-5 text-gray-500 group-hover:text-primary transition-all ${showSpecs ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showSpecs && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 text-sm">
              {collapseContent.map((item, index) => (
                <div key={index} className="flex flex-col justify-start border-b border-dashed border-gray-200 gap-2 pb-4">
                  <span className="text-gray-500 text-left text-base">{item.title}</span>
                  <span className="font-medium text-gray-900 text-left max-h-64 overflow-y-auto">{item.content}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ProductDetailInfo
