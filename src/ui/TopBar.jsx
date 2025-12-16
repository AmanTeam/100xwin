import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const TopBar = ({ title, subtitle, right }) => {
  return (
    <div className="px-4 pt-4">
      <div className="glass-panel rounded-3xl px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="chip">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-[11px] tracking-wide">LIVE</span>
              </div>
              <div className="chip">
                <FontAwesomeIcon icon="fa-solid fa-bolt" />
                <span className="text-[11px] tracking-wide">NEON</span>
              </div>
            </div>
            <h1 className="mt-3 text-[20px] font-semibold tracking-wide truncate">{title}</h1>
            {subtitle ? (
              <p className="mt-1 text-[12px] text-white/60 truncate">{subtitle}</p>
            ) : null}
          </div>
          <div className="shrink-0">{right}</div>
        </div>
      </div>
    </div>
  )
}

export default TopBar
