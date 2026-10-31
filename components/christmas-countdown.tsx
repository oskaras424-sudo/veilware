'use client'

import { useEffect, useState } from 'react'

function getTargetDate(now = new Date()) {
  const target = new Date(now.getFullYear(), 11, 25, 0, 0, 0)
  if (now > target) target.setFullYear(target.getFullYear() + 1)
  return target
}

function getRemaining(target: Date) {
  const total = Math.max(0, target.getTime() - Date.now())
  return {
    days: Math.floor(total / 86400000),
    hours: Math.floor((total / 3600000) % 24),
    minutes: Math.floor((total / 60000) % 60),
    seconds: Math.floor((total / 1000) % 60),
  }
}

const pad = (value: number) => String(value).padStart(2, '0')

export function ChristmasCountdown() {
  const [target, setTarget] = useState<Date | null>(null)
  const [remaining, setRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const nextChristmas = getTargetDate()
    setTarget(nextChristmas)
    setRemaining(getRemaining(nextChristmas))
    const interval = window.setInterval(() => {
      const nextTarget = getTargetDate()
      setTarget(nextTarget)
      setRemaining(getRemaining(nextTarget))
    }, 1000)
    return () => window.clearInterval(interval)
  }, [])

  if (!target) return null

  return (
    <div className="christmas-countdown" aria-label={`Countdown to Christmas: ${remaining.days} days, ${remaining.hours} hours, ${remaining.minutes} minutes, ${remaining.seconds} seconds`}>
      <span className="christmas-countdown-label">Christmas in</span>
      <span className="christmas-countdown-value" aria-live="polite">
        <b>{remaining.days}</b><i>d</i><b>{pad(remaining.hours)}</b><i>:</i><b>{pad(remaining.minutes)}</b><i>:</i><b>{pad(remaining.seconds)}</b>
      </span>
    </div>
  )
}
