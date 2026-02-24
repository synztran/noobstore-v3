import { NEW_MISSING_IMAGE } from '@/constants/Images'
import { EnumSaleStatus } from '@/interface/interface'
import Image from 'next/image'
import { useState } from 'react'

interface ProductImageGalleryProps {
  images: { path: string; id: number }[]
  status?: EnumSaleStatus
  productName: string
}

const statusConfig: Partial<Record<EnumSaleStatus, { label: string; className: string }>> = {
  [EnumSaleStatus.INSTOCK]: { label: 'Còn hàng', className: 'bg-green-500 text-white' },
  [EnumSaleStatus.OUTSTOCK]: { label: 'Hết hàng', className: 'bg-red-500 text-white' },
  [EnumSaleStatus.GB]: { label: 'Group Buy', className: 'bg-primary text-white' },
  [EnumSaleStatus.TBD]: { label: 'Mới', className: 'bg-primary text-white' },
}

const ProductImageGallery = ({ images, status, productName }: ProductImageGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const imageList = images?.length > 0 ? images : [{ path: NEW_MISSING_IMAGE, id: 0 }]

  return (
    <div className="w-full lg:w-3/5 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-6 flex flex-col justify-start">
      {/* Main Image */}
      <div className="relative aspect-4/3 rounded-lg overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm mb-4">
        <Image src={imageList[selectedIndex]?.path || NEW_MISSING_IMAGE} alt={productName} fill className="object-contain p-4" sizes="(max-width: 768px) 100vw, 60vw" />

        {/* Status Badge */}
        {/* {status && statusConfig[status] && (
          <div className="absolute bottom-3 left-3 z-10">
            <span className={`text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider shadow-sm ${statusConfig[status]?.className}`}>{statusConfig[status]?.label}</span>
          </div>
        )} */}
      </div>

      {/* Thumbnail Gallery */}
      <div className="grid grid-cols-5 gap-3">
        {imageList.map((image, index) => (
          <button
            key={image.id || index}
            onClick={() => setSelectedIndex(index)}
            className={`aspect-square rounded border-2 overflow-hidden cursor-pointer transition-all relative ${selectedIndex === index ? 'border-primary' : 'border-slate-200 dark:border-slate-600 opacity-70 hover:opacity-100 hover:border-primary'}`}
          >
            <Image src={image.path || NEW_MISSING_IMAGE} alt={`${productName} ${index + 1}`} fill className="object-cover" sizes="80px" />
          </button>
        ))}
      </div>
    </div>
  )
}

export default ProductImageGallery
