import React from 'react'
import Container from '../Screen/Container'
import AdSlot from '../ui/AdSlot'

const HomePage = () => {
  return (
    <div className="px-4">
      <div className="mt-4">
        <AdSlot placement="home_top" title="Top Banner" height={120} rotate rotateEveryMs={1000 * 20} />
      </div>
      <div className="mt-4 pb-2">
        <Container />
      </div>
    </div>
  )
}

export default HomePage
