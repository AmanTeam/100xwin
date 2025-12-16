import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/authContext'

const RequireAuth = ({ redirectTo = '/login' }) => {
  const location = useLocation()
  const { ready, isAuthenticated } = useAuth()

  if (!ready) return null
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}

export default RequireAuth
