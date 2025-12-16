import React from 'react'

const BetSlip = ({
  open,
  betType,
  selectedDuration,
  betAmount,
  setBetAmount,
  betmultipler,
  setBetmultipler,
  total,
  onCancel,
  onConfirm,
}) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center">
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.55)' }} onClick={onCancel} />
      <div className="relative w-[460px] max-w-[94vw] px-4 pb-5 betslip-shell">
        <div className="glass-panel rounded-3xl overflow-hidden betslip-card">
          <div className="px-4 py-4 betslip-content scroll-dark">
            <div className="flex items-center justify-between">
              <div className="text-sm text-white/70">Bet Slip</div>
              <div className="chip">
                <span className="text-[11px]">Win Go</span>
                <span className="text-[11px] text-white/70">{selectedDuration || 0}s</span>
              </div>
            </div>

            <div className="mt-3">
              <div className="text-[12px] text-white/55">Selected</div>
              <div className="mt-1 text-lg font-semibold tracking-wide">{String(betType || '-')}</div>
            </div>

            <div className="mt-4 soft-divider" />

            <div className="mt-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-white/70">Stake</div>
                <div className="text-sm text-white/50">Tap to pick</div>
              </div>
              <div className="mt-3 grid grid-cols-4 gap-2">
                {['1', '10', '100', '1000'].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setBetAmount(amt)}
                    className={`neon-btn ${betAmount === amt ? 'neon-btn--primary' : ''}`}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-white/70">Multiplier</div>
                <div className="text-sm text-white/50">Risk / reward</div>
              </div>
              <div className="mt-3 grid grid-cols-6 gap-2">
                {[1, 5, 10, 20, 50, 100].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setBetmultipler(m)}
                    className={`neon-btn ${betmultipler === m ? 'neon-btn--primary' : ''}`}
                  >
                    x{m}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 soft-divider" />

            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-white/70">Total</div>
              <div className="text-lg font-semibold">₹{total || 0}</div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button type="button" className="neon-btn" onClick={onCancel}>
                Cancel
              </button>
              <button type="button" className="neon-btn neon-btn--primary" onClick={onConfirm}>
                Place Bet
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BetSlip
