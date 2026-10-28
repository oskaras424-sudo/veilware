import assert from 'node:assert/strict'
import test from 'node:test'
import { isSafeSquarePosition, squaresOverlap, viewportSpeed, type SquareGeometry } from './floating-square-geometry.ts'

const gap = 14

test('calculates viewport crossing speed from elapsed time', () => {
  assert.equal(viewportSpeed(1600, 900), 320)
  assert.equal(viewportSpeed(390, 844), 168.8)
})

test('keeps different-sized squares separated by the configured gap', () => {
  const small: SquareGeometry = { x: 100, y: 100, size: 6 }
  const large: SquareGeometry = { x: 120, y: 100, size: 30 }
  assert.equal(squaresOverlap(small, large, gap), true)
  assert.equal(isSafeSquarePosition(small, 170, 100, [large], gap), true)
})

test('rejects predicted head-on and diagonal approaches', () => {
  const moving: SquareGeometry = { x: 100, y: 100, size: 12 }
  const horizontal: SquareGeometry = { x: 140, y: 100, size: 12 }
  const diagonal: SquareGeometry = { x: 140, y: 140, size: 24 }
  assert.equal(isSafeSquarePosition(moving, 120, 100, [horizontal], gap), false)
  assert.equal(isSafeSquarePosition(moving, 120, 120, [diagonal], gap), false)
})

test('keeps a multi-square approach safe at every committed position', () => {
  const moving: SquareGeometry = { x: 80, y: 80, size: 10 }
  const blockers: SquareGeometry[] = [
    { x: 120, y: 80, size: 10 },
    { x: 120, y: 120, size: 18 },
    { x: 80, y: 150, size: 6 },
  ]
  const path = [
    [88, 80], [88, 60], [96, 50], [112, 50], [128, 50], [160, 50], [160, 100], [160, 140],
  ]
  for (const [x, y] of path) {
    assert.equal(isSafeSquarePosition(moving, x, y, blockers, gap), true)
    moving.x = x
    moving.y = y
  }
})
