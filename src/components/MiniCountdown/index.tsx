import { EnumRaffleStatus } from '@/interface/Client/Raffle'
import DateUtils from '@/utils/DateUtils'
import { Clock } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

interface MiniCountdownProps {
  startDate: string | Date
  endDate: string | Date
  raffleStatus: EnumRaffleStatus
  className?: string
}

function formatTime(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const days = Math.floor(totalSeconds / (3600 * 24))
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return { days, hours, minutes, seconds, totalMs: ms }
}

const pad = (n: number) => n.toString().padStart(2, '0')

const MiniCountdown: React.FC<MiniCountdownProps> = ({ startDate, endDate, raffleStatus, className = '' }) => {
  const [mode, setMode] = useState<EnumRaffleStatus>(raffleStatus)
  const [timeLeft, setTimeLeft] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
    totalMs: number
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0 })
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const start = DateUtils.parseServerDate(startDate)
    const end = DateUtils.parseServerDate(endDate)

    const update = () => {
      const nowDate = new Date()
      const { mode: m, diff } = DateUtils.getRaffleTimeLeft(start, end, nowDate)
      console.log('m', m)
      setMode(m as typeof mode)
      setTimeLeft(formatTime(diff))
    }

    update()
    intervalRef.current = setInterval(update, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [startDate, endDate])

  // Calculate thresholds
  const ONE_DAY_MS = 24 * 60 * 60 * 1000
  const ONE_HOUR_MS = 60 * 60 * 1000
  const isMoreThanOneDay = timeLeft.totalMs >= ONE_DAY_MS
  const isLessThanOneHour = timeLeft.totalMs < ONE_HOUR_MS && timeLeft.totalMs > 0

  // Determine text color
  const textColorClass = isLessThanOneHour ? 'text-red-500' : 'text-blue-500'
  // If ended
  if (mode === EnumRaffleStatus.ENDED) {
    return (
      <div className={`flex items-center gap-1 text-sm bg-gray-50 rounded-sm px-2 py-0.5 ${className} `}>
        <span>Đã kết thúc</span>
      </div>
    )
  }

  // Render based on time left
  const renderTime = () => {
    if (isMoreThanOneDay) {
      // More than 1 day: show "X Days"
      const dayText = timeLeft.days === 1 ? 'Day' : 'Days'
      return (
        <span className="font-mono font-medium">
          {timeLeft.days} {dayText}
        </span>
      )
    }

    if (isLessThanOneHour) {
      // Less than 1 hour: show "XXm XXs" in red
      return (
        <span className="font-mono font-medium">
          {pad(timeLeft.minutes)}m {pad(timeLeft.seconds)}s
        </span>
      )
    }

    // Less than 1 day but more than 1 hour: show "XXh XXm"
    return (
      <span className="font-mono font-medium">
        {pad(timeLeft.hours)}h {pad(timeLeft.minutes)}m
      </span>
    )
  }

  return <div className={`flex items-center gap-1 text-sm bg-gray-50 rounded-sm px-2 py-0.5 ${textColorClass} ${className}`}>{renderTime()}</div>
}

export default MiniCountdown
