'use client'

import { useEffect, useState } from 'react'
import { getChristmasRemaining, getChristmasTime } from './christmas-time'

const pad = (value: number) => String(value).padStart(2, '0')

export function ChristmasCountdown() {
  const [time, setTime] = useState<ReturnType<typeof getChristmasTime> | null>(null)

  useEffect(() => {
    const update = () => setTime(getChristmasTime(new Date()))
    update()
    const interval = window.setInterval(update, 1000)
    const handleVisibility = () => { if (document.visibilityState === 'visible') update() }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => {
      window.clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  if (!time) return null
  const remaining = getChristmasRemaining(time)

  return (
    <div className="christmas-countdown" aria-label={`Countdown to Christmas: ${remaining.days} days, ${remaining.hours} hours, ${remaining.minutes} minutes, ${remaining.seconds} seconds`}>
      <span className="christmas-countdown-label">Christmas in</span>
      <span className="christmas-countdown-value" aria-live="polite">
        <b>{remaining.days}</b><i>d</i><b>{pad(remaining.hours)}</b><i>:</i><b>{pad(remaining.minutes)}</b><i>:</i><b>{pad(remaining.seconds)}</b>
      </span>
    </div>
  )
}
