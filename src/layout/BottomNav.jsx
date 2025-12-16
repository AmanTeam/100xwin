import React from 'react'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const NavItem = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center justify-center gap-1 rounded-2xl px-3 py-2 transition ${
          isActive ? 'neon-btn neon-btn--primary' : 'neon-btn'
        }`
      }
    >
      <FontAwesomeIcon icon={icon} />
      <span className="text-[10px] tracking-wide text-white/75">{label}</span>
    </NavLink>
  )
}

const BottomNav = () => {
  return (
    <div className="w-full">
      <div
        className="glass-panel bottomnav-surface px-4 py-3"
        style={{
          borderRadius: '22px 22px 0 0',
          paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
        }}
      >
        <div className="grid grid-cols-4 gap-2 max-w-[520px] mx-auto">
          <NavItem to="/" icon="fa-solid fa-dice" label="Play" />
          <NavItem to="/wallet" icon="fa-solid fa-money-bill-wave" label="Wallet" />
          <NavItem to="/how-to-play" icon="fa-solid fa-circle-question" label="Help" />
          <NavItem to="/ads" icon="fa-solid fa-bullhorn" label="Ads" />
        </div>
      </div>
    </div>
  )
}

export default BottomNav
