import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useWallet } from '../context/walletContext'

const Wallet = () => {
  const { balance, addMoney, withdrawMoney } = useWallet()

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <div className="chip">
            <FontAwesomeIcon icon="fa-solid fa-wallet" />
            <span className="text-[11px] tracking-wide">WALLET</span>
          </div>
          <div className="chip">
            <span className="text-[11px] text-white/70">Balance</span>
            <span className="text-[11px] font-semibold">₹{balance}</span>
          </div>
        </div>
        <div className="mt-2 text-xs text-white/55">
          Quick controls (demo)
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            withdrawMoney(10, 'Quick withdraw').catch(() => {})
          }}
          type="button"
          className="neon-btn"
          style={{ borderColor: 'rgba(239, 68, 68, 0.35)' }}
        >
          -₹10
        </button>
        <button
          onClick={() => {
            addMoney(10, 'Quick add').catch(() => {})
          }}
          type="button"
          className="neon-btn neon-btn--primary"
        >
          +₹10
        </button>
      </div>
    </div>
  )
}

export default Wallet
