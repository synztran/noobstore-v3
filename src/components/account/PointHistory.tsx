import { Button } from '@/components/ReUIComponent/Button'
import useAccount from '@/hook/useAccount'
import { ArrowLeft, Calendar, ChevronRight, Download, Gift, History, ShoppingBag, Star, Stars, Ticket, Wallet } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'

// Types
interface PointTransaction {
  id: string
  date: string
  title: string
  subtitle: string
  points: number
  balance: number
  type: 'earned' | 'spent'
  category: 'purchase' | 'raffle' | 'review' | 'redemption'
}

type FilterType = 'all' | 'earned' | 'spent'

// Mock data
const MOCK_TRANSACTIONS: PointTransaction[] = [
  {
    id: '1',
    date: '24 Thg 10, 2023',
    title: 'Mua hàng: Dragon Scale Keycap',
    subtitle: 'Đơn hàng #88329 • Marketplace',
    points: 120,
    balance: 2450,
    type: 'earned',
    category: 'purchase',
  },
  {
    id: '2',
    date: '20 Thg 10, 2023',
    title: "Tham gia Raffle: 'Mecha-Skull'",
    subtitle: 'Sử dụng 5 vé • Raffle Event',
    points: -50,
    balance: 2330,
    type: 'spent',
    category: 'raffle',
  },
  {
    id: '3',
    date: '15 Thg 10, 2023',
    title: 'Thưởng đánh giá',
    subtitle: "Đánh giá cho 'Cyber-Punk Spacebar'",
    points: 50,
    balance: 2380,
    type: 'earned',
    category: 'review',
  },
  {
    id: '4',
    date: '01 Thg 10, 2023',
    title: 'Đổi thưởng',
    subtitle: "Đổi 'Coupon giảm 100K'",
    points: -1000,
    balance: 2330,
    type: 'spent',
    category: 'redemption',
  },
  {
    id: '5',
    date: '28 Thg 9, 2023',
    title: 'Mua hàng: Resin Master Set',
    subtitle: 'Đơn hàng #88104 • Marketplace',
    points: 330,
    balance: 3330,
    type: 'earned',
    category: 'purchase',
  },
]

// Helper functions
const getCategoryIcon = (category: PointTransaction['category']) => {
  switch (category) {
    case 'purchase':
      return <ShoppingBag className="w-5 h-5" />
    case 'raffle':
      return <Ticket className="w-5 h-5" />
    case 'review':
      return <Star className="w-5 h-5" />
    case 'redemption':
      return <Gift className="w-5 h-5" />
    default:
      return <ShoppingBag className="w-5 h-5" />
  }
}

const getCategoryColors = (category: PointTransaction['category']) => {
  switch (category) {
    case 'purchase':
      return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
    case 'raffle':
      return 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
    case 'review':
      return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
    case 'redemption':
      return 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400'
    default:
      return 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400'
  }
}

// Summary Card Component
const SummaryCard: React.FC<{
  title: string
  value: string | number
  badge?: { label: string; variant: 'default' | 'warning' }
  subtitle: React.ReactNode
  icon: React.ReactNode
  iconColor: string
}> = ({ title, value, badge, subtitle, icon, iconColor }) => (
  <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group">
    <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${iconColor}`}>
      <div className="text-[80px] leading-none">{icon}</div>
    </div>
    <div className="relative z-10">
      <p className="text-slate-500 dark:text-slate-400 font-medium text-xs uppercase tracking-wider mb-2">{title}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-bold text-slate-900 dark:text-white">{value}</span>
        {badge && <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badge.variant === 'warning' ? 'text-orange-600 bg-orange-100 dark:bg-orange-900/30' : 'text-primary bg-primary/10'}`}>{badge.label}</span>}
      </div>
      <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
    </div>
  </div>
)

// Next Tier Card Component
const NextTierCard: React.FC<{
  tierName: string
  pointsNeeded: number
  progress: number
  benefit: string
}> = ({ tierName, pointsNeeded, progress, benefit }) => (
  <div className="bg-gradient-to-br from-primary to-primary/80 rounded-xl p-6 shadow-md text-white relative overflow-hidden">
    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
    <div className="relative z-10 h-full flex flex-col justify-between">
      <div>
        <p className="font-medium text-sm uppercase tracking-wider mb-2 opacity-80">Hạng tiếp theo: {tierName}</p>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-bold">{pointsNeeded.toLocaleString()}</span>
          <span className="text-sm opacity-90">điểm cần tích lũy</span>
        </div>
        <div className="w-full bg-black/20 rounded-full h-2 mb-1">
          <div className="bg-white h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <div className="text-sm opacity-90 flex items-center gap-2 mt-2">
        <Stars className="w-4 h-4" />
        {benefit}
      </div>
    </div>
  </div>
)

// Filter Tab Component
const FilterTabs: React.FC<{
  activeFilter: FilterType
  onFilterChange: (filter: FilterType) => void
}> = ({ activeFilter, onFilterChange }) => {
  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'Tất cả' },
    { key: 'earned', label: 'Đã nhận' },
    { key: 'spent', label: 'Đã dùng' },
  ]

  return (
    <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg inline-flex">
      {filters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => onFilterChange(filter.key)}
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeFilter === filter.key ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  )
}

