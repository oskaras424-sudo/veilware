'use client'

import { useEffect, useRef } from 'react'

type Particle = { x: number; y: number; size: number; vx: number; vy: number; rotation: number; spin: number; alpha: number; fill: boolean }

export function FloatingSquareField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return
    let frame = 0
    let width = 0
    let height = 0
    let particles: Particle[] = []
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    const countFor = () => window.innerWidth < 560 ? 14 : window.innerWidth < 900 ? 24 : 42
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = canvas.parentElement?.clientWidth || window.innerWidth
      height = canvas.parentElement?.clientHeight || window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = countFor()
      particles = Array.from({ length: count }, (_, index) => {
        const size = 5 + ((index * 17) % 25)
        return { x: 20 + ((index * 97) % Math.max(40, width - 40)), y: 20 + ((index * 61) % Math.max(40, height - 40)), size, vx: ((index % 3) - 1) * (0.08 + (index % 5) * 0.025), vy: (index % 2 ? -1 : 1) * (0.06 + (index % 4) * 0.025), rotation: index * 0.31, spin: (index % 2 ? 1 : -1) * 0.0015, alpha: 0.12 + (index % 5) * 0.035, fill: index % 7 === 0 }
      })
    }

    const tick = () => {
      context.clearRect(0, 0, width, height)
      const motionScale = reducedMotion.matches ? 0 : 1
      for (const particle of particles) {
        particle.x += particle.vx * motionScale
        particle.y += particle.vy * motionScale
        particle.rotation += particle.spin * motionScale
        if (particle.x < particle.size + 10 || particle.x > width - particle.size - 10) particle.vx *= -1
        if (particle.y < particle.size + 10 || particle.y > height - particle.size - 10) particle.vy *= -1
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j]
          const gap = Math.max(a.size, b.size) / 2 + 10
          const dx = b.x - a.x, dy = b.y - a.y, distance = Math.hypot(dx, dy) || 1
          if (distance < gap * 2) {
            const push = (gap * 2 - distance) / distance * 0.012
            a.vx -= dx * push; a.vy -= dy * push; b.vx += dx * push; b.vy += dy * push
          }
        }
      }
      for (const particle of particles) {
        context.save()
        context.translate(particle.x, particle.y)
        context.rotate(particle.rotation)
        context.strokeStyle = `rgba(255, 51, 74, ${particle.alpha})`
        context.fillStyle = `rgba(150, 20, 35, ${particle.alpha * 0.28})`
        context.lineWidth = 1
        if (particle.fill) context.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size)
        context.strokeRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size)
        context.restore()
      }
      frame = requestAnimationFrame(tick)
    }

    resize()
    window.addEventListener('resize', resize)
    frame = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize) }
  }, [])

  return <canvas ref={canvasRef} className="floating-square-canvas" aria-hidden="true" />
}
