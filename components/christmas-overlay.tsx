'use client'

import { useEffect, useState } from 'react'
import { getChristmasTime } from './christmas-time'

const snowflakes = Array.from({ length: 22 }, (_, index) => ({
  left: `${(index * 47) % 100}%`,
  delay: `${(index % 9) * 0.7}s`,
  duration: `${7 + (index % 5)}s`,
  size: `${3 + (index % 4)}px`,
}))

export function ChristmasOverlay() {
  const [visible, setVisible] = useState(false)
  const [dismissing, setDismissing] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const syncChristmasDay = () => {
      const isChristmasDay = getChristmasTime(new Date()).isChristmasDay
      setVisible(isChristmasDay && !dismissed)
    }
    syncChristmasDay()
    const interval = window.setInterval(syncChristmasDay, 1000)
    const handleVisibility = () => { if (document.visibilityState === 'visible') syncChristmasDay() }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => {
      window.clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [dismissed])

  useEffect(() => {
    if (!visible) return
    const dismiss = () => setDismissing((current) => current || true)
    window.addEventListener('keydown', dismiss, { once: true })
    return () => window.removeEventListener('keydown', dismiss)
  }, [visible])

  if (!visible) return null

  return (
    <div
      className={`christmas-overlay ${dismissing ? 'is-dismissing' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Christmas greeting"
      onClick={() => setDismissing(true)}
      onAnimationEnd={(event) => {
        if (dismissing && event.animationName === 'christmas-dismiss') {
          setDismissed(true)
          setVisible(false)
        }
      }}
    >
      <div className="christmas-backdrop" aria-hidden="true" />
      <div className="christmas-snowfall" aria-hidden="true">
        {snowflakes.map((flake, index) => <i key={index} style={{ '--flake-left': flake.left, '--flake-delay': flake.delay, '--flake-duration': flake.duration, '--flake-size': flake.size } as React.CSSProperties} />)}
      </div>
      <div className="christmas-scene" aria-hidden="true">
        <div className="christmas-snowman"><span className="snowman-hat" /><span className="snowman-head" /><span className="snowman-body" /><span className="snowman-scarf" /><span className="snowman-arm snowman-arm-left" /><span className="snowman-arm snowman-arm-right" /></div>
        <div className="christmas-tree"><span className="tree-star">✦</span><span className="tree-layer tree-layer-one" /><span className="tree-layer tree-layer-two" /><span className="tree-layer tree-layer-three" /><span className="tree-trunk" /><i /><i /><i /><i /><i /><i /></div>
        <div className="christmas-snowbank"><span className="christmas-snowball" /></div>
      </div>
      <div className="christmas-message">
        <span className="christmas-kicker">A VEILWARE HOLIDAY</span>
        <h2>Merry Christmas<span>!</span></h2>
        <p>Warm wishes from the Veilware community.</p>
        <span className="christmas-hint">Click or press any key to continue</span>
      </div>
    </div>
  )
}
