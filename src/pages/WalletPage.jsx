import React, { useMemo, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useLocation } from 'react-router-dom'
import { useWallet } from '../context/walletContext'
import AdSlot from '../ui/AdSlot'

const fmt = (ts) => new Date(ts).toLocaleString()

const WalletPage = () => {
  const location = useLocation()
  const { balance, bonusLocked, withdrawable, addMoney, withdrawMoney, transactions } = useWallet()
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [mode, setMode] = useState(location?.state?.tab === 'withdraw' ? 'withdraw' : 'add')
  const [error, setError] = useState('')

  const quick = useMemo(() => ['100', '500', '1000', '5000'], [])

  const onSubmit = async () => {
    setError('')
    try {
      if (mode === 'add') {
        await addMoney(amount, note)
      } else {
        const n = Number(amount)
        if (!Number.isFinite(n) || n <= 0) throw new Error('Invalid amount')
        if (Math.trunc(n) < 100) throw new Error('Minimum withdraw is ₹100')
        if (Math.trunc(n) > Math.trunc(withdrawable || 0)) throw new Error('Insufficient withdrawable balance')
        await withdrawMoney(amount, note)
      }
      setAmount('')
      setNote('')
    } catch (e) {
      setError(e?.message || 'Something went wrong')
    }
  }

  return (
    <div className="px-4">
      <div className="glass-panel rounded-3xl px-4 py-4 mt-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold tracking-wide">Available Balance</div>
            <div className="text-xs text-white/55">Manage your balance and transactions</div>
          </div>
          <div className="chip">
            <FontAwesomeIcon icon="fa-solid fa-wallet" />
            <span className="text-[11px] font-semibold">₹{balance}</span>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-2xl px-3 py-3" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)' }}>
            <div className="text-xs text-white/55">Bonus (locked)</div>
            <div className="mt-1 text-sm font-semibold">₹{bonusLocked || 0}</div>
          </div>
          <div className="rounded-2xl px-3 py-3" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)' }}>
            <div className="text-xs text-white/55">Withdrawable</div>
            <div className="mt-1 text-sm font-semibold">₹{withdrawable || 0}</div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            className={`neon-btn ${mode === 'add' ? 'neon-btn--primary' : ''}`}
            onClick={() => setMode('add')}
          >
            Add Money
          </button>
          <button
            type="button"
            className={`neon-btn ${mode === 'withdraw' ? 'neon-btn--primary' : ''}`}
            onClick={() => setMode('withdraw')}
          >
            Withdraw
          </button>
        </div>

        <div className="mt-4">
          <div className="text-xs text-white/55">Quick amount</div>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {quick.map((q) => (
              <button key={q} type="button" className="neon-btn" onClick={() => setAmount(q)}>
                ₹{q}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <div className="text-xs text-white/55">Amount</div>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            inputMode="numeric"
            placeholder="Enter amount"
            className="mt-2 w-full rounded-2xl px-4 py-3"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.9)' }}
          />
          <div className="mt-3 text-xs text-white/55">Note (optional)</div>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="UPI / bank / promo"
            className="mt-2 w-full rounded-2xl px-4 py-3"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.9)' }}
          />

          {error ? <div className="mt-3 text-sm" style={{ color: 'rgba(248,113,113,0.95)' }}>{error}</div> : null}

          <button type="button" className="mt-4 w-full neon-btn neon-btn--primary" onClick={onSubmit}>
            {mode === 'add' ? 'Confirm Add' : 'Confirm Withdraw'}
          </button>
        </div>
      </div>

      <div className="mt-4">
        <AdSlot placement="wallet_inline" title="Wallet Sponsored" height={120} rotate rotateEveryMs={1000 * 25} />
      </div>

      <div className="glass-panel rounded-3xl px-4 py-4 mt-4 mb-2">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold tracking-wide">Transactions</div>
            <div className="text-xs text-white/55">Latest first</div>
          </div>
          <div className="chip">
            <span className="text-[11px]">{transactions.length}</span>
          </div>
        </div>
        <div className="mt-3 soft-divider" />

        <div className="mt-3 grid gap-2 max-h-[360px] overflow-auto scroll-dark">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="rounded-2xl px-3 py-3"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)' }}
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">{tx.type.toUpperCase()}</div>
                <div className={`text-sm font-semibold ${tx.type === 'credit' || tx.type === 'win' ? 'text-emerald-300' : 'text-red-300'}`}>
                  {tx.type === 'credit' || tx.type === 'win' ? '+' : '-'}₹{tx.amount}
                </div>
              </div>
              <div className="mt-1 text-xs text-white/55">{tx.note || '-'}</div>
              <div className="mt-1 text-[11px] text-white/45">{fmt(tx.createdAt)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default WalletPage
