import useShop, { SORT_OPTIONS } from '@/hook/useShop'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { Fragment } from 'react'

interface ShopSearchBarProps {
  resultCount: number
}

const ShopSearchBar = ({ resultCount }: ShopSearchBarProps) => {
  const { searchQuery, sortOption, updateSearch, updateSort } = useShop()

  const currentSortLabel = SORT_OPTIONS.find((opt) => opt.value === sortOption)?.label || 'Phổ biến'

  return (
    <div className="flex items-center gap-4 flex-1">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => updateSearch(e.target.value)}
          placeholder="Tìm kiếm sản phẩm..."
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
        />
      </div>

      {/* Sort Dropdown */}
      <Menu as="div" className="relative min-w-45">
        <Menu.Button className="appearance-none w-full flex items-center justify-between gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors">
          <span>Sắp xếp: {currentSortLabel}</span>
          <ChevronDownIcon className="w-4 h-4 text-slate-400" />
        </Menu.Button>
        <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
          <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg focus:outline-none z-50 overflow-hidden">
            {SORT_OPTIONS.map((option) => (
              <Menu.Item key={option.value}>
                {({ active }) => (
                  <button
                    onClick={() => updateSort(option.value)}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${sortOption === option.value ? 'bg-primary/10 text-primary font-medium' : active ? 'bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}
                  >
                    {option.label}
                  </button>
                )}
              </Menu.Item>
            ))}
          </Menu.Items>
        </Transition>
      </Menu>

      {/* Results Count */}
      <div className="flex items-center text-base text-slate-500 dark:text-slate-400 ml-auto">
        <span className="font-medium text-slate-900 dark:text-white">{resultCount.toLocaleString()}</span>&nbsp;kết quả
      </div>
    </div>
  )
}

export default ShopSearchBar
