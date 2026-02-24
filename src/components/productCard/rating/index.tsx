import { STAR_MEDAL_ICON } from '@/constants/Images'
import { classNames } from '@/utils/AppConfig'
import { Star } from 'lucide-react'

interface Props {
  star: number
  reviewer?: number
  disabled?: boolean
  readonly?: boolean
  isVertical?: boolean
  isShowComment?: boolean
}

const RatingComponent = ({ star = 0.0, reviewer = 0, disabled = false, readonly = false, isVertical = false, isShowComment = true }: Props) => {
  if (isVertical) {
    return (
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-1">
          <img src={STAR_MEDAL_ICON} alt="star" className="w-6 h-6" />
          <span className="text-lg font-bold">{star}</span>
        </div>
        <span className="text-sm">Đánh giá</span>
      </div>
    )
  }

  return (
    <div className="flex items-center align-middle gap-2">
      <div className="flex items-center gap-1">
        <div className="flex items-center gap-px">
          {[...Array(5)].map((_, i) => {
            const full = i + 1 <= Math.floor(star)
            const half = !full && i < star && star % 1 >= 0.5
            return (
              <span key={i} className="relative w-4 h-4 inline-block">
                <Star
                  className={classNames('w-4 h-4', full ? 'fill-yellow-400' : half ? 'fill-yellow-400' : 'fill-gray-300')}
                  style={
                    half
                      ? {
                          clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)',
                        }
                      : undefined
                  }
                />
                {half && (
                  <Star
                    className="w-4 h-4 fill-gray-300 absolute top-0 left-0"
                    style={{
                      clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)',
                    }}
                  />
                )}
              </span>
            )
          })}
        </div>
      </div>
      <div className="space-x-0.5">
        <strong className="text-sm font-bold text-black">{star || '0.0'}</strong>
        {isShowComment ? <span className="text-sm text-amber-800">({reviewer} đánh giá)</span> : null}
      </div>
    </div>
  )
}

export default RatingComponent
