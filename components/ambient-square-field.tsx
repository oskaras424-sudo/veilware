'use client'

import { useEffect, useRef } from 'react'
import { keepInside, overlaps, resolveAllCollisions, type AmbientSquare, type Bounds, viewportVelocity } from './ambient-square-geometry'

const COLORS = ['#8B0000', '#a51f2f', '#c43b4b']
const MAX_DPR = 2
const MIN_SQUARES = 12
const MAX_SQUARES = 34

function randomSquare(bounds: Bounds, existing: AmbientSquare[]): AmbientSquare | null {
  const size = 10 + Math.random() * 34
  for (let attempt = 0; attempt < 80; attempt++) {
    const angle = Math.random() * Math.PI * 2
    const speedFactor = 0.82 + Math.random() * 0.36
    const square: AmbientSquare = {
      x: size / 2 + Math.random() * Math.max(1, bounds.width - size),
      y: size / 2 + Math.random() * Math.max(1, bounds.height - size),
      size,
      ...viewportVelocity(bounds, angle, speedFactor),
    }
    if (!existing.some((other) => overlaps(square, other))) return square
  }
  return null
}

function createSquares(bounds: Bounds) {
  const target = Math.min(MAX_SQUARES, Math.max(MIN_SQUARES, Math.floor((bounds.width * bounds.height) / 50000)))
  const squares: AmbientSquare[] = []
  while (squares.length < target) {
    const square = randomSquare(bounds, squares)
    if (!square) break
    squares.push(square)
  }
  return squares
}

export function AmbientSquareField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return

    let bounds: Bounds = { width: window.innerWidth, height: window.innerHeight }
    let squares = createSquares(bounds)
    let frame = 0
    let lastTime = performance.now()
    let paused = document.hidden
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    const resize = () => {
      bounds = { width: window.innerWidth, height: window.innerHeight }
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
      canvas.width = Math.floor(bounds.width * dpr)
      canvas.height = Math.floor(bounds.height * dpr)
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      for (const square of squares) {
        const inside = keepInside(square, bounds)
        square.x = inside.x
        square.y = inside.y
        square.vx = inside.vx
        square.vy = inside.vy
      }
      draw()
    }

    const draw = () => {
      context.clearRect(0, 0, bounds.width, bounds.height)
      for (const [index, square] of squares.entries()) {
        context.strokeStyle = COLORS[index % COLORS.length]
        context.globalAlpha = 0.24 + (index % 4) * 0.08
        context.lineWidth = index % 5 === 0 ? 1.4 : 1
        context.strokeRect(square.x - square.size / 2, square.y - square.size / 2, square.size, square.size)
      }
      context.globalAlpha = 1
    }

    const update = (seconds: number) => {
      const maxSpeed = Math.max(...squares.map((square) => Math.hypot(square.vx, square.vy)), 1)
      const steps = Math.max(1, Math.ceil((maxSpeed * seconds) / 4))
      const step = seconds / steps
      for (let substep = 0; substep < steps; substep++) {
        for (const square of squares) {
          square.x += square.vx * step
          square.y += square.vy * step
          const inside = keepInside(square, bounds)
          square.x = inside.x
          square.y = inside.y
          square.vx = inside.vx
          square.vy = inside.vy
        }
        resolveAllCollisions(squares)
        for (const square of squares) {
          const inside = keepInside(square, bounds)
          square.x = inside.x
          square.y = inside.y
          square.vx = inside.vx
          square.vy = inside.vy
        }
      }
    }

    const tick = (time: number) => {
      frame = 0
      if (paused || reducedMotion.matches) return
      const seconds = Math.min((time - lastTime) / 1000, 0.05)
      lastTime = time
      update(Math.max(0, seconds))
      draw()
      frame = requestAnimationFrame(tick)
    }

    const start = () => {
      if (!paused && !reducedMotion.matches && !frame) {
        lastTime = performance.now()
        frame = requestAnimationFrame(tick)
      }
    }

    const onVisibilityChange = () => {
      paused = document.hidden
      if (!paused) start()
    }

    resize()
    document.addEventListener('visibilitychange', onVisibilityChange)
    window.addEventListener('resize', resize, { passive: true })
    start()

    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="ambient-square-canvas" aria-hidden="true" />
}
