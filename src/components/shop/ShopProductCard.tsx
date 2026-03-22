import { NEW_MISSING_IMAGE } from '@/constants/Images'
import { formatCurrency } from '@/utils/FormatNumber'
import { Heart, Star } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { Button } from '../ReUIComponent'

export interface ProductCardData {
  id: string | number
  name: string
  brand: string
  description?: string
  price: number
  // originalPrice?: number
  rating: number
  reviewCount: number
  images: string[]
  status?: 'NEW' | 'IN_STOCK' | 'PRE_ORDER' | 'SOLD_OUT'
  isFavorited?: boolean
  slug: string
  salePrice?: number
  salePricePercent?: number
}

interface Props {
  product: ProductCardData
  onFavoriteToggle?: (id: string | number) => void
  onClick?: (id: string | number) => void
}

const statusConfig = {
  NEW: { label: 'MỚI', className: 'bg-emerald-500 text-white' },
  IN_STOCK: { label: 'CÒN HÀNG', className: 'bg-blue-500 text-white' },
  PRE_ORDER: { label: 'GROUP BUY', className: 'bg-primary text-white' },
  SOLD_OUT: { label: 'Hết hàng', className: 'bg-red-500 text-white' },
}

const ShopProductCard = ({ product, onFavoriteToggle, onClick }: Props) => {
  console.log('product', product)
  const [selectedImage, setSelectedImage] = useState(0)

  // const discountPercent = product.salePrice ? Math.round(((product.price - product.salePrice) / product.price) * 100) : null

  return (
    <div className="group flex flex-col bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-primary/30 cursor-pointer" onClick={() => onClick?.(product.slug)}>
      {/* Image Section */}
      <div className="relative p-4 pb-0 flex flex-col gap-2 h-full">
        {/* Main Image */}
        <div className="relative rounded-lg overflow-hidden bg-gray-50 dark:bg-slate-800 aspect-square">
          <Image src={product.images[selectedImage] || NEW_MISSING_IMAGE} alt={product.name} fill className="object-contain p-2 group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />

          {/* Status Badge - Bottom Left */}
          {product.status && <div className={`absolute bottom-2 left-2 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide ${statusConfig[product.status].className}`}>{statusConfig[product.status].label}</div>}

          {/* Discount Badge - Bottom Right */}
          {product.salePricePercent ? <div className="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white rounded text-xs font-bold">-{product.salePricePercent}%</div> : null}

          {/* Favorite Button - Top Right */}
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onFavoriteToggle?.(product.id)
            }}
            className={`absolute top-2 right-2 rounded-full transition-all ${product.isFavorited ? 'bg-red-50 text-red-500' : 'bg-white/80 text-slate-400 hover:text-red-500 hover:bg-white'} shadow-md hover:scale-110`}
          >
            <Heart className={`w-4 h-4 ${product.isFavorited ? 'fill-current' : ''}`} />
          </Button>
        </div>
        {/* Thumbnail Sidebar */}
        <div className="w-full flex gap-2 z-10">
          {product.images.map((img, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation()
                setSelectedImage(index)
              }}
              className={`w-12 h-12 rounded border-2 overflow-hidden cursor-pointer shadow-sm transition-all relative ${selectedImage === index ? 'border-red-400' : 'border-gray-200 dark:border-slate-600 opacity-70 hover:opacity-100 hover:border-red-300'}`}
            >
              <Image src={img} alt={`${product.name} ${index + 1}`} fill className={`w-full h-full object-cover ${selectedImage !== index ? 'grayscale hover:grayscale-0' : ''}`} />
            </button>
          ))}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Brand & Price Row */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-bold uppercase tracking-wider text-red-600">{product.brand}</span>
          <div className="relative">
            <span className="font-bold text-base text-slate-900 dark:text-white">{formatCurrency(product.salePrice || product.price)}</span>
            {product.salePrice ? <span className="absolute -top-3 right-0 font-semibold text-xs line-through decoration-red-600  ml-2">{formatCurrency(product.price)}</span> : null}
          </div>
        </div>

        {/* Name */}
        <div className="font-bold text-slate-900 dark:text-white text-lg line-clamp-1 group-hover:text-primary transition-colors">{product.name}</div>

        {/* Description */}
        {product.description && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 line-clamp-2 flex-1">{product.description}</p>}

        {/* Original Price (if discounted) */}
        {/* {product.originalPrice && <span className="text-xs text-slate-400 line-through">{formatPrice(product.originalPrice)}</span>} */}

        <div className="border-b border-dashed border-gray-200 w-full h-1 mt-3 mb-2" />

        {/* Rating */}
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className={`w-3.5 h-3.5 ${star <= Math.round(product.rating) ? 'text-amber-400 fill-current' : 'text-slate-200 dark:text-slate-600'}`} />
            ))}
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">{product.reviewCount} Đánh giá</span>
        </div>
      </div>
    </div>
  )
}

export default ShopProductCard
