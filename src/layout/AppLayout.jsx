import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import GameShell from '../ui/GameShell'
import AdSlot from '../ui/AdSlot'
import HeaderBar from './HeaderBar'
import BottomNav from './BottomNav'

const AppLayout = () => {
  const [isBottomAdDismissed, setIsBottomAdDismissed] = React.useState(false)
  const location = useLocation()
  const showGlobalAd = location.pathname !== '/ads'
  return (
    <GameShell>
      <div className="h-screen w-screen flex flex-col overflow-hidden">
        <HeaderBar />
        <div className="flex-1 overflow-y-auto scroll-dark">
          <Outlet />
        </div>
        {showGlobalAd && !isBottomAdDismissed ? (
          <div className="px-4 pb-2">
            <AdSlot
              placement="global_bottom"
              height={96}
              sponsor="Promoted"
              headline="Get bonus on top-up"
              body="Limited time. Add funds and unlock extra rounds."
              primaryCta="Top up"
              secondaryCta="Details"
              rotate
              rotateEveryMs={1000 * 20}
              closable
              closeAfterSeconds={6}
              onClose={() => setIsBottomAdDismissed(true)}
            />
          </div>
        ) : null}
        <BottomNav />
      </div>
    </GameShell>
  )
}

export default AppLayout