// Transaction Row Component
const TransactionRow: React.FC<{ transaction: PointTransaction }> = ({ transaction }) => (
  <tr className="group hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">{transaction.date}</td>
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${getCategoryColors(transaction.category)}`}>{getCategoryIcon(transaction.category)}</div>
        <div>
          <p className="text-sm font-medium text-slate-900 dark:text-white">{transaction.title}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{transaction.subtitle}</p>
        </div>
      </div>
    </td>
    <td className="px-6 py-4 text-center">
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${transaction.points > 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
        {transaction.points > 0 ? '+' : ''}
        {transaction.points.toLocaleString()}
      </span>
    </td>
    <td className="px-6 py-4 text-right">
      <span className="text-sm font-semibold text-slate-900 dark:text-white">{transaction.balance.toLocaleString()}</span>
    </td>
    <td className="px-6 py-4 text-right">
      <button className="text-slate-400 hover:text-primary transition-colors">
        <ChevronRight className="w-5 h-5" />
      </button>
    </td>
  </tr>
)

// Pagination Component
const Pagination: React.FC<{
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
}> = ({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Hiển thị{' '}
        <span className="font-medium">
          {startItem}-{endItem}
        </span>{' '}
        trong <span className="font-medium">{totalItems}</span> giao dịch
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 text-sm border border-slate-200 dark:border-slate-700 rounded-md ${currentPage === 1 ? 'text-slate-400 cursor-not-allowed' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'} transition-colors`}
        >
          Trước
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 text-sm border border-slate-200 dark:border-slate-700 rounded-md ${currentPage === totalPages ? 'text-slate-400 cursor-not-allowed' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'} transition-colors`}
        >
          Sau
        </button>
      </div>
    </div>
  )
}

// Main Component
const PointHistory: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [dateFilter, setDateFilter] = useState('')
  const itemsPerPage = 5
  const { goToAccountDetail } = useAccount()

  // Mock data
  const totalPoints = 2450
  const expiringPoints = 150
  const expiryDate = '24 Thg 11, 2023'
  const nextTier = {
    tierName: 'Master Artisan',
    pointsNeeded: 550,
    progress: 82,
    benefit: 'Mở khóa quyền truy cập raffle độc quyền',
  }

  // Filter transactions
  const filteredTransactions = MOCK_TRANSACTIONS.filter((t) => {
    if (activeFilter === 'earned') return t.type === 'earned'
    if (activeFilter === 'spent') return t.type === 'spent'
    return true
  })

  // Paginate
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
  const paginatedTransactions = filteredTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8 py-8 md:py-10">
      {/* Breadcrumbs */}
      {/* <nav className="flex items-center gap-2 mb-8 text-sm">
        <Link href="/account" className="text-slate-500 hover:text-primary transition-colors">
          Tài khoản
        </Link>
        <span className="text-slate-400">/</span>
        <Link href="/account/loyalty" className="text-slate-500 hover:text-primary transition-colors">
          Loyalty
        </Link>
        <span className="text-slate-400">/</span>
        <span className="text-slate-900 dark:text-white font-medium">Lịch sử điểm</span>
      </nav> */}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div className="flex flex-col gap-2">
          <button onClick={goToAccountDetail} className="flex items-center gap-1 text-sm text-slate-500 hover:text-primary transition-colors mb-2 w-fit">
            <ArrowLeft className="w-4 h-4" />
            Quay lại tài khoản
          </button>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Lịch sử điểm</h1>
          <p className="text-slate-500 dark:text-slate-400 text-base max-w-xl">Theo dõi hành trình của bạn. Xem cách bạn đã tích lũy và đổi thưởng như thế nào.</p>
        </div>
        <Link href="/rewards">
          <Button className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors shadow-sm shadow-primary/30 flex items-center gap-2">
            <Stars className="w-5 h-5" />
            Đổi điểm
          </Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <SummaryCard
          title="Tổng điểm khả dụng"
          value={totalPoints.toLocaleString()}
          badge={{ label: 'pts', variant: 'default' }}
          subtitle={
            <>
              Tương đương khoảng <span className="text-slate-900 dark:text-white font-semibold">{(totalPoints * 10).toLocaleString()}đ</span> phần thưởng
            </>
          }
          icon={<Wallet className="w-full h-full" />}
          iconColor="text-primary"
        />
        <SummaryCard
          title="Điểm sắp hết hạn"
          value={expiringPoints}
          badge={{ label: 'Sắp hết hạn', variant: 'warning' }}
          subtitle={
            <>
              Hết hạn vào <span className="text-slate-900 dark:text-white font-semibold">{expiryDate}</span>
            </>
          }
          icon={<History className="w-full h-full" />}
          iconColor="text-orange-500"
        />
        <div className="hidden lg:block">
          <NextTierCard {...nextTier} />
        </div>
      </div>

      {/* Filter & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <FilterTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} />
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Calendar className="w-5 h-5" />
            </span>
            <input
              type="text"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent text-slate-900 dark:text-white"
              placeholder="Lọc theo khoảng thời gian"
            />
          </div>
          <button className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-500 hover:text-primary hover:border-primary transition-colors">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                <th className="px-6 py-4 font-semibold w-32">Ngày</th>
                <th className="px-6 py-4 font-semibold">Hoạt động</th>
                <th className="px-6 py-4 font-semibold text-center w-32">Điểm</th>
                <th className="px-6 py-4 font-semibold text-right w-32">Số dư</th>
                <th className="px-6 py-4 font-semibold w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {paginatedTransactions.map((transaction) => (
                <TransactionRow key={transaction.id} transaction={transaction} />
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filteredTransactions.length} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage} />
      </div>

      {/* Support Link */}
      <div className="mt-8 flex justify-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Thiếu điểm?{' '}
          <Link href="/support" className="text-primary hover:text-primary/80 font-medium underline-offset-2 hover:underline">
            Liên hệ hỗ trợ
          </Link>{' '}
          để được trợ giúp.
        </p>
      </div>
    </div>
  )
}

export default PointHistory
