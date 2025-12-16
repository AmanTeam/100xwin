import React, { useRef, useState } from 'react'

const kindToClass = {
  Green: 'ball--green',
  Red: 'ball--red',
  Violet: 'ball--violet',
}

const ColorBall = ({ label, kind, active, onClick, sublabel, badge, striped = false }) => {
  const ballClass = kindToClass[kind] || 'ball--neutral'
  const [burst, setBurst] = useState(false)
  const burstTimeoutRef = useRef(null)

  const handleClick = () => {
    if (burstTimeoutRef.current) clearTimeout(burstTimeoutRef.current)
    setBurst(false)
    requestAnimationFrame(() => {
      setBurst(true)
      burstTimeoutRef.current = setTimeout(() => setBurst(false), 550)
    })
    onClick?.()
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`flex flex-col items-center gap-2 focus:outline-none select-none`}
    >
      <div className={`ball ball--pool ${ballClass} ${striped ? 'ball--striped' : ''} ${active ? 'ball--active' : ''} ${burst ? 'ball--burst' : ''}`}>
        <div className="ball__ring" aria-hidden="true" />
        {badge !== undefined && badge !== null ? (
          <div className="ball__badge" aria-hidden="true">
            {badge}
          </div>
        ) : null}
      </div>
      <div className="text-center">
        <div className={`text-[12px] font-semibold ${active ? 'text-white' : 'text-white/80'}`}>
          {label}
        </div>
        {sublabel ? <div className="text-[11px] text-white/50">{sublabel}</div> : null}
      </div>
    </button>
  )
}

export default ColorBall
