const STORAGE_KEY = 'ad_rotation_v1'

const dayKey = (ts = Date.now()) => {
  const d = new Date(ts)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

const safeJsonParse = (raw, fallback) => {
  try {
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export const loadAdRotationState = () => {
  if (typeof window === 'undefined') return { placements: {}, version: 1 }
  return (
    safeJsonParse(window.localStorage.getItem(STORAGE_KEY), null) || {
      version: 1,
      placements: {},
    }
  )
}

export const saveAdRotationState = (state) => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

const ensurePlacementState = (state, placement) => {
  const next = { ...state }
  next.placements = next.placements || {}
  const existing = next.placements[placement]
  if (existing) return next
  next.placements[placement] = {
    history: [],
    lastShownAt: {},
    impressionsByDay: {},
  }
  return next
}

const weightedPick = (items, weightOf) => {
  const weights = items.map((i) => Math.max(0, Number(weightOf(i) || 0)))
  const total = weights.reduce((a, b) => a + b, 0)
  if (total <= 0) return null
  const r = Math.random() * total
  let acc = 0
  for (let idx = 0; idx < items.length; idx += 1) {
    acc += weights[idx]
    if (r <= acc) return items[idx]
  }
  return items[items.length - 1] || null
}

const isEligible = ({ ad, placementState, now, today }) => {
  if (!ad) return false
  if (ad.active === false) return false

  if (ad.startAt && now < Number(ad.startAt)) return false
  if (ad.endAt && now > Number(ad.endAt)) return false

  const last = Number(placementState?.lastShownAt?.[ad.id] || 0)
  const cooldownMs = Math.max(0, Number(ad.cooldownMs || 0))
  if (cooldownMs > 0 && last > 0 && now - last < cooldownMs) return false

  const maxPerDay = Number(ad.maxImpressionsPerDay || 0)
  if (maxPerDay > 0) {
    const count = Number(placementState?.impressionsByDay?.[today]?.[ad.id] || 0)
    if (count >= maxPerDay) return false
  }

  return true
}

export const selectRotatedAd = ({ ads, placement, options }) => {
  const now = Date.now()
  const today = dayKey(now)
  const historySize = Math.max(0, Number(options?.historySize ?? 4))

  const state0 = ensurePlacementState(loadAdRotationState(), placement)
  const placementState = state0.placements[placement]
  const history = Array.isArray(placementState.history) ? placementState.history : []
  const recent = new Set(history.slice(0, historySize))

  const candidates0 = (ads || []).filter((a) => Array.isArray(a.placements) && a.placements.includes(placement))

  const eligible = candidates0.filter((ad) => isEligible({ ad, placementState, now, today }))
  const eligibleNotRecent = eligible.filter((ad) => !recent.has(ad.id))

  const pool = eligibleNotRecent.length > 0 ? eligibleNotRecent : eligible
  const picked = weightedPick(pool, (ad) => ad.weight ?? 1)

  if (!picked) {
    return { ad: null, state: state0 }
  }

  const nextState = ensurePlacementState(state0, placement)
  const ps = nextState.placements[placement]

  ps.lastShownAt = { ...(ps.lastShownAt || {}), [picked.id]: now }

  const prevHistory = Array.isArray(ps.history) ? ps.history : []
  ps.history = [picked.id, ...prevHistory.filter((x) => x !== picked.id)].slice(0, Math.max(10, historySize * 3))

  ps.impressionsByDay = ps.impressionsByDay || {}
  ps.impressionsByDay[today] = ps.impressionsByDay[today] || {}
  ps.impressionsByDay[today][picked.id] = Number(ps.impressionsByDay[today][picked.id] || 0) + 1

  saveAdRotationState(nextState)
  return { ad: picked, state: nextState }
}

export const recordAdClick = ({ placement, adId }) => {
  if (!adId) return
  const now = Date.now()
  const today = dayKey(now)
  const state0 = ensurePlacementState(loadAdRotationState(), placement)
  const ps = state0.placements[placement]

  ps.clicksByDay = ps.clicksByDay || {}
  ps.clicksByDay[today] = ps.clicksByDay[today] || {}
  ps.clicksByDay[today][adId] = Number(ps.clicksByDay[today][adId] || 0) + 1

  saveAdRotationState(state0)
}
