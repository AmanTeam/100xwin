import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRotatingAd } from '../ads/useRotatingAd'
import { recordAdClick } from '../ads/adRotation'

const AdSlot = ({
  placement,
  rotate = false,
  rotateEveryMs = 0,
  title,
  height = 110,
  imageSrc,
  imageAlt = 'Ad',
  sponsor = 'Sponsored',
  headline = 'Limited-time offer',
  body = 'Try the premium experience with faster rounds.',
  primaryCta,
  secondaryCta,
  onPrimary,
  onSecondary,
  closable = false,
  closeAfterSeconds = 5,
  onClose,
}) => {
  const navigate = useNavigate()

  const { ad: rotatedAd } = useRotatingAd({
    placement,
    enabled: Boolean(placement),
    refreshMs: rotate ? rotateEveryMs : 0,
  })

  const effective = rotatedAd || {}

  const resolvedSponsor = rotatedAd ? effective.sponsor : sponsor
  const resolvedTitle = rotatedAd ? effective.title : title
  const resolvedHeadline = rotatedAd ? effective.headline : headline
  const resolvedBody = rotatedAd ? effective.body : body
  const resolvedImageSrc = rotatedAd ? effective.imageSrc : imageSrc
  const resolvedImageAlt = rotatedAd ? (effective.imageAlt || imageAlt) : imageAlt
  const resolvedPrimaryCta = rotatedAd ? effective.primaryCta : primaryCta
  const resolvedSecondaryCta = rotatedAd ? effective.secondaryCta : secondaryCta

  const totalMs = Math.max(0, Math.floor(closeAfterSeconds * 1000))
  const startedAt = useMemo(() => Date.now(), [])
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    if (!closable || totalMs === 0) return
    const id = setInterval(() => setNow(Date.now()), 80)
    return () => clearInterval(id)
  }, [closable, totalMs])

  const progress = useMemo(() => {
    if (!closable) return 1
    if (totalMs === 0) return 1
    const elapsed = now - startedAt
    return Math.max(0, Math.min(1, elapsed / totalMs))
  }, [closable, now, startedAt, totalMs])

  const canClose = !closable || progress >= 1

  const onCta = ({ kind }) => {
    const isPrimary = kind === 'primary'
    const callback = isPrimary ? onPrimary : onSecondary
    const urlKey = isPrimary ? 'primaryUrl' : 'secondaryUrl'

    if (rotatedAd?.id && placement) {
      recordAdClick({ placement, adId: rotatedAd.id })
    }

    if (callback) {
      callback()
      return
    }

    const url = rotatedAd ? effective[urlKey] : null
    if (!url) return
    if (typeof url === 'string' && (url.startsWith('http://') || url.startsWith('https://'))) {
      window.open(url, '_blank', 'noopener,noreferrer')
      return
    }
    navigate(url)
  }

  return (
    <div className="glass-panel rounded-3xl px-3 py-3" style={{ minHeight: height }}>
      {closable ? (
        <div
          className="rounded-full overflow-hidden"
          style={{ height: 3, background: 'rgba(255,255,255,0.08)' }}
        >
          <div
            style={{
              height: '100%',
              width: `${Math.round(progress * 100)}%`,
              background: 'linear-gradient(90deg, rgba(16,185,129,0.9), rgba(59,130,246,0.9))',
              transition: 'width 80ms linear',
            }}
          />
        </div>
      ) : null}

      <div className={closable ? 'mt-2' : ''}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 min-w-0">
            {resolvedImageSrc ? (
              <div
                className="shrink-0 rounded-2xl overflow-hidden"
                style={{ width: 48, height: 48, background: 'rgba(255,255,255,0.06)' }}
              >
                <img
                  src={resolvedImageSrc}
                  alt={resolvedImageAlt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ) : null}

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <div className="chip">
                  <span className="text-[10px] tracking-wide">AD</span>
                </div>
                <div className="text-[11px] text-white/60 truncate">{resolvedSponsor}</div>
              </div>
              {resolvedTitle ? (
                <div className="mt-1 text-[12px] font-semibold tracking-wide truncate">{resolvedTitle}</div>
              ) : null}
            </div>
          </div>

          {closable ? (
            <button
              type="button"
              className={`chip ${canClose ? '' : 'opacity-50'}`}
              disabled={!canClose}
              onClick={() => {
                if (!canClose) return
                onClose?.()
              }}
            >
              <span className="text-[10px] tracking-wide">Close</span>
            </button>
          ) : null}
        </div>

        <div className="mt-2">
          <div className="text-[11px] font-semibold text-white/80 truncate">{resolvedHeadline}</div>
          <div className="mt-0.5 text-[10px] text-white/55 leading-snug line-clamp-2">{resolvedBody}</div>
        </div>

        {resolvedPrimaryCta || resolvedSecondaryCta ? (
          <div className="mt-2 flex items-center justify-end gap-2">
            {resolvedSecondaryCta ? (
              <button
                type="button"
                className="neon-btn px-3 py-1.5 text-[10px]"
                onClick={() => onCta({ kind: 'secondary' })}
              >
                {resolvedSecondaryCta}
              </button>
            ) : null}
            {resolvedPrimaryCta ? (
              <button
                type="button"
                className="neon-btn neon-btn--primary px-3 py-1.5 text-[10px]"
                onClick={() => onCta({ kind: 'primary' })}
              >
                {resolvedPrimaryCta}
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default AdSlot
