import React from 'react'

const colorChipClass = (color) => {
  if (color === 'Red') return 'bg-red-500/25 border-red-400/40'
  if (color === 'Green') return 'bg-emerald-500/25 border-emerald-400/40'
  return 'bg-violet-500/25 border-violet-400/40'
}

const HistoryPanel = ({ history }) => {
  const recent = (history || []).slice(-10).reverse()

  return (
    <div className="px-4 pb-5">
      <div className="glass-panel rounded-3xl overflow-hidden">
        <div className="px-4 py-4 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold tracking-wide">Game History</div>
            <div className="text-xs text-white/55">Last 10 rounds</div>
          </div>
          <div className="chip">
            <span className="text-[11px]">#{recent[0]?.Id ?? '-'}</span>
          </div>
        </div>
        <div className="soft-divider" />
        <div className="max-h-[220px] overflow-auto scroll-dark">
          {recent.length === 0 ? (
            <div className="px-4 py-8 text-center text-white/55">No rounds yet. Start a timer and place a bet.</div>
          ) : (
            <div className="px-3 py-3 grid gap-2">
              {recent.map((item, idx) => (
                <div
                  key={`${item.Id}-${idx}`}
                  className="rounded-2xl px-3 py-3"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.10)',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold">#{item.Id}</div>
                    <div className="text-xs text-white/55">{item.BigSmall}</div>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="text-2xl font-bold tracking-wide">{item.number}</div>
                    <div className={`px-3 py-1 rounded-full border text-xs font-semibold ${colorChipClass(item.color)}`}>
                      {item.color}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default HistoryPanel
