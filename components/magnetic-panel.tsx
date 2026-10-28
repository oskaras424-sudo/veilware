'use client'

import { useEffect, useRef } from 'react'

export type MagneticPanelOptions = {
  maxMovement?: number
  enabled?: boolean
  tilt?: boolean
}

const DEFAULT_OPTIONS: Required<MagneticPanelOptions> = {
  maxMovement: 8,
  enabled: true,
  tilt: false,
}

export function useMagneticPanel<T extends HTMLElement>(options: MagneticPanelOptions = {}) {
  const ref = useRef<T>(null)
  const settings = { ...DEFAULT_OPTIONS, ...options }

  useEffect(() => {
    const element = ref.current
    if (!element || !settings.enabled || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0
    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0
    let active = false

    const setTarget = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== 'mouse') return
      const bounds = element.getBoundingClientRect()
      const xRatio = (event.clientX - (bounds.left + bounds.width / 2)) / (bounds.width / 2)
      const yRatio = (event.clientY - (bounds.top + bounds.height / 2)) / (bounds.height / 2)
      targetX = Math.max(-1, Math.min(1, xRatio)) * settings.maxMovement
      targetY = Math.max(-1, Math.min(1, yRatio)) * settings.maxMovement
      active = true
    }

    const resetTarget = () => {
      targetX = 0
      targetY = 0
      active = false
    }

    const animate = () => {
      currentX += (targetX - currentX) * (active ? 0.18 : 0.12)
      currentY += (targetY - currentY) * (active ? 0.18 : 0.12)
      if (!active && Math.abs(currentX) < 0.05) currentX = 0
      if (!active && Math.abs(currentY) < 0.05) currentY = 0
      element.style.setProperty('--magnetic-x', `${currentX.toFixed(3)}px`)
      element.style.setProperty('--magnetic-y', `${currentY.toFixed(3)}px`)
      if (settings.tilt) {
        const tiltX = (currentY / settings.maxMovement) * -1.2
        const tiltY = (currentX / settings.maxMovement) * 1.2
        element.style.setProperty('--magnetic-tilt-x', `${tiltX.toFixed(3)}deg`)
        element.style.setProperty('--magnetic-tilt-y', `${tiltY.toFixed(3)}deg`)
      }
      frame = requestAnimationFrame(animate)
    }

    element.addEventListener('pointermove', setTarget, { passive: true })
    element.addEventListener('pointerenter', setTarget, { passive: true })
    element.addEventListener('pointerleave', resetTarget, { passive: true })
    frame = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(frame)
      element.removeEventListener('pointermove', setTarget)
      element.removeEventListener('pointerenter', setTarget)
      element.removeEventListener('pointerleave', resetTarget)
      element.style.removeProperty('--magnetic-x')
      element.style.removeProperty('--magnetic-y')
      element.style.removeProperty('--magnetic-tilt-x')
      element.style.removeProperty('--magnetic-tilt-y')
    }
  }, [settings.enabled, settings.maxMovement, settings.tilt])

  return ref
}

export function MagneticPanel({ children, className = '', maxMovement = 8, tilt = false }: { children: React.ReactNode; className?: string; maxMovement?: number; tilt?: boolean }) {
  const ref = useMagneticPanel<HTMLDivElement>({ maxMovement, tilt })
  return <div ref={ref} className={`magnetic-panel ${className}`}>{children}</div>
}
