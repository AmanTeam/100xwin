import React from 'react'

const GameShell = ({ children }) => {
  return (
    <div className="app-surface safe-bottom scroll-dark">{children}</div>
  )
}

export default GameShell
