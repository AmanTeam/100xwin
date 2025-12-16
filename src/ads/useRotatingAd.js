import { useCallback, useEffect, useMemo, useState } from 'react'
import { ADS, DEFAULT_AD_ROTATION_OPTIONS } from './adInventory'
import { selectRotatedAd } from './adRotation'

const normalize = (v) => (v == null ? '' : String(v))

export const useRotatingAd = ({ placement, refreshMs = 0, enabled = true, ads = ADS, options } = {}) => {
  const placementKey = useMemo(() => normalize(placement), [placement])
  const mergedOptions = useMemo(
    () => ({ ...DEFAULT_AD_ROTATION_OPTIONS, ...(options || {}) }),
    [options]
  )

  const [ad, setAd] = useState(null)

  const refresh = useCallback(() => {
    if (!enabled) return
    if (!placementKey) return
    const result = selectRotatedAd({ ads, placement: placementKey, options: mergedOptions })
    setAd(result.ad)
  }, [ads, enabled, mergedOptions, placementKey])

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    const ms = Number(refreshMs || 0)
    if (!enabled) return
    if (!placementKey) return
    if (!ms || ms <= 0) return
    const id = setInterval(() => refresh(), ms)
    return () => clearInterval(id)
  }, [enabled, placementKey, refresh, refreshMs])

  return { ad, refresh }
}
