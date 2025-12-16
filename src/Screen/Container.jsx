import React, { useEffect } from 'react'
import Counter  from '../Components/Counter'
import SecondBtn from '../Components/SecondBtn'
import { useState } from 'react';
import ColorBall from '../ui/ColorBall'
import BetSlip from '../ui/BetSlip'
import ResultModal from '../ui/ResultModal'
import { useWallet } from '../context/walletContext'
import BetProgress from '../ui/BetProgress'
import { apiFetch } from '../api/client'
const durations = ["30", "60", "180"];
const numbers = Array.from({ length: 10 }, (_, i) => i);
const colors = ["Green", "Violet", "Red"];
const BigSmall = ["Big", "Small"];

const hexFromBytes = (bytes) => Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')

const sha256Hex = async (message) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(String(message))
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return hexFromBytes(new Uint8Array(hashBuffer))
}

const randomHex = (lengthBytes = 16) => {
  const bytes = new Uint8Array(lengthBytes)
  crypto.getRandomValues(bytes)
  return hexFromBytes(bytes)
}

const bytesFromHex = (hex) => {
  const normalized = String(hex || '').toLowerCase().replace(/^0x/, '')
  const out = new Uint8Array(Math.floor(normalized.length / 2))
  for (let i = 0; i < out.length; i += 1) {
    out[i] = Number.parseInt(normalized.slice(i * 2, i * 2 + 2), 16)
  }
  return out
}


const Container = () => {
  const { balance, refresh, ready } = useWallet()

  const [gameId, setGameId] = useState(10050);
  const [selectedDuration, setSelectedDuration] = useState(0 );
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedBigSmall, setSelectedBigSmall] = useState(null);
 const [betType, setBetType] = useState(null);
const [betStatus, setBetStatus] = useState(false);
 const [placebetstatus,setPlacebetstatus] =  useState(false);
 const [betmultipler, setBetmultipler] = useState(null);
  const [betAmount, setBetAmount] = useState(null);
  const [history, setHistory] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [countdown, setCountdown] = useState(0);
const [reamaing5s, setreamaing5s] = useState(false);
const [reamaing5sCount, setreamaing5sCount] = useState(0);

  const [reslut, setReslut] = useState(null); 

  const [fairness, setFairness] = useState({
    clientSeed: '',
    serverSeedHash: '',
    revealedServerSeed: '',
    nonce: null,
  })

  const [nextCommitHash, setNextCommitHash] = useState('')

  const [lockedBet, setLockedBet] = useState(null)
  const [netDelta, setNetDelta] = useState(0)


  const PlaceBet= (e)=>{
    if (lockedBet) return
    setBetType(e)
    setPlacebetstatus(true);
  }

  
  const handleBetStatus = ()=>{
    if(betmultipler=== null &&  betAmount=== null) return alert("Please select bet multiplier and bet amount");  
    else if(betmultipler=== null) return alert("Please select bet multiplier");
    else if(betAmount=== null) return alert("Please select bet amount");
    else if (balance === 0  )  return alert("You have not amount to do Bet ")
      else if((betmultipler * betAmount) > balance)  return alert(`You have not sufficent amount to do Bet  , your balance ${balance}`)
    else{
      setBetStatus(true);
      setPlacebetstatus(false) 

      const stake = Number((betmultipler * betAmount) || 0)

      setLockedBet({
        roundId: gameId,
        type: betType,
        amount: betAmount,
        multiplier: betmultipler,
        total: stake,
        createdAt: Date.now(),
      })

      apiFetch('/game/place-bet', {
        method: 'POST',
        body: JSON.stringify({
          bet_type: betType,
          stake,
          multiplier: betmultipler,
        }),
      })
        .then(() => refresh())
        .catch((e) => {
          alert(e?.message || 'Failed to place bet')
          setBetStatus(false)
          setLockedBet(null)
        })

      setSelectedBigSmall("") 
      setSelectedNumber("")   
      setSelectedColor('');
    
    }
    
    

  }



useEffect(()=>{
if (selectedDuration === 0) {
  setSelectedDuration('0')
}

 
  if (reamaing5s === true) {
    setreamaing5sCount(5)
  }else{
    setreamaing5sCount(0)
  }
},[reamaing5s])

useEffect(()=>{
  // console.log(reslut);
  
  let intervalId = setInterval(() => {
  
    if (reamaing5sCount === 0)  return setreamaing5sCount(0)
  //  console.log(reamaing5s);
   
    if(reamaing5sCount ===  1){
    
      setShowResult(true)
       setCountdown(parseInt(selectedDuration) )
       setreamaing5s(false)
       setPlacebetstatus(false)
    
    }
    setreamaing5sCount(reamaing5sCount - 1);
    
  }, 1000);
  

  return () => clearInterval(intervalId);
},[reamaing5sCount])

  useEffect(() => {
    if (!ready) return
    const stored = localStorage.getItem('clientSeed')
    const clientSeed = stored || randomHex(16)
    if (!stored) localStorage.setItem('clientSeed', clientSeed)

    apiFetch('/game/current-round')
      .then((r) => {
        const round = r?.round
        if (!round) return
        setGameId(Number(round.id))
        setNextCommitHash(String(round.server_seed_hash || ''))
        setFairness({
          clientSeed,
          serverSeedHash: String(round.server_seed_hash || ''),
          revealedServerSeed: '',
          nonce: Number(round.id),
        })
      })
      .catch(() => {})
  }, [])




