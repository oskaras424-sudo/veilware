export type AmbientSquare = {
  x: number
  y: number
  size: number
  vx: number
  vy: number
}

export type Bounds = { width: number; height: number }

export const SQUARE_GAP = 6

export function viewportVelocity(bounds: Bounds, angle: number, speedFactor = 1) {
  const speedX = (bounds.width / 9) * speedFactor
  const speedY = (bounds.height / 9) * speedFactor
  return { vx: Math.cos(angle) * speedX, vy: Math.sin(angle) * speedY }
}

export function keepInside(square: AmbientSquare, bounds: Bounds) {
  const half = square.size / 2
  let { x, y, vx, vy } = square
  if (x - half < 0) { x = half; vx = Math.abs(vx) }
  if (x + half > bounds.width) { x = Math.max(half, bounds.width - half); vx = -Math.abs(vx) }
  if (y - half < 0) { y = half; vy = Math.abs(vy) }
  if (y + half > bounds.height) { y = Math.max(half, bounds.height - half); vy = -Math.abs(vy) }
  return { x, y, vx, vy }
}

export function overlaps(a: AmbientSquare, b: AmbientSquare, gap = SQUARE_GAP) {
  return Math.abs(a.x - b.x) < (a.size + b.size) / 2 + gap && Math.abs(a.y - b.y) < (a.size + b.size) / 2 + gap
}

export function resolvePairCollision(a: AmbientSquare, b: AmbientSquare, gap = SQUARE_GAP) {
  const overlapX = (a.size + b.size) / 2 + gap - Math.abs(a.x - b.x)
  const overlapY = (a.size + b.size) / 2 + gap - Math.abs(a.y - b.y)
  if (overlapX <= 0 || overlapY <= 0) return false

  if (overlapX <= overlapY) {
    const direction = Math.sign(a.x - b.x) || 1
    a.x += direction * overlapX / 2
    b.x -= direction * overlapX / 2
    if ((a.vx - b.vx) * direction < 0) [a.vx, b.vx] = [b.vx, a.vx]
  } else {
    const direction = Math.sign(a.y - b.y) || 1
    a.y += direction * overlapY / 2
    b.y -= direction * overlapY / 2
    if ((a.vy - b.vy) * direction < 0) [a.vy, b.vy] = [b.vy, a.vy]
  }
  return true
}

export function resolveAllCollisions(squares: AmbientSquare[], gap = SQUARE_GAP) {
  let collisions = 0
  for (let i = 0; i < squares.length; i++) {
    for (let j = i + 1; j < squares.length; j++) {
      if (resolvePairCollision(squares[i], squares[j], gap)) collisions++
    }
  }
  return collisions
}
