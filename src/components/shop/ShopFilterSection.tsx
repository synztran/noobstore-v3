import useShop from '@/hook/useShop'
import { Dialog, Disclosure, Transition } from '@headlessui/react'
import { ChevronDownIcon, ChevronUpIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { SlidersHorizontal } from 'lucide-react'
import { Fragment } from 'react'

interface ShopFilterSectionProps {
  hideHeader?: boolean
}

const ShopFilterSection = ({ hideHeader = false }: ShopFilterSectionProps) => {
  const { mobileFiltersOpen, setMobileFiltersOpen, filterSections, priceRange, toggleFilterSection, toggleFilterOption, updatePriceRange, resetFilters, applyFilters } = useShop()

  const filterContent = (
    <div className="flex flex-col gap-6">
      {/* Filter Sections */}
      {filterSections.map((section) => (
        <Disclosure as="div" key={section.id} defaultOpen={section.isExpanded}>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full items-center justify-between py-2 text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider hover:text-primary transition-colors" onClick={() => toggleFilterSection(section.id)}>
                <span>{section.name}</span>
                {open ? <ChevronUpIcon className="w-4 h-4 text-slate-500" /> : <ChevronDownIcon className="w-4 h-4 text-slate-500" />}
              </Disclosure.Button>
              <Transition enter="transition duration-100 ease-out" enterFrom="transform scale-95 opacity-0" enterTo="transform scale-100 opacity-100" leave="transition duration-75 ease-out" leaveFrom="transform scale-100 opacity-100" leaveTo="transform scale-95 opacity-0">
                <Disclosure.Panel className="pt-2 pl-2 border-l-2 border-slate-200 dark:border-slate-700">
                  <div className="flex flex-col gap-1">
                    {section.options.map((option) => (
                      <label key={option.value} className="flex items-center gap-3 cursor-pointer hover:bg-primary/5 p-1.5 rounded transition-colors" onClick={() => toggleFilterOption(section.id, option.value)}>
                        <input type="checkbox" checked={option.checked} onChange={() => {}} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer" />
                        <span className={`text-sm ${option.checked ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-600 dark:text-slate-400'}`}>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </Disclosure.Panel>
              </Transition>
            </>
          )}
        </Disclosure>
      ))}

      {/* Divider */}
      <div className="h-px bg-slate-200 dark:bg-slate-700 w-full" />

      {/* Price Range */}
      <div className="flex flex-col gap-3">
        <h4 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider">Khoảng giá</h4>
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="number"
              min={0}
              max={5000000}
              value={priceRange.min}
              onChange={(e) => updatePriceRange({ min: Math.max(0, Math.min(parseInt(e.target.value) || 0, priceRange.max)) })}
              placeholder="Min"
              className="w-1/2 border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 bg-white dark:bg-slate-800 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
            <input
              type="number"
              min={0}
              max={5000000}
              value={priceRange.max}
              onChange={(e) => updatePriceRange({ max: Math.max(priceRange.min, Math.min(parseInt(e.target.value) || 5000000, 5000000)) })}
              placeholder="Max"
              className="w-1/2 border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 bg-white dark:bg-slate-800 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
          </div>
          <input type="range" min={0} max={5000000} step={100000} value={priceRange.min} onChange={(e) => updatePriceRange({ min: Math.min(parseInt(e.target.value), priceRange.max) })} className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary" />
          <input type="range" min={0} max={5000000} step={100000} value={priceRange.max} onChange={(e) => updatePriceRange({ max: Math.max(priceRange.min, parseInt(e.target.value)) })} className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary" />
          <div className="text-xs text-slate-500 dark:text-slate-400 flex justify-between">
            <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(priceRange.min)}</span>
            <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(priceRange.max)}</span>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Filter Dialog */}
      <Transition.Root show={mobileFiltersOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setMobileFiltersOpen}>
          <Transition.Child as={Fragment} enter="transition-opacity ease-linear duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity ease-linear duration-300" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 z-50 flex">
            <Transition.Child as={Fragment} enter="transition ease-in-out duration-300 transform" enterFrom="translate-x-full" enterTo="translate-x-0" leave="transition ease-in-out duration-300 transform" leaveFrom="translate-x-0" leaveTo="translate-x-full">
              <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white dark:bg-slate-900 shadow-xl">
                <div className="flex items-center justify-between px-4 py-4 border-b border-slate-200 dark:border-slate-700">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5" />
                    Bộ lọc
                  </h2>
                  <button type="button" className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" onClick={() => setMobileFiltersOpen(false)}>
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 px-4 py-6 overflow-y-auto">{filterContent}</div>

                {/* Mobile Actions */}
                <div className="px-4 py-4 border-t border-slate-200 dark:border-slate-700 flex gap-3">
                  <button onClick={resetFilters} className="flex-1 py-2.5 px-4 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    Làm mới
                  </button>
                  <button
                    onClick={() => {
                      applyFilters()
                      setMobileFiltersOpen(false)
                    }}
                    className="flex-1 py-2.5 px-4 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    Áp dụng
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop Filter */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-24">
          {/* Header - only show if not hidden */}
          {!hideHeader && (
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4 mb-6">
              <h3 className="font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5" />
                Bộ lọc
              </h3>
              <button onClick={resetFilters} className="text-xs text-red-500 hover:text-primary/80 font-bold uppercase tracking-wider transition-colors">
                Xóa bộ lọc
              </button>
            </div>
          )}

          {/* Filter Content */}
          <div className="max-h-[calc(100vh-200px)] overflow-y-auto pr-2">{filterContent}</div>
        </div>
      </aside>
    </>
  )
}

export default ShopFilterSection
