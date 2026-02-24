import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ReUIComponent/Tooltip'
import { EnumProductType, IProduct, IProductOption } from '@/interface/interface'
import { cn } from '@/lib/utils'
import { useStoreProductDetailAction } from '@/zustand/useProductDetail'
import { Check, Info } from 'lucide-react'
import { Dispatch, SetStateAction, useEffect, useMemo } from 'react'

interface ItemSelectGroupBlockProps {
  product: IProduct
  productOptions: IProductOption[]
  selectedOpt?: Record<EnumProductType, IProductOption[]>
  setSelectedOpt?: Dispatch<SetStateAction<Record<EnumProductType, IProductOption[]>>>
  toggleResetQuantity?: Dispatch<SetStateAction<number>>
}

// Sub-component: Selected option indicator with tooltip
const SelectedOptionInfo = ({ option }: { option: IProductOption }) => (
  <div className="flex gap-1 items-center">
    <div className="text-sm text-gray-500 flex items-center gap-1">
      <span>Đã chọn:</span>
      <span className="font-medium text-gray-900">{option.name}</span>
    </div>
    {option.description && (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="w-3 h-3 cursor-pointer text-gray-400 hover:text-gray-600" />
          </TooltipTrigger>
          <TooltipContent>
            <div dangerouslySetInnerHTML={{ __html: option.description }} />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )}
  </div>
)

// Sub-component: Check mark indicator for selected option
const SelectedCheckMark = () => <Check className="absolute -top-1.5 -right-1.5 text-orange-800 w-5 h-5 border-2 border-orange-600 rounded-full bg-white p-0.5" />

// Sub-component: Option button
interface OptionButtonProps {
  option: IProductOption
  isSelected: boolean
  isSoldOut: boolean
  onClick: () => void
}

const OptionButton = ({ option, isSelected, isSoldOut, onClick }: OptionButtonProps) => {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onClick}
        disabled={isSoldOut}
        className={cn(
          'h-10 px-4 rounded-lg border text-sm font-medium transition-all',
          'flex items-center justify-center min-w-25',
          isSelected ? 'border-2 border-orange-400 bg-primary/5 text-orange-400 font-bold shadow-sm' : 'border-gray-200 bg-white text-gray-900 hover:border-gray-300 hover:bg-gray-50',
          isSoldOut && 'opacity-80 border-gray-200 text-gray-400'
        )}
      >
        {option.name}
      </button>
      {/* {isSelected && <SelectedCheckMark />} */}
    </div>
  )
}

const ItemSelectGroupBlock = ({ product, productOptions, selectedOpt, setSelectedOpt, toggleResetQuantity }: ItemSelectGroupBlockProps) => {
  const { productPart, productName } = product || {}
  const { updateOptSelected } = useStoreProductDetailAction()

  // Get currently selected option for this product part
  const selectedOption = useMemo(() => {
    return selectedOpt?.[productPart as EnumProductType]?.[0]
  }, [selectedOpt, productPart])

  // Handle option selection/deselection
  const handleOptionClick = (option: IProductOption) => {
    const isCurrentlySelected = selectedOption?.productOptionId === option.productOptionId

    if (isCurrentlySelected) {
      // Deselect current option
      setSelectedOpt?.((prev) => {
        const updated = { ...prev }
        delete updated[productPart as EnumProductType]
        return updated
      })
    } else {
      // Select new option
      setSelectedOpt?.((prev) => ({
        ...prev,
        [productPart]: [option],
      }))
      updateOptSelected(option)
    }
  }

  // Reset quantity when selection changes
  useEffect(() => {
    toggleResetQuantity?.((prev) => prev + 1)
  }, [selectedOption, toggleResetQuantity])

  return (
    <div className="flex flex-col gap-3">
      {/* Header: Product name and selected option info */}
      <div className="flex gap-2 items-center justify-between">
        <span className="text-sm font-bold text-gray-900">{productName}</span>
        {selectedOption && <SelectedOptionInfo option={selectedOption} />}
      </div>

      {/* Options grid */}
      <div className="flex flex-wrap gap-3">
        {productOptions?.map((option, index) => {
          const isSoldOut = option.quantity === 0
          const isSelected = selectedOption?.productOptionId === option.productOptionId

          return <OptionButton key={option.productOptionId || index} option={option} isSelected={isSelected} isSoldOut={isSoldOut} onClick={() => handleOptionClick(option)} />
        })}
      </div>
    </div>
  )
}

export default ItemSelectGroupBlock
