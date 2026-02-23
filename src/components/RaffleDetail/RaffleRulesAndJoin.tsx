import { IBEResponseRaffleInfo } from '@/interface/Client/Raffle'

interface RaffleRulesAndJoinProps {
  raffle: IBEResponseRaffleInfo
}

interface RuleStep {
  icon: string
  title: string
  description: string
}

export const RaffleRulesAndJoin = ({ raffle }: RaffleRulesAndJoinProps) => {
  const steps: RuleStep[] = [
    {
      icon: '⏰',
      title: 'Step 1: 24h Window',
      description: 'Raffles open for 24 hours exactly. The form closes automatically.',
    },
    {
      icon: '👤',
      title: 'Step 2: One Entry',
      description: 'One entry per household. Duplicates are disqualified.',
    },
    {
      icon: '📧',
      title: 'Step 3: Notice',
      description: 'Payment notice sent via email upon raffle conclusion.',
    },
    {
      icon: '🏆',
      title: 'Step 4: Winners',
      description: 'Winners receive a secure checkout link for payment.',
    },
    {
      icon: '🔄',
      title: 'Step 5: Re-roll',
      description: 'Unpaid orders are canceled and re-rolled after 24 hours.',
    },
    {
      icon: '❌',
      title: 'Step 6: No Flip',
      description: 'Resale for immediate profit is prohibited and results in bans.',
    },
  ]

  return (
    <section className="space-y-4">
      <h3 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2">Raffle Rules & How to Join</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {steps.map((step, idx) => (
          <div key={idx} className="flex gap-4 p-4 bg-white border border-slate-200 rounded-lg hover:border-amber-400/40 hover:bg-slate-50 transition-all shadow-sm">
            <div className="shrink-0 w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center text-lg text-amber-600 flex-col">{step.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-1">{step.title}</div>
              <p className="text-xs text-slate-600 leading-relaxed">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
