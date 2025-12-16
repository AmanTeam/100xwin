import React from 'react'

const SecondBtn = ({durations  ,setSelectedDuration , selectedDuration}) => {
  
  return (
  <>
  <div className="grid grid-cols-3 gap-2">
    {durations.map((duration) => (
      <button
        key={duration}
        type="button"
        className={`neon-btn ${selectedDuration === duration ? 'neon-btn--primary' : ''}`}
        onClick={() => {
          setSelectedDuration(duration || 30)
        }}
      >
        <div className="text-[11px] text-white/65 uppercase tracking-widest">Win Go</div>
        <div className="mt-1 text-sm font-semibold">
          {duration === '30' && '30 sec'}
          {duration === '60' && '1 min'}
          {duration === '180' && '3 min'}
        </div>
      </button>
    ))}
  </div>
  </>

  )
}

export default SecondBtn
