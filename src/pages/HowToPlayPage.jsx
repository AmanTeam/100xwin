import React from 'react'
import AdSlot from '../ui/AdSlot'

const HowToPlayPage = () => {
  return (
    <div className="px-4">
      <div className="glass-panel rounded-3xl px-4 py-4 mt-4">
        <div className="text-sm font-semibold tracking-wide">How to Play</div>
        <div className="mt-2 text-sm text-white/70">
          <div className="mt-2">
            1) Choose a timer mode (30s / 1m / 3m).
          </div>
          <div className="mt-2">
            2) Tap a bet type: Color, Number, or Big/Small.
          </div>
          <div className="mt-2">
            3) In Bet Slip, pick stake + multiplier and place the bet.
          </div>
          <div className="mt-2">
            4) When the round ends, the game generates a random result.
          </div>
        </div>
        <div className="mt-4 soft-divider" />
        <div className="mt-4 text-xs text-white/55">Tip: Play smart and manage your stake.</div>
      </div>

      <div className="mt-4">
        <AdSlot placement="howto_inline" title="Help Sponsored" height={120} rotate rotateEveryMs={1000 * 30} />
      </div>

      <div className="glass-panel rounded-3xl px-4 py-4 mt-4 mb-2">
        <div className="text-sm font-semibold tracking-wide">FAQ</div>
        <div className="mt-2 text-sm text-white/70">
          <div className="mt-2">Q: Can I use real money?</div>
          <div className="text-xs text-white/55">A: Contact support for details.</div>
          <div className="mt-3">Q: Why do I see Ads page?</div>
          <div className="text-xs text-white/55">A: It reserves consistent ad slots for your monetization.</div>
        </div>
      </div>
    </div>
  )
}

export default HowToPlayPage
