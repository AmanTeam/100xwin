import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { apiFetch, getAuthToken } from '../api/client'
import { useAuth } from './authContext'

const WalletContext = createContext(null)

const createTx = ({ type, amount, note }) => ({
  id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
  type,
  amount,
  note: note || '',
  createdAt: Date.now(),
})

export const WalletProvider = ({ children }) => {
  const { ready: authReady, isAuthenticated } = useAuth()
  const [balance, setBalance] = useState(0)
  const [bonusLocked, setBonusLocked] = useState(100)
  const [transactions, setTransactions] = useState([])
  const [ready, setReady] = useState(false)

  const refresh = async () => {
    const walletRes = await apiFetch('/wallet')
    const txRes = await apiFetch('/transactions')
    setBalance(Number(walletRes?.wallet?.balance || 0))
    setBonusLocked(Number(walletRes?.wallet?.bonus_locked || 0))
    setTransactions(
      Array.isArray(txRes?.transactions)
        ? txRes.transactions.map((t) => ({
            id: t.id,
            type: t.type,
            amount: t.amount,
            note: t.note || '',
            createdAt: new Date(t.created_at).getTime(),
          }))
        : []
    )
  }

  const withdrawable = Math.max(0, Number(balance || 0) - Math.max(0, Number(bonusLocked || 0)))

  useEffect(() => {
    const bootstrap = async () => {
      if (!authReady) return

      setReady(false)

      if (!isAuthenticated) {
        setBalance(0)
        setBonusLocked(100)
        setTransactions([])
        setReady(true)
        return
      }

      const token = getAuthToken()
      if (!token) {
        setBalance(0)
        setBonusLocked(100)
        setTransactions([])
        setReady(true)
        return
      }

      try {
        await refresh()
      } finally {
        setReady(true)
      }
    }

    bootstrap().catch(() => setReady(true))
  }, [authReady, isAuthenticated])

  const addMoney = (amount, note) => {
    const n = Number(amount)
    if (!Number.isFinite(n) || n <= 0) throw new Error('Invalid amount')
    return apiFetch('/payments/create', {
      method: 'POST',
      body: JSON.stringify({
        amount: Math.trunc(n),
        currency: 'INR',
        provider: 'wallet',
        reference: note || 'Deposit',
        meta: { note: note || '' },
      }),
    })
      .then((r) =>
        apiFetch('/payments/confirm', {
          method: 'POST',
          body: JSON.stringify({ payment_id: r?.payment?.id }),
        })
      )
      .then(() => refresh())
  }

  const withdrawMoney = (amount, note) => {
    const n = Number(amount)
    if (!Number.isFinite(n) || n <= 0) throw new Error('Invalid amount')
    return apiFetch('/wallet/withdraw', {
      method: 'POST',
      body: JSON.stringify({ amount: Math.trunc(n), note: note || 'Withdrawn' }),
    }).then(() => refresh())
  }

  const applyGameDelta = ({ delta, note }) => {
    const n = Number(delta)
    if (!Number.isFinite(n) || n === 0) return Promise.resolve()
    const endpoint = n > 0 ? '/wallet/credit' : '/wallet/debit'
    return apiFetch(endpoint, {
      method: 'POST',
      body: JSON.stringify({ amount: Math.abs(Math.trunc(n)), note: note || 'Game' }),
    }).then(() => refresh())
  }

  const value = useMemo(
    () => ({ balance, bonusLocked, withdrawable, transactions, addMoney, withdrawMoney, applyGameDelta, refresh, ready }),
    [balance, bonusLocked, withdrawable, transactions, ready]
  )

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

export const useWallet = () => {
  const ctx = useContext(WalletContext)
  if (!ctx) throw new Error('WalletProvider missing')
  return ctx
}
