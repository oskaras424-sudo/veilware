'use client'

import { useEffect, useRef } from 'react'

const MAX_MOVEMENT = 8

export function useMagneticPanel<T extends HTMLElement>(enabled = true, maxMovement = MAX_MOVEMENT) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const element = ref.current
    if (!element || !enabled || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const glowElement = document.createElement('span')
    glowElement.className = 'card-glow'
    glowElement.setAttribute('aria-hidden', 'true')
    element.prepend(glowElement)

    let frame = 0
    let resetTimer = 0
    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0
    let active = false
    let running = false

    const animate = () => {
      currentX += (targetX - currentX) * (active ? 0.2 : 0.14)
      currentY += (targetY - currentY) * (active ? 0.2 : 0.14)
      if (!active && Math.abs(currentX) < 0.1) currentX = 0
      if (!active && Math.abs(currentY) < 0.1) currentY = 0
      element.style.setProperty('--magnetic-x', `${currentX.toFixed(3)}px`)
      element.style.setProperty('--magnetic-y', `${currentY.toFixed(3)}px`)
      if (!active && currentX === 0 && currentY === 0) {
        running = false
        frame = 0
        return
      }
      frame = requestAnimationFrame(animate)
    }

    const schedule = () => {
      if (running) return
      running = true
      frame = requestAnimationFrame(animate)
    }

    const move = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== 'mouse') return
      window.clearTimeout(resetTimer)
      const bounds = element.getBoundingClientRect()
      const glowX = ((event.clientX - bounds.left) / bounds.width) * 100
      const glowY = ((event.clientY - bounds.top) / bounds.height) * 100
      element.style.setProperty('--glow-x', `${Math.max(0, Math.min(100, glowX))}%`)
      element.style.setProperty('--glow-y', `${Math.max(0, Math.min(100, glowY))}%`)
      element.classList.add('is-glowing')
      glowElement.style.opacity = '1'
      targetX = Math.max(-1, Math.min(1, (event.clientX - bounds.left - bounds.width / 2) / (bounds.width / 2))) * maxMovement
      targetY = Math.max(-1, Math.min(1, (event.clientY - bounds.top - bounds.height / 2) / (bounds.height / 2))) * maxMovement
      active = true
      schedule()
    }

    const leave = () => {
      targetX = 0
      targetY = 0
      active = false
      element.classList.remove('is-glowing')
      glowElement.style.opacity = '0'
      schedule()
      resetTimer = window.setTimeout(() => {
        currentX = 0
        currentY = 0
        element.style.setProperty('--magnetic-x', '0px')
        element.style.setProperty('--magnetic-y', '0px')
        running = false
        if (frame) cancelAnimationFrame(frame)
        frame = 0
      }, 450)
    }

    element.addEventListener('pointermove', move, { passive: true })
    element.addEventListener('pointerenter', move, { passive: true })
    element.addEventListener('pointerleave', leave, { passive: true })

    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(resetTimer)
      element.removeEventListener('pointermove', move)
      element.removeEventListener('pointerenter', move)
      element.removeEventListener('pointerleave', leave)
      element.style.removeProperty('--magnetic-x')
      element.style.removeProperty('--magnetic-y')
      element.style.removeProperty('--glow-x')
      element.style.removeProperty('--glow-y')
      element.classList.remove('is-glowing')
      glowElement.remove()
    }
  }, [enabled, maxMovement])

  return ref
}

export function MagneticPanel({ children, className = '', maxMovement = MAX_MOVEMENT }: { children: React.ReactNode; className?: string; maxMovement?: number }) {
  const ref = useMagneticPanel<HTMLDivElement>(true, maxMovement)
  return <div ref={ref} className={`magnetic-panel ${className}`}>{children}</div>
}
