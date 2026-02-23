import { Search } from 'lucide-react'

import { Pagination } from '@/components/Pagination'
import { useRafflesContext } from '@/context/RafflesContext'
import { RaffleCard } from './RaffleCard'

export const LiveRafflesSection = () => {
  const { searchQuery, sortBy, isFetching, paginatedRaffles, currentPage, totalPages, pagination, itemsPerPage, handleSearchChange, handleSortChange, handlePageChange } = useRafflesContext()
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm raffle..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-600">Sắp xếp:</span>
          <select value={sortBy} onChange={(e) => handleSortChange(e.target.value)} className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer transition-all">
            <option>Kết Thúc Sớm</option>
            <option>Giá: Thấp đến Cao</option>
            <option>Giá: Cao đến Thấp</option>
            <option>Mới Nhất</option>
          </select>
        </div>
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-max ${isFetching ? 'opacity-60' : ''}`}>
        {paginatedRaffles.length > 0 ? (
          paginatedRaffles.map((raffle) => (
            <div key={raffle.raffleId}>
              <RaffleCard raffle={raffle} />
            </div>
          ))
        ) : (
          <div className="col-span-full flex justify-center items-center py-12">
            <p className="text-gray-500 text-center">Không tìm thấy xổ số nào phù hợp với tiêu chí của bạn</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={pagination.total} itemsPerPage={itemsPerPage} isLoading={isFetching} onPageChange={handlePageChange} />
    </section>
  )
}
