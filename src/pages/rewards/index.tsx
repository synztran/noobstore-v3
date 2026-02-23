import { Button } from '@/components/ReUIComponent/Button'
import { Dialog, DialogBody, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ReUIComponent/Dialog'
import { Base } from '@/templates/Base'
import { Award, Banknote, Circle, Copy, Gift, Keyboard, Lock, PiggyBank, Sparkle, Sparkles, Star, Sticker, Ticket, Trophy, Truck } from 'lucide-react'
import Link from 'next/link'
import React, { useMemo, useState } from 'react'

// Types
interface Reward {
  id: string
  title: string
  description: string
  points: number
  icon: React.ReactNode
  iconBgColor: string
  iconTextColor: string
  badge?: {
    label: string
    variant: 'best-value' | 'popular' | 'limited' | 'locked'
  }
}

// Mock data - replace with actual API data
const MOCK_USER_POINTS = 1250

const MOCK_REWARDS: Reward[] = [
  {
    id: '1',
    title: 'Coupon 100K',
    description: 'Giảm giá trực tiếp cho đơn hàng keycap artisan tiếp theo.',
    points: 500,
    icon: <Banknote className="w-6 h-6" />,
    iconBgColor: 'bg-green-100',
    iconTextColor: 'text-green-700',
    badge: { label: 'Giá tốt', variant: 'best-value' },
  },
  {
    id: '2',
    title: 'Miễn phí vận chuyển',
    description: 'Áp dụng cho tất cả đơn hàng nội địa với mã theo dõi.',
    points: 750,
    icon: <Truck className="w-6 h-6" />,
    iconBgColor: 'bg-blue-100',
    iconTextColor: 'text-blue-700',
    badge: { label: 'Phổ biến', variant: 'popular' },
  },
  {
    id: '3',
    title: 'Bộ Sticker',
    description: 'Bộ 5 sticker holographic artisan độc đáo.',
    points: 1000,
    icon: <Sticker className="w-6 h-6" />,
    iconBgColor: 'bg-purple-100',
    iconTextColor: 'text-purple-700',
    badge: { label: 'Giới hạn', variant: 'limited' },
  },
  {
    id: '4',
    title: 'Ưu tiên Raffle',
    description: 'Bỏ qua hàng đợi và tăng gấp 2 cơ hội trúng raffle mới.',
    points: 2000,
    icon: <Ticket className="w-6 h-6" />,
    iconBgColor: 'bg-gray-100',
    iconTextColor: 'text-gray-500',
  },
  {
    id: '5',
    title: 'Mystery Artisan',
    description: 'Một sculpt ngẫu nhiên từ kho lưu trữ của chúng tôi.',
    points: 5000,
    icon: <Keyboard className="w-6 h-6" />,
    iconBgColor: 'bg-gray-100',
    iconTextColor: 'text-gray-500',
  },
  {
    id: '6',
    title: 'Deskmat Abstract',
    description: 'Deskmat chất lượng cao 900x400mm với viền may.',
    points: 1200,
    icon: <Gift className="w-6 h-6" />,
    iconBgColor: 'bg-orange-100',
    iconTextColor: 'text-orange-700',
  },
]

// Components
const PointsBadge: React.FC<{ points: number }> = ({ points }) => {
  return (
    <div className="hidden sm:flex items-center gap-2 bg-amber-50 border border-amber-200 px-4 py-2 rounded-full">
      <Trophy className="w-5 h-5 text-amber-500" />
      <div className="flex flex-col leading-none">
        <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Số dư</span>
        <span className="text-lg font-bold text-gray-900 tabular-nums">{points.toLocaleString()}</span>
      </div>
    </div>
  )
}

const RewardBadge: React.FC<{
  badge: Reward['badge']
  isLocked?: boolean
}> = ({ badge, isLocked }) => {
  if (isLocked) {
    return (
      <span className="bg-gray-100 dark:bg-gray-800 text-gray-500 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
        <Lock className="w-3 h-3" /> Khóa
      </span>
    )
  }

  if (!badge) return null

  const variants = {
    'best-value': 'bg-amber-400 text-gray-900',
    popular: 'bg-gray-100 dark:bg-gray-800 text-gray-500',
    limited: 'bg-gray-100 dark:bg-gray-800 text-gray-500',
    locked: 'bg-gray-100 dark:bg-gray-800 text-gray-500',
  }

  return <span className={`${variants[badge.variant]} text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider`}>{badge.label}</span>
}

const RewardCard: React.FC<{
  reward: Reward
  userPoints: number
  onRedeem: (reward: Reward) => void
}> = ({ reward, userPoints, onRedeem }) => {
  const isLocked = userPoints < reward.points
  const progressPercentage = Math.min((userPoints / reward.points) * 100, 100)
  const pointsNeeded = reward.points - userPoints

  return (
    <div className={`group flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 shadow-sm transition-all duration-200 ${isLocked ? 'opacity-75 hover:opacity-100' : 'hover:shadow-md'}`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className={`w-12 h-12 rounded-full ${reward.iconBgColor} ${reward.iconTextColor} flex items-center justify-center`}>{reward.icon}</div>
        <RewardBadge badge={reward.badge} isLocked={isLocked} />
      </div>

      {/* Content */}
      <h3 className={`text-lg font-bold mb-1 ${isLocked ? 'text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>{reward.title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">{reward.description}</p>

      {/* Footer */}
      <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-col gap-3">
        <div className={`flex items-baseline justify-between ${isLocked ? 'text-gray-400' : ''}`}>
          <span className={`text-2xl font-black tracking-tight ${isLocked ? 'text-gray-400' : 'text-gray-900 dark:text-white'}`}>{reward.points.toLocaleString()}</span>
          <span className="text-xs font-bold text-gray-500 uppercase">Điểm</span>
        </div>

        {isLocked ? (
          <>
            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-amber-400 opacity-50" style={{ width: `${progressPercentage}%` }} />
            </div>
            <button className="w-full bg-gray-100 dark:bg-gray-800 text-gray-400 font-medium py-2.5 px-4 rounded-lg cursor-not-allowed text-sm" disabled>
              Cần thêm {pointsNeeded.toLocaleString()} điểm
            </button>
          </>
        ) : (
          <Button className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 group-hover:scale-[1.02] active:scale-95" onClick={() => onRedeem(reward)}>
            Đổi thưởng
          </Button>
        )}
      </div>
    </div>
  )
}

const EarnMoreBanner: React.FC = () => {
  return (
    <div className="mt-8 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border border-dashed border-gray-300 dark:border-gray-600">
      <div className="flex items-center gap-3">
        <div className="bg-amber-100 p-2 rounded-full text-amber-500">
          <PiggyBank className="w-5 h-5" />
        </div>
        <div>
          <p className="font-bold text-gray-900 dark:text-white text-sm">Muốn thêm điểm?</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Nhận 50 điểm cho mỗi đánh giá bạn viết.</p>
        </div>
      </div>
      <Link href="/account/orders" className="text-sm font-semibold text-gray-900 dark:text-white underline decoration-amber-400 decoration-2 underline-offset-4 hover:text-amber-500 transition-colors">
        Viết đánh giá
      </Link>
    </div>
  )
}

// Confirm Redeem Dialog Component
const ConfirmRedeemDialog: React.FC<{
  reward: Reward | null
  userPoints: number
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isRedeeming?: boolean
}> = ({ reward, userPoints, open, onOpenChange, onConfirm, isRedeeming }) => {
  if (!reward) return null

  const remainingPoints = userPoints - reward.points

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="sm" className="bg-white dark:bg-gray-900">
        <DialogHeader className="border-b-0 pb-0">
          <DialogTitle className="text-xl text-gray-900 dark:text-white">Xác nhận đổi thưởng</DialogTitle>
          <DialogDescription className="text-gray-500">Bạn có chắc chắn muốn đổi phần thưởng này?</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4">
          {/* Reward Preview */}
          <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className={`w-12 h-12 rounded-full ${reward.iconBgColor} ${reward.iconTextColor} flex items-center justify-center flex-shrink-0`}>{reward.icon}</div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-gray-900 dark:text-white">{reward.title}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{reward.description}</p>
            </div>
          </div>

          {/* Points Summary */}
          <div className="space-y-2 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Số dư hiện tại</span>
              <span className="font-semibold text-gray-900 dark:text-white">{userPoints.toLocaleString()} điểm</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Chi phí đổi thưởng</span>
              <span className="font-semibold text-red-600 dark:text-red-400">-{reward.points.toLocaleString()} điểm</span>
            </div>
            <div className="border-t border-amber-200 dark:border-amber-700 pt-2 flex justify-between">
              <span className="font-medium text-gray-900 dark:text-white">Số dư còn lại</span>
              <span className="font-bold text-amber-600 dark:text-amber-400">{remainingPoints.toLocaleString()} điểm</span>
            </div>
          </div>
        </DialogBody>

        <DialogFooter className="border-t-0 pt-0">
          <DialogClose asChild>
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
              Hủy
            </Button>
          </DialogClose>
          <Button className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold" onClick={onConfirm} disabled={isRedeeming}>
            {isRedeeming ? 'Đang xử lý...' : 'Xác nhận đổi thưởng'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Success Dialog Component
const SuccessDialog: React.FC<{
  reward: Reward | null
  open: boolean
  onOpenChange: (open: boolean) => void
}> = ({ reward, open, onOpenChange }) => {
  const [copied, setCopied] = useState(false)

  if (!reward) return null

  // Generate a mock coupon code based on reward
  const couponCode = `ARTISAN-${reward.title.toUpperCase().replace(/\s+/g, '-').slice(0, 10)}-2026`

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(couponCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = couponCode
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="sm" className="bg-white dark:bg-gray-900 border-amber-200 dark:border-amber-800/30">
        <DialogBody className="p-8 flex flex-col items-center text-center">
          {/* Celebratory Icon */}
          <div className="relative mb-6">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-xl scale-150" />
            {/* Main icon */}
            <div className="relative bg-amber-400 text-gray-900 w-20 h-20 rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-gray-800">
              <Award className="w-10 h-10" />
            </div>
            {/* Decorative accents */}
            <Star className="absolute -top-4 -right-4 w-6 h-6 text-amber-400 opacity-60 fill-amber-400" />
            <Circle className="absolute top-10 -left-6 w-3 h-3 text-amber-400 opacity-40 fill-amber-400" />
            <Sparkle className="absolute -bottom-2 -right-8 w-5 h-5 text-amber-400 opacity-50 fill-amber-400" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Thành công!</h1>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            Bạn đã đổi thành công <span className="font-semibold text-gray-900 dark:text-white">{reward.title}</span>. Điểm của bạn đã được cập nhật và phần thưởng đã sẵn sàng.
          </p>

          {/* Coupon Code Box */}
          <div className="w-full bg-amber-50 dark:bg-amber-900/20 border-2 border-dashed border-amber-400 rounded-lg p-5 mb-8 relative">
            <p className="text-[10px] uppercase tracking-widest text-amber-600 dark:text-amber-400 font-bold mb-2">Mã coupon của bạn</p>
            <div className="flex items-center justify-between gap-4">
              <code className="text-lg font-mono font-bold text-gray-900 dark:text-white tracking-tight truncate">{couponCode}</code>
              <Button onClick={handleCopyCode} className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-500 text-gray-900 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors shrink-0">
                <Copy className="w-4 h-4" />
                {copied ? 'Đã sao chép!' : 'Sao chép'}
              </Button>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="w-full space-y-3">
            <Link href="/account/coupons" className="block">
              <Button className="w-full py-3.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg font-bold hover:opacity-90 transition-opacity">Xem coupon của tôi</Button>
            </Link>
            <DialogClose asChild>
              <button className="w-full py-3.5 bg-transparent text-gray-500 dark:text-gray-400 font-medium hover:text-gray-900 dark:hover:text-white transition-colors">Quay lại cửa hàng</button>
            </DialogClose>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  )
}

// Main Page Component
const RewardsPage: React.FC = () => {
  const [userPoints, setUserPoints] = useState(MOCK_USER_POINTS)
  const [rewards] = useState(MOCK_REWARDS)
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [isSuccessOpen, setIsSuccessOpen] = useState(false)
  const [isRedeeming, setIsRedeeming] = useState(false)

  // Sort rewards: redeemable first, then by points ascending
  const sortedRewards = useMemo(() => {
    return [...rewards].sort((a, b) => {
      const aLocked = userPoints < a.points
      const bLocked = userPoints < b.points

      if (aLocked !== bLocked) {
        return aLocked ? 1 : -1
      }
      return a.points - b.points
    })
  }, [rewards, userPoints])

  const handleRedeem = (reward: Reward) => {
    setSelectedReward(reward)
    setIsConfirmOpen(true)
  }

  const handleConfirmRedeem = async () => {
    if (!selectedReward) return

    setIsRedeeming(true)

    // TODO: Implement actual API call here
    // Simulating API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Deduct points
    setUserPoints((prev) => prev - selectedReward.points)

    setIsRedeeming(false)
    setIsConfirmOpen(false)
    setIsSuccessOpen(true)
  }

  return (
    <Base>
      <div className="dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-7 h-7 text-amber-500" />
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Cửa hàng điểm thưởng</h1>
              </div>
              <p className="text-base text-gray-500 dark:text-gray-400">Phần thưởng độc quyền dành cho người sưu tầm trung thành.</p>
            </div>
            <PointsBadge points={userPoints} />
          </div>

          {/* Mobile Balance */}
          <div className="sm:hidden mb-6 px-4 py-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Số dư của bạn</span>
            <span className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-1">
              {userPoints.toLocaleString()} <Trophy className="w-5 h-5 text-amber-500" />
            </span>
          </div>

          {/* Rewards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sortedRewards.map((reward) => (
              <RewardCard key={reward.id} reward={reward} userPoints={userPoints} onRedeem={handleRedeem} />
            ))}
          </div>

          <EarnMoreBanner />

          {/* Footer Terms */}
          <div className="mt-8 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-center">
            <p className="text-xs text-gray-500 text-center max-w-lg">
              Phần thưởng tùy thuộc vào tình trạng còn hàng. Coupon hết hạn sau 30 ngày kể từ khi đổi. Điểm không thể chuyển nhượng.{' '}
              <Link href="/policy" className="underline hover:text-amber-500 transition-colors">
                Điều khoản &amp; Điều kiện
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Confirm Redeem Dialog */}
      <ConfirmRedeemDialog reward={selectedReward} userPoints={userPoints} open={isConfirmOpen} onOpenChange={setIsConfirmOpen} onConfirm={handleConfirmRedeem} isRedeeming={isRedeeming} />

      {/* Success Dialog */}
      <SuccessDialog reward={selectedReward} open={isSuccessOpen} onOpenChange={setIsSuccessOpen} />
    </Base>
  )
}

export default RewardsPage
