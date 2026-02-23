import { NEW_MISSING_IMAGE } from '@/constants/Images'
import { IBEResponseProductOption, IBEResponseRaffleInfo } from '@/interface/Client/Raffle'
import Image from 'next/image'

interface RaffleSculptInformationProps {
  raffle: IBEResponseRaffleInfo
  selectedProduct: IBEResponseProductOption | null
}

interface SpecItem {
  label: string
  value: string | number
  icon: string
  bgColor: string
  iconColor: string
}

export const RaffleSculptInformation = ({ raffle, selectedProduct }: RaffleSculptInformationProps) => {
  // Get specs from raffle or product data
  const specs: SpecItem[] = [
    {
      label: 'Material',
      value: 'Urethane Resin',
      icon: '🧪',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-700',
    },
    {
      label: 'Profile',
      value: 'Cherry R1',
      icon: '📐',
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-700',
    },
    {
      label: 'Stem',
      value: 'Cherry MX',
      icon: '⌨️',
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-700',
    },
  ]

  // Get the image from selected product or use raffle thumbnail
  const displayImage = selectedProduct?.thumbnail?.path || raffle.thumbnail?.path || NEW_MISSING_IMAGE

  // Get colorway from raffle or product
  const colorways = [
    { color: '#7c0000', name: 'Deep Crimson' },
    { color: '#fef3c7', name: 'Starlight Cream' },
    { color: '#14b8a6', name: 'Nebula Teal' },
    { color: '#f59e0b', name: 'Solar Amber' },
    { color: '#334155', name: 'Void Grey' },
  ]

  return (
    <section className="space-y-2 sticky top-20">
      <div className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2">Thông tin Sculpt</div>
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm overflow-hidden">
        <div className="grid grid-cols-2 gap-8 items-start">
          {/* Left: Specifications */}
          <div className="space-y-2">
            {/* Spec Items */}
            {specs.map((spec, idx) => (
              <div key={idx} className="flex items-center justify-between group">
                <div className="flex items-center gap-2">
                  {/* <span className={`${spec.bgColor} ${spec.iconColor} p-2 rounded-lg text-2xl w-12 h-12 text-center`}>{spec.icon}</span> */}
                  <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">{spec.label}</span>
                </div>
                <span className="text-sm font-bold text-slate-900 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200 group-hover:border-amber-400/50 group-hover:bg-amber-50 transition-all">{spec.value}</span>
              </div>
            ))}

            {/* Colorway Section */}
            <div className="pt-4 border-t border-slate-100">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">🎨 Colorway</span>
                <span className="text-[10px] font-mono text-slate-400">NEBULA_ETHER_V2</span>
              </div>
              <div className="relative h-4 w-full rounded-full flex gap-0.5 bg-slate-100">
                {colorways.map((cw, idx) => (
                  <div key={idx} className="flex-1 cursor-help hover:scale-110 hover:z-10 transition-all group/tooltip relative first:rounded-tl-full first:rounded-bl-full last:rounded-tr-full last:rounded-br-full" style={{ backgroundColor: cw.color }} title={cw.name}>
                    <span className="pointer-events-none opacity-0 group-hover/tooltip:opacity-100 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded shadow-lg whitespace-nowrap z-20 transition-opacity duration-200">
                      {cw.name}
                      <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Product Image */}
          <div className="relative h-full rounded-xl overflow-hidden group border border-slate-200 bg-slate-50">
            <Image src={displayImage} alt={selectedProduct?.label || raffle.title} fill className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className="text-white text-xs font-bold uppercase tracking-wider mb-1">{selectedProduct?.label || 'Variant'}</p>
              <p className="text-white/70 text-[10px]">{selectedProduct?.label ? 'Selected Variant' : 'Main Sculpt'}</p>
            </div>
            <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-md border border-white/30 rounded p-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white text-sm block">🔍</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
