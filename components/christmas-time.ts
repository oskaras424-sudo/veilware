export type ChristmasTime = {
  now: Date
  timeZone: string
  year: number
  month: number
  day: number
  target: Date
  isChristmasDay: boolean
}

function getLocalCalendarDate(now: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(now)
  return {
    year: Number(parts.find((part) => part.type === 'year')?.value),
    month: Number(parts.find((part) => part.type === 'month')?.value),
    day: Number(parts.find((part) => part.type === 'day')?.value),
  }
}

export function getChristmasTime(now = new Date()): ChristmasTime {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  const local = getLocalCalendarDate(now, timeZone)
  const target = new Date(local.year, 11, 25, 0, 0, 0, 0)
  const isChristmasDay = local.month === 12 && local.day === 25
  if (now.getTime() >= target.getTime() && !isChristmasDay) target.setFullYear(target.getFullYear() + 1)
  return { now, timeZone, ...local, target, isChristmasDay }
}

export function getChristmasRemaining(time: ChristmasTime) {
  const total = Math.max(0, time.target.getTime() - time.now.getTime())
  return {
    days: Math.floor(total / 86400000),
    hours: Math.floor((total / 3600000) % 24),
    minutes: Math.floor((total / 60000) % 60),
    seconds: Math.floor((total / 1000) % 60),
  }
}
