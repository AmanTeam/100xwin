import React, { useEffect } from 'react'

const Timer = ({setShowResult , showResult}) => {
     const [timer, setTimer] = React.useState(0)
     const [remaing5s, setRemaing5s] = React.useState(0)

useEffect(()=>{

 const intervalId = setInterval(() => {
  if  (timer  == 0) return
  if (timer  == 5) setRemaing5s(5) 
    setTimer(timer - 1)
 }, 1000);
return () => clearInterval(intervalId);
}, [timer])

useEffect(()=>{
    // console.log(showResult);
    // console.log(remaing5s);
    const interval5s =  setInterval(() => {
        if  (remaing5s < 1) return
        if  (remaing5s == 1){ 
            setTimer(15)
            setShowResult(true)
           
        }else{
                setShowResult(false)
            } 
        setRemaing5s(remaing5s -1)

    },1000)
    return () => clearInterval(interval5s);
},[remaing5s])





  return (
    <div>
  <button
  onClick={()=>{ console.log("hello") 
setTimer(15)
   }} ></button>
{/*  */}
<br />
<p className='border mx-20 text-white font-semibold mt-1'>
  <span className='  bg-slate-700  mr-1 p-1 '>0</span> 
<span className=' bg-slate-700 p-1'>0</span>
<span className=' bg-slate-700 px-1 mx-1 '>:</span>
 <span className=' bg-slate-700 p-1 mr-1'>{timer}</span>
  <span className=' bg-slate-700 p-1' >0</span>
  </p>

  </div>
  )
}

export default Timer
