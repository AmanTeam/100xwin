import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { apiFetch, getAuthToken, setAuthToken } from '../api/client'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(getAuthToken())
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const t = getAuthToken()
    setToken(t)
    setReady(true)
  }, [])

  const login = async ({ email, password }) => {
    const res = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    setAuthToken(res?.token || '')
    setToken(res?.token || '')
    setUser(res?.user || null)
    return res
  }

  const register = async ({ email, password }) => {
    const res = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    setAuthToken(res?.token || '')
    setToken(res?.token || '')
    setUser(res?.user || null)
    return res
  }

  const logout = () => {
    setAuthToken('')
    setToken('')
    setUser(null)
  }

  const value = useMemo(
    () => ({ token, user, ready, isAuthenticated: Boolean(token), login, register, logout }),
    [ready, token, user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('AuthProvider missing')
  return ctx
}
