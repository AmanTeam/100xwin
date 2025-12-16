import React, { useEffect, useState } from 'react'

const Counter = ({ selectedDuration ,setreamaing5s ,countdown, setCountdown , gameId  }) => {
 


  useEffect(() => {
    if(selectedDuration === 0 ) return
   else {setCountdown(parseInt(selectedDuration))
  
    
    setreamaing5s(false);
  }
  }, [selectedDuration])

  useEffect(()=>{
  let intervalId = setInterval(() => {
            if (countdown > 0) {
              setCountdown(countdown - 1);
            }
            if (countdown < 7) {
              if(selectedDuration == 0 ) return 
                else{setreamaing5s(true)}
              
            }
          }, 1000);
        
    
        return () => clearInterval(intervalId);
  },[countdown])


  return (
    <div id='Counter' className='glass-panel relative rounded-3xl overflow-hidden'>
      <div className='px-4 py-4'>
        <div className='flex items-start justify-between gap-3'>
          <div>
            <div className='text-[11px] text-white/60 uppercase tracking-widest'>Time Remaining</div>
            <div className='mt-2 flex items-center gap-1 font-semibold'>
              <span className='rounded-xl px-2 py-1 text-sm sm:text-base'
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}>
                {(Math.floor(countdown / 60).toString().padStart(2, '0').split('')[0])}
              </span>
              <span className='rounded-xl px-2 py-1 text-sm sm:text-base'
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}>
                {(Math.floor(countdown / 60).toString().padStart(2, '0').split('')[1])}
              </span>
              <span className='px-1 text-white/70'>:</span>
              <span className='rounded-xl px-2 py-1 text-sm sm:text-base'
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}>
                {(countdown % 60).toString().padStart(2, '0').split('')[0]}
              </span>
              <span className='rounded-xl px-2 py-1 text-sm sm:text-base'
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}>
                {(countdown % 60).toString().padStart(2, '0').split('')[1]}
              </span>
            </div>
            <div className='mt-2 text-xs text-white/55'>Round #{gameId}</div>
          </div>

          <div className='chip'>
            <span className='text-[11px] text-white/70'>Mode</span>
            <span className='text-[11px] font-semibold'>{selectedDuration || 0}s</span>
          </div>
        </div>

        <div className='mt-4 h-2 w-full rounded-full overflow-hidden'
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}>
          <div
            className='h-full rounded-full'
            style={{
              width: selectedDuration ? `${Math.min(100, Math.max(0, (countdown / parseInt(selectedDuration)) * 100))}%` : '0%',
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

export default Counter
