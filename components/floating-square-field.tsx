'use client'

import { useEffect, useRef } from 'react'
import { isSafeSquarePosition } from './floating-square-geometry'

type Particle = {
  x: number
  y: number
  size: number
  vx: number
  vy: number
  targetAngle: number
  turnRate: number
  speed: number
  alpha: number
  fill: boolean
}

const SETTINGS = {
  gap: 14,
  minSize: 6,
  maxSize: 30,
  minSpeed: 7,
  maxSpeed: 24,
  directionChangeMin: 2.5,
  directionChangeMax: 7,
  collisionSteering: 0.16,
  maxFrameSeconds: 0.05,
  maxSubstepSeconds: 0.012,
  colors: ['255, 51, 74', '183, 25, 42'],
}

function particleCount(width: number, height: number) {
  const area = width * height
  if (width < 560) return Math.max(12, Math.floor(area / 42000))
  if (width < 900) return Math.max(20, Math.floor(area / 33000))
  return Math.min(58, Math.max(30, Math.floor(area / 30000)))
}

function randomSize() {
  const roll = Math.random()
  if (roll < 0.62) return SETTINGS.minSize + Math.random() * 8
  if (roll < 0.92) return 14 + Math.random() * 8
  return SETTINGS.maxSize - Math.random() * 5
}

function overlaps(a: Particle, x: number, y: number, particles: Particle[]) {
  return !isSafeSquarePosition(a, x, y, particles, SETTINGS.gap)
}

function createParticles(width: number, height: number) {
  const particles: Particle[] = []
  const count = particleCount(width, height)
  for (let index = 0; index < count; index++) {
    const size = randomSize()
    let placed: Particle | null = null
    for (let attempt = 0; attempt < 160 && !placed; attempt++) {
      const candidate = {
        x: size / 2 + SETTINGS.gap + Math.random() * Math.max(1, width - size - SETTINGS.gap * 2),
        y: size / 2 + SETTINGS.gap + Math.random() * Math.max(1, height - size - SETTINGS.gap * 2),
        size,
        vx: 0,
        vy: 0,
        targetAngle: Math.random() * Math.PI * 2,
        turnRate: 0.45 + Math.random() * 0.7,
        speed: SETTINGS.minSpeed + Math.random() * (SETTINGS.maxSpeed - SETTINGS.minSpeed),
        alpha: 0.28 + Math.random() * 0.2,
        fill: Math.random() < 0.16,
      }
      if (!overlaps(candidate, candidate.x, candidate.y, particles)) placed = candidate
    }
    if (!placed) continue
    placed.vx = Math.cos(placed.targetAngle) * placed.speed
    placed.vy = Math.sin(placed.targetAngle) * placed.speed
    particles.push(placed)
  }
  return particles
}

export function FloatingSquareField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return

    let width = 0
    let height = 0
    let particles: Particle[] = []
    let frame = 0
    let lastTime = performance.now()
    let paused = document.hidden
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      particles = createParticles(width, height)
    }

    const keepInside = (particle: Particle, x: number, y: number) => ({
      x: Math.max(particle.size / 2 + SETTINGS.gap, Math.min(width - particle.size / 2 - SETTINGS.gap, x)),
      y: Math.max(particle.size / 2 + SETTINGS.gap, Math.min(height - particle.size / 2 - SETTINGS.gap, y)),
    })

    const safePosition = (particle: Particle, x: number, y: number) => !overlaps(particle, x, y, particles)

    const chooseSafeVelocity = (particle: Particle, nextX: number, nextY: number, step: number) => {
      const candidates = [0, 0.35, -0.35, 0.7, -0.7, 1.05, -1.05, Math.PI]
      for (const offset of candidates) {
        const angle = Math.atan2(particle.vy, particle.vx) + offset
        const speed = Math.max(SETTINGS.minSpeed * 0.45, particle.speed * (offset === 0 ? 1 : 0.76))
        const candidate = keepInside(particle, particle.x + Math.cos(angle) * speed * step, particle.y + Math.sin(angle) * speed * step)
        if (safePosition(particle, candidate.x, candidate.y)) return { vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, x: candidate.x, y: candidate.y }
      }
      return null
    }

    const simulate = (step: number) => {
      for (const particle of particles) {
        const angle = Math.atan2(particle.vy, particle.vx)
        let target = particle.targetAngle
        let difference = Math.atan2(Math.sin(target - angle), Math.cos(target - angle))
        if (Math.random() < step / (SETTINGS.directionChangeMin + Math.random() * SETTINGS.directionChangeMax)) {
          particle.targetAngle += (Math.random() - 0.5) * 1.4
          target = particle.targetAngle
          difference = Math.atan2(Math.sin(target - angle), Math.cos(target - angle))
        }
        const steer = Math.sign(difference) * Math.min(Math.abs(difference), particle.turnRate * step)
        const nextAngle = angle + steer
        particle.vx = Math.cos(nextAngle) * particle.speed
        particle.vy = Math.sin(nextAngle) * particle.speed

        const edge = particle.size / 2 + SETTINGS.gap + 18
        if (particle.x < edge && particle.vx < 0) particle.vx += SETTINGS.collisionSteering * particle.speed
        if (particle.x > width - edge && particle.vx > 0) particle.vx -= SETTINGS.collisionSteering * particle.speed
        if (particle.y < edge && particle.vy < 0) particle.vy += SETTINGS.collisionSteering * particle.speed
        if (particle.y > height - edge && particle.vy > 0) particle.vy -= SETTINGS.collisionSteering * particle.speed

        const proposed = keepInside(particle, particle.x + particle.vx * step, particle.y + particle.vy * step)
        const safe = chooseSafeVelocity(particle, proposed.x, proposed.y, step)
        if (safe) {
          particle.vx = safe.vx
          particle.vy = safe.vy
          particle.x = safe.x
          particle.y = safe.y
        } else {
          particle.speed *= 0.985
        }
      }
    }

    const draw = () => {
      context.clearRect(0, 0, width, height)
      for (const particle of particles) {
        context.strokeStyle = `rgba(${SETTINGS.colors[particle.fill ? 1 : 0]}, ${particle.alpha})`
        context.fillStyle = `rgba(${SETTINGS.colors[1]}, ${particle.alpha * 0.22})`
        context.lineWidth = 1.25
        const left = particle.x - particle.size / 2
        const top = particle.y - particle.size / 2
        if (particle.fill) context.fillRect(left, top, particle.size, particle.size)
        context.strokeRect(left, top, particle.size, particle.size)
      }
    }

    const tick = (time: number) => {
      const elapsed = Math.min(SETTINGS.maxFrameSeconds, Math.max(0, (time - lastTime) / 1000))
      lastTime = time
      if (!paused && !reducedMotion.matches) {
        let remaining = elapsed
        while (remaining > 0) {
          const step = Math.min(SETTINGS.maxSubstepSeconds, remaining)
          simulate(step)
          remaining -= step
        }
      }
      draw()
      frame = requestAnimationFrame(tick)
    }

    const onVisibilityChange = () => { paused = document.hidden; lastTime = performance.now() }
    resize()
    document.addEventListener('visibilitychange', onVisibilityChange)
    window.addEventListener('resize', resize)
    frame = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(frame); document.removeEventListener('visibilitychange', onVisibilityChange); window.removeEventListener('resize', resize) }
  }, [])

  return <canvas ref={canvasRef} className="floating-square-canvas" aria-hidden="true" />
}
