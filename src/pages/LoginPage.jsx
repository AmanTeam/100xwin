import React, { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/authContext'

const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, register } = useAuth()

  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const target = useMemo(() => {
    const from = location?.state?.from
    return typeof from === 'string' && from.startsWith('/') ? from : '/'
  }, [location?.state?.from])

  const onSubmit = async () => {
    setError('')
    setLoading(true)
    try {
      if (!email || !password) throw new Error('Email and password required')
      if (mode === 'login') await login({ email, password })
      else await register({ email, password })
      navigate(target, { replace: true })
    } catch (e) {
      setError(e?.message || 'Failed')
    } finally {
      setLoading(false)
    }
  }

  const onFormSubmit = async (e) => {
    e.preventDefault()
    await onSubmit()
  }

  return (
    <div className="px-4">
      <div className="glass-panel rounded-3xl px-4 py-4 mt-4">
        <div className="text-sm font-semibold tracking-wide">Account</div>
        <div className="text-xs text-white/55">Sign in to continue</div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            className={`neon-btn ${mode === 'login' ? 'neon-btn--primary' : ''}`}
            onClick={() => setMode('login')}
            disabled={loading}
          >
            Login
          </button>
          <button
            type="button"
            className={`neon-btn ${mode === 'register' ? 'neon-btn--primary' : ''}`}
            onClick={() => setMode('register')}
            disabled={loading}
          >
            Register
          </button>
        </div>

        <form className="mt-4" onSubmit={onFormSubmit}>
          <div className="text-xs text-white/55">Email</div>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            inputMode="email"
            name="email"
            autoComplete="email"
            placeholder="Enter email"
            className="mt-2 w-full rounded-2xl px-4 py-3"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.9)',
            }}
          />

          <div className="mt-3 text-xs text-white/55">Password</div>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            name="password"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            placeholder="Enter password"
            className="mt-2 w-full rounded-2xl px-4 py-3"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.9)',
            }}
          />

          {error ? <div className="mt-3 text-sm" style={{ color: 'rgba(248,113,113,0.95)' }}>{error}</div> : null}

          <button
            type="submit"
            className="mt-4 w-full neon-btn neon-btn--primary"
            disabled={loading}
          >
            {loading ? 'Please wait…' : mode === 'login' ? 'Login' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
