import { EnumProductType, EnumSaleStatus, ICategory, IProduct, IProductOption } from '@/interface/interface'
import { useAddToCartMutation } from '@/react-query/cart/api/useAddToCartMutation'
import { formatCurrency } from '@/utils/FormatNumber'
import useStoreProductDetail, { useStoreProductDetailAction } from '@/zustand/useProductDetail'
import { CircularProgress } from '@mui/material'
import { Heart, Minus, Plus, ShoppingCart, Star, Truck, ShieldCheck } from 'lucide-react'
import { Dispatch, SetStateAction, useMemo } from 'react'
import InputQuantity from '../InputQuatity'
import ItemSelectGroupBlock from '../ItemSelectGroupBlock'

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
  const { rating, brand, categoryName, description, minPrice, maxPrice, status } = category || {}

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

  const isInStock = status === EnumSaleStatus.INSTOCK
  const isOutOfStock = maxQuantityCurrentOpt === 0
  const canAddToCart = maxQuantityCurrentOpt !== null && maxQuantityCurrentOpt > 0 && productsWithSelectedOpt?.length >= products?.length

  return (
    <div className="w-full lg:w-2/5 p-6 lg:p-10 flex flex-col gap-6 bg-white dark:bg-slate-900">
      {/* Header: Brand & Rating */}
      <div>
        <div className="flex justify-between items-start mb-2">
          {brand && <span className="text-primary text-sm font-bold uppercase tracking-wide hover:underline cursor-pointer">{brand}</span>}
          <div className="flex items-center gap-1 text-amber-500 text-sm">
            <Star className="w-4 h-4 fill-current" />
            <span className="font-bold text-slate-900 dark:text-white ml-1">{rating?.star?.toFixed(1) || '0.0'}</span>
            <span className="text-slate-500 dark:text-slate-400 text-xs">({rating?.rateMessages?.length || 0} đánh giá)</span>
          </div>
        </div>

        {/* Product Name */}
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white leading-tight mb-2">{categoryName}</h1>

        {/* Price */}
        <div className="flex items-baseline gap-3 mb-4">
          <span className="text-2xl font-bold text-slate-900 dark:text-white">{totalPriceCurrentOpt > 0 ? formatCurrency(totalPriceCurrentOpt) : `${formatCurrency(minPrice)} ${maxPrice > 0 && maxPrice !== minPrice ? `- ${formatCurrency(maxPrice)}` : ''}`}</span>
          {/* Status Badge */}
          {status === EnumSaleStatus.INSTOCK && <span className="text-xs font-bold text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded">Còn hàng</span>}
          {status === EnumSaleStatus.OUTSTOCK && <span className="text-xs font-bold text-red-600 bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded">Hết hàng</span>}
          {status === EnumSaleStatus.GB && <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">Group Buy</span>}
        </div>

        {/* Description */}
        {description && <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-3">{description}</p>}
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-slate-200 dark:bg-slate-700" />

      {/* Options */}
      <div className="flex flex-col gap-4">
        {products &&
          products?.map((product) => (
            <div key={product.productId} className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">{product.productName}</label>
              <ItemSelectGroupBlock product={product} productOptions={productOptions[product.productPart]} selectedOpt={selectedOpt} setSelectedOpt={setSelectedOpt} toggleResetQuantity={toggleResetQuantity} />
            </div>
          ))}

        {/* Quantity */}
        {maxQuantityCurrentOpt != null && (
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Số lượng</label>
            <div className="flex items-center gap-3">
              <InputQuantity triggerResetQuantity={triggerResetQuantity} maxQuantity={maxQuantityCurrentOpt || 0} />
              {maxQuantityCurrentOpt && maxQuantityCurrentOpt < 10 && <span className="text-sm text-slate-500 dark:text-slate-400">Còn lại {maxQuantityCurrentOpt} sản phẩm</span>}
            </div>
          </div>
        )}
      </div>

      {/* Stock Status */}
      {Object.keys(selectedOpt)?.length > 0 && (
        <div className="flex items-center gap-2 text-sm font-medium">
          {isOutOfStock ? (
            <>
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-red-500">Sản phẩm hết hàng</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-green-600 dark:text-green-400">Sản phẩm còn hàng</span>
            </>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="mt-auto pt-6 flex gap-3">
        <button
          onClick={() =>
            handleAddToCart.mutate({
              payload: {
                products: productsWithSelectedOpt || [],
              },
            })
          }
          disabled={!canAddToCart || handleAddToCart.isPending}
          className="flex-1 bg-primary hover:bg-primary/90 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3.5 px-6 rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:hover:translate-y-0 disabled:hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          {handleAddToCart.isPending ? (
            <CircularProgress size={20} style={{ color: 'white' }} />
          ) : (
            <>
              <ShoppingCart className="w-5 h-5" />
              {productsWithSelectedOpt?.length < products?.length ? (
                'Vui lòng chọn option'
              ) : (
                <>
                  Thêm vào giỏ
                  {totalPriceCurrentOpt > 0 && currentQuantity > 0 && <span className="ml-1">• {formatCurrency(totalPriceCurrentOpt * currentQuantity)}</span>}
                </>
              )}
            </>
          )}
        </button>
        <button className="w-14 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:border-primary text-slate-400 hover:text-primary rounded-lg flex items-center justify-center transition-all group">
          <Heart className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Shipping Info */}
      <div className="flex items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400 mt-2">
        <div className="flex items-center gap-1.5">
          <Truck className="w-4 h-4" />
          <span>Miễn phí ship trên 500k</span>
        </div>
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4" />
          <span>Bảo hành 1 năm</span>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailInfo
