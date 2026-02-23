import { IBEResponseRaffleInfo } from '@/interface/Client/Raffle'

interface RaffleShippingProps {
  raffle: IBEResponseRaffleInfo
}

export const RaffleShipping = ({ raffle }: RaffleShippingProps) => {
  const expectedDate = raffle.expectedDeliveryAt
    ? new Date(raffle.expectedDeliveryAt).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Sẽ được thông báo sau'

  const shippingFeatures = [
    { icon: '✈️', text: 'Giao hàng toàn quốc' },
    { icon: '🛡️', text: 'Bảo hiểm vận chuyển' },
    { icon: '📦', text: 'Đóng gói kỹ lưỡng' },
  ]

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 shadow-sm">
      {/* Title */}
      <h4 className="text-base font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
        <span>📦</span> Thông Tin Vận Chuyển
      </h4>

      {/* Expected Delivery */}
      <div className="flex gap-4 items-start mb-4 pb-4 border-b border-slate-200">
        <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">🚚</div>
        <div className="flex-1">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Thời gian giao hàng dự kiến</p>
          <p className="text-base text-amber-600 font-bold">{expectedDate}</p>
        </div>
      </div>

      {/* Shipping Info Text */}
      <p className="text-sm text-slate-600 mb-4 leading-relaxed">Sau khi raffle kết thúc, người chiến thắng sẽ nhận được sản phẩm trong vòng 7-14 ngày làm việc. Bạn sẽ nhận được email thông báo kèm mã theo dõi đơn hàng.</p>

      {/* Shipping Features */}
      <div className="space-y-2">
        {shippingFeatures.map((feature, idx) => (
          <div key={idx} className="flex items-center gap-2 text-sm text-slate-600">
            <span className="text-base">{feature.icon}</span>
            <span>{feature.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