const evaluateBet = async () => {
  const roundId = gameId
  const clientSeed = localStorage.getItem('clientSeed') || fairness.clientSeed || randomHex(16)
  if (!localStorage.getItem('clientSeed')) localStorage.setItem('clientSeed', clientSeed)

  const resp = await apiFetch('/game/settle-round', {
    method: 'POST',
    body: JSON.stringify({ client_seed: clientSeed }),
  })

  const settled = resp?.settled_round
  const next = resp?.next_round
  const result = settled?.result

  if (result) {
    setHistory([...history, { Id: roundId, number: result.number, color: result.color, BigSmall: result.bigSmall }])
  }

  setFairness({
    clientSeed: settled?.client_seed || clientSeed,
    serverSeedHash: settled?.server_seed_hash || '',
    revealedServerSeed: settled?.server_seed || '',
    nonce: settled?.id || roundId,
  })

  setNextCommitHash(next?.server_seed_hash || '')
  setGameId(Number(next?.id || (roundId + 1)))

  if (lockedBet && betStatus === true && result && settled?.pool) {
    const matched = lockedBet.type === result.color || lockedBet.type === String(result.number) || lockedBet.type === result.bigSmall
    const poolTotal = Number(settled.pool.poolTotal || 0)
    const fee = Number(settled.pool.fee || 0)
    const prizePool = poolTotal - fee
    const totalWinningStake = Number(settled.pool.totalWinningStake || 0)
    const stake = Number(lockedBet.total || 0)
    const payout = matched && totalWinningStake > 0 ? Math.floor(prizePool * (stake / totalWinningStake)) : 0
    const delta = payout - stake
    setNetDelta(delta)
    setReslut(matched && payout > 0 ? 'win' : 'loss')
  } else {
    setNetDelta(0)
  }

  await refresh()

  setShowResult(false);
};

  useEffect(() => {
    // console.log(showResult , history);
    
      if (showResult) {
          evaluateBet();
          setLockedBet(null)
          setSelectedNumber('')
          setSelectedColor('')
          setSelectedBigSmall('')
          setBetType('')
  
      }
  }, [showResult]);






  return (
    <>
      <ResultModal
        open={Boolean(reslut)}
        result={reslut}
        amount={Math.abs(netDelta || 0)}
        proof={fairness}
        nextCommitHash={nextCommitHash}
        onClose={() => {
          setReslut(null)
          setBetStatus(false)
          setBetmultipler(null)
          setBetAmount(null)
          setNetDelta(0)
        }}
      />

      <div className="mt-4">
        <BetProgress open={Boolean(lockedBet)} bet={lockedBet} countdown={countdown} selectedDuration={selectedDuration} />
      </div>

      <div className="mt-4">
        <SecondBtn
          durations={durations}
          selectedDuration={selectedDuration}
          setSelectedDuration={setSelectedDuration}
        />
      </div>

      <div className="mt-3">
        <Counter
          gameId={gameId}
          selectedDuration={selectedDuration}
          setreamaing5s={setreamaing5s}
          countdown={countdown}
          setCountdown={setCountdown}
        />
      </div>

      <div className="mt-4">
        <div className="glass-panel rounded-3xl p-4 relative overflow-hidden">
          {reamaing5sCount > 0 && (
            <div
              className="absolute inset-0 flex justify-center items-center text-white font-extrabold text-5xl"
              style={{ background: 'rgba(0,0,0,0.62)' }}
            >
              {reamaing5sCount}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold tracking-wide">Pick your bet</div>
              <div className="text-xs text-white/55">Color, number, or big/small</div>
            </div>
            <div className="chip">
              <span className="text-[11px] text-white/60">Selected</span>
              <span className="text-[11px] font-semibold">{String(betType || '-')}</span>
            </div>
          </div>

          <div className="mt-4 soft-divider" />

          <div className="mt-4 grid grid-cols-3 gap-4 justify-items-center">
            {colors.map((color) => (
              <ColorBall
                key={color}
                label={color}
                kind={color}
                active={selectedColor === color}
                badge={color === 'Green' ? 'G' : color === 'Violet' ? 'V' : 'R'}
                onClick={() => {
                  if (lockedBet) return
                  setSelectedColor(color)
                  setSelectedNumber('')
                  setSelectedBigSmall('')
                  PlaceBet(color)
                }}
              />
            ))}
          </div>

          <div className="mt-6">
            <div className="text-xs text-white/55">Numbers</div>
            <div className="mt-3 grid grid-cols-5 gap-3 justify-items-center">
              {numbers.map((number) => (
                <ColorBall
                  key={number}
                  label={String(number)}
                  kind="Neutral"
                  active={selectedNumber === number}
                  badge={number}
                  onClick={() => {
                    if (lockedBet) return
                    setSelectedNumber(number)
                    setSelectedColor('')
                    setSelectedBigSmall('')
                    PlaceBet(number)
                  }}
                />
              ))}
            </div>
          </div>

          <div className="mt-6">
            <div className="text-xs text-white/55">Big / Small</div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {BigSmall.map((bigSmall) => (
                <button
                  key={bigSmall}
                  type="button"
                  className={`neon-btn ${selectedBigSmall === bigSmall ? 'neon-btn--primary' : ''}`}
                  onClick={() => {
                    if (lockedBet) return
                    PlaceBet(bigSmall)
                    setSelectedBigSmall(bigSmall)
                    setSelectedNumber('')
                    setSelectedColor('')
                  }}
                >
                  {bigSmall}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <BetSlip
        open={placebetstatus === true}
        betType={betType}
        selectedDuration={selectedDuration}
        betAmount={betAmount}
        setBetAmount={setBetAmount}
        betmultipler={betmultipler}
        setBetmultipler={setBetmultipler}
        total={(betmultipler * betAmount) || 0}
        onCancel={() => {
          setPlacebetstatus(false)
          setSelectedBigSmall('')
          setSelectedNumber('')
          setSelectedColor('')
          setBetmultipler(null)
          setBetAmount(null)
        }}
        onConfirm={() => handleBetStatus()}
      />
    </>
  )
}

export default Container
