import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useWallet } from '../context/walletContext'
import { useAuth } from '../context/authContext'

const titles = {
  '/': { title: 'Color Trading', subtitle: 'Neon pool mode' },
  '/wallet': { title: 'Wallet', subtitle: 'Add & withdraw' },
  '/how-to-play': { title: 'How to Play', subtitle: 'Rules & tips' },
  '/ads': { title: 'Promotions', subtitle: 'Ad slots & offers' },
}

const HeaderBar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { balance } = useWallet()
  const { isAuthenticated, logout } = useAuth()
  const meta = titles[location.pathname] || { title: 'Color Trading', subtitle: '' }

  return (
    <div className="w-full">
      <div
        className="glass-panel header-surface px-4 py-4"
        style={{ borderRadius: '0 0 22px 22px', paddingTop: 'max(12px, env(safe-area-inset-top))' }}
      >
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
            <h1 className="mt-3 text-[18px] font-semibold tracking-wide truncate">{meta.title}</h1>
            {meta.subtitle ? <p className="mt-1 text-[12px] text-white/60 truncate">{meta.subtitle}</p> : null}
          </div>
          <div className="shrink-0 flex flex-col items-end">
            {isAuthenticated ? (
              <div className="chip">
                <FontAwesomeIcon icon="fa-solid fa-wallet" />
                <span className="text-[11px] text-white/70">₹{balance}</span>
              </div>
            ) : null}
            <div className="mt-2 flex items-center gap-2">
              {isAuthenticated ? (
                <>
                  <button
                    type="button"
                    className="chip"
                    onClick={() => navigate('/wallet', { state: { tab: 'add' } })}
                  >
                    <FontAwesomeIcon icon="fa-solid fa-plus" />
                    <span className="text-[11px] tracking-wide">ADD</span>
                  </button>
                  <button
                    type="button"
                    className="chip"
                    onClick={() => navigate('/wallet', { state: { tab: 'withdraw' } })}
                  >
                    <FontAwesomeIcon icon="fa-solid fa-arrow-up-from-bracket" />
                    <span className="text-[11px] tracking-wide">WD</span>
                  </button>
                </>
              ) : null}
              <button
                type="button"
                className="chip"
                onClick={() => navigate('/how-to-play')}
              >
                <FontAwesomeIcon icon="fa-solid fa-circle-info" />
                <span className="text-[11px] tracking-wide">INFO</span>
              </button>
              {isAuthenticated ? (
                <button
                  type="button"
                  className="chip"
                  onClick={() => {
                    logout()
                    navigate('/login', { replace: true })
                  }}
                >
                  <FontAwesomeIcon icon="fa-solid fa-right-from-bracket" />
                  <span className="text-[11px] tracking-wide">OUT</span>
                </button>
              ) : (
                <button type="button" className="chip" onClick={() => navigate('/login')}>
                  <FontAwesomeIcon icon="fa-solid fa-user" />
                  <span className="text-[11px] tracking-wide">LOGIN</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeaderBar
