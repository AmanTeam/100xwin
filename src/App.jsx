import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './layout/AppLayout'
import HomePage from './pages/HomePage'
import WalletPage from './pages/WalletPage'
import HowToPlayPage from './pages/HowToPlayPage'
import AdsPage from './pages/AdsPage'
import LoginPage from './pages/LoginPage'
import RequireAuth from './ui/RequireAuth'


const App = () => {
  return ( 
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<RequireAuth />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/how-to-play" element={<HowToPlayPage />} />
          <Route path="/ads" element={<AdsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
