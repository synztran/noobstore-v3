import { Button } from '@/components/ReUIComponent/Button'

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  isLoading?: boolean
  onPageChange: (page: number) => void
  showInfo?: boolean
  labels?: {
    previous?: string
    next?: string
    showing?: string
    of?: string
    results?: string
  }
}

export const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  isLoading = false,
  onPageChange,
  showInfo = true,
  labels = {
    previous: 'Trang Trước',
    next: 'Trang Sau',
    showing: 'Hiển thị',
    of: 'trong tổng số',
    results: 'kết quả',
  },
}: PaginationProps) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  // Generate page numbers with ellipsis for large page counts
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      if (currentPage > 3) {
        pages.push('ellipsis')
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (currentPage < totalPages - 2) {
        pages.push('ellipsis')
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages)
      }
    }

    return pages
  }

  if (totalPages <= 0) return null

  return (
    <div className="space-y-4">
      {/* Pagination Info */}
      {showInfo && totalItems > 0 && (
        <div className="text-center text-sm text-gray-600">
          {labels.showing} {startItem} - {endItem} {labels.of} {totalItems} {labels.results}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1 || isLoading}>
            {labels.previous}
          </Button>

          <div className="flex items-center gap-1">
            {getPageNumbers().map((page, index) =>
              page === 'ellipsis' ? (
                <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  disabled={isLoading}
                  className={`min-w-10 h-10 rounded-lg font-medium transition-colors ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'} ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                  {page}
                </button>
              )
            )}
          </div>

          <Button variant="outline" size="sm" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages || isLoading}>
            {labels.next}
          </Button>
        </div>
      )}
    </div>
  )
}

export default Pagination
