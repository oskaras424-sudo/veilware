export function viewportSpeed(width: number, height: number, crossingSeconds = 5) {
  return Math.max(width, height) / crossingSeconds
}

export type SquareGeometry = {
  x: number
  y: number
  size: number
}

export function squaresOverlap(a: SquareGeometry, b: SquareGeometry, gap: number) {
  return Math.abs(a.x - b.x) < (a.size + b.size) / 2 + gap
    && Math.abs(a.y - b.y) < (a.size + b.size) / 2 + gap
}

export function isSafeSquarePosition(square: SquareGeometry, x: number, y: number, others: SquareGeometry[], gap: number) {
  const candidate = { ...square, x, y }
  return others.every((other) => other === square || !squaresOverlap(candidate, other, gap))
}
