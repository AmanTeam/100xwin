import React from 'react'
import AdSlot from '../ui/AdSlot'

const AdsPage = () => {
  return (
    <div className="px-4">
      <div className="mt-4">
        <AdSlot placement="ads_feed" height={140} rotate rotateEveryMs={1000 * 18} />
      </div>
      <div className="mt-4">
        <AdSlot placement="ads_feed" height={220} rotate rotateEveryMs={1000 * 18} />
      </div>
      <div className="mt-4">
        <AdSlot placement="ads_feed" height={160} rotate rotateEveryMs={1000 * 18} />
      </div>
      <div className="mt-4 mb-2">
        <AdSlot placement="ads_feed" height={120} rotate rotateEveryMs={1000 * 18} />
      </div>
    </div>
  )
}

export default AdsPage
