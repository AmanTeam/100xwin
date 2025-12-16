import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const ResultModal = ({ open, result, amount, proof, nextCommitHash, onClose }) => {
  if (!open) return null

  const isWin = result === 'win'

  const proofClientSeed = proof?.clientSeed || ''
  const proofServerSeedHash = proof?.serverSeedHash || ''
  const proofNonce = proof?.nonce
  const proofRevealedServerSeed = proof?.revealedServerSeed || ''

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClose()
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6 result-backdrop"
      style={{ background: 'rgba(0,0,0,0.68)' }}
    >
      <div className="w-[420px] max-w-[92vw]">
        <div className="glass-panel rounded-3xl p-5 relative overflow-hidden result-card">
          <div
            aria-hidden="true"
            className="absolute -inset-20"
            style={{
              background:
                isWin
                  ? 'radial-gradient(closest-side at 30% 30%, rgba(16,185,129,0.28), transparent 60%), radial-gradient(closest-side at 70% 40%, rgba(124,58,237,0.22), transparent 60%)'
                  : 'radial-gradient(closest-side at 30% 30%, rgba(239,68,68,0.26), transparent 60%), radial-gradient(closest-side at 70% 40%, rgba(124,58,237,0.18), transparent 60%)',
            }}
          />
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="chip">
                <span className={`w-2 h-2 rounded-full ${isWin ? 'bg-emerald-400' : 'bg-red-400'}`} />
                <span className="text-[11px] tracking-wide">RESULT</span>
              </div>
              <h2 className="mt-3 text-2xl font-semibold tracking-wide">
                {isWin ? 'You Won' : 'You Lost'}
              </h2>
              <p className="mt-1 text-white/65 text-sm">Tap anywhere to continue</p>
            </div>
            <div className="flex gap-2">
              {isWin ? (
                <>
                  <FontAwesomeIcon icon="fa-solid fa-face-smile-wink" className="text-2xl text-emerald-300" />
                  <FontAwesomeIcon icon="fa-solid fa-bolt" className="text-2xl text-violet-300" />
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon="fa-solid fa-face-sad-tear" className="text-2xl text-red-300" />
                  <FontAwesomeIcon icon="fa-solid fa-skull" className="text-2xl text-white/70" />
                </>
              )}
            </div>
          </div>

          <div className="mt-4 soft-divider" />

          <div className="mt-4 flex items-center justify-between">
            <div className="text-white/70 text-sm">Net change</div>
            <div className={`text-lg font-semibold ${isWin ? 'text-emerald-300' : 'text-red-300'}`}>
              {isWin ? '+' : '-'}₹{amount || 0}
            </div>
          </div>

          {false}

          <button type="button" className="mt-5 w-full neon-btn neon-btn--primary" onClick={onClose}>
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}

export default ResultModal
