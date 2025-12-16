import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const BetProgress = ({ open, bet, countdown, selectedDuration }) => {
  if (!open || !bet) return null

  const totalSeconds = Number(selectedDuration) || 0
  const pct = totalSeconds ? Math.min(100, Math.max(0, (countdown / totalSeconds) * 100)) : 0

  return (
    <div className="glass-panel rounded-3xl px-4 py-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="chip">
            <FontAwesomeIcon icon="fa-solid fa-lock" />
            <span className="text-[11px] tracking-wide">ORDER LOCKED</span>
          </div>
          <div className="mt-2 text-sm font-semibold tracking-wide">Bet placed • Cannot cancel</div>
          <div className="mt-1 text-xs text-white/60">Wait for the round result</div>
        </div>
        <div className="chip">
          <span className="text-[11px] text-white/70">Round</span>
          <span className="text-[11px] font-semibold">#{bet.roundId}</span>
        </div>
      </div>

      <div className="mt-4 soft-divider" />

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-2xl px-3 py-3" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)' }}>
          <div className="text-[11px] text-white/55">Type</div>
          <div className="mt-1 text-sm font-semibold">{String(bet.type)}</div>
        </div>
        <div className="rounded-2xl px-3 py-3" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)' }}>
          <div className="text-[11px] text-white/55">Total</div>
          <div className="mt-1 text-sm font-semibold">₹{bet.total}</div>
        </div>
        <div className="rounded-2xl px-3 py-3" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)' }}>
          <div className="text-[11px] text-white/55">Stake</div>
          <div className="mt-1 text-sm font-semibold">₹{bet.amount}</div>
        </div>
        <div className="rounded-2xl px-3 py-3" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)' }}>
          <div className="text-[11px] text-white/55">Multiplier</div>
          <div className="mt-1 text-sm font-semibold">x{bet.multiplier}</div>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between">
          <div className="text-xs text-white/55">Progress</div>
          <div className="chip">
            <span className="text-[11px] text-white/70">Remaining</span>
            <span className="text-[11px] font-semibold">{countdown}s</span>
          </div>
        </div>
        <div className="mt-2 h-2 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}>
          <div
            className="h-full rounded-full"
            style={{
              width: `${pct}%`,
              background:
                countdown < 7
                  ? 'linear-gradient(90deg, rgba(239,68,68,0.9), rgba(124,58,237,0.8))'
                  : 'linear-gradient(90deg, rgba(16,185,129,0.85), rgba(124,58,237,0.75))',
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default BetProgress
