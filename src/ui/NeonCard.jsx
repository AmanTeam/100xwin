import React from 'react'

const NeonCard = ({ className = '', children }) => {
  return <div className={`glass-panel rounded-3xl ${className}`}>{children}</div>
}

export default NeonCard
