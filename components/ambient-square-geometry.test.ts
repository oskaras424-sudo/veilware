import { strict as assert } from 'node:assert'
import test from 'node:test'
import { keepInside, overlaps, resolvePairCollision, viewportVelocity, type AmbientSquare } from './ambient-square-geometry.ts'

test('uses the nine-second viewport crossing target', () => {
  assert.equal(viewportVelocity({ width: 1500, height: 900 }, 0).vx, 1500 / 9)
  assert.equal(viewportVelocity({ width: 1500, height: 900 }, Math.PI / 2).vy, 900 / 9)
})

test('reflects squares from every boundary without teleporting', () => {
  const bounds = { width: 300, height: 200 }
  const left = keepInside({ x: 2, y: 100, size: 20, vx: -10, vy: 4 }, bounds)
  const right = keepInside({ x: 298, y: 100, size: 20, vx: 10, vy: 4 }, bounds)
  const corner = keepInside({ x: 4, y: 4, size: 20, vx: -10, vy: -10 }, bounds)
  assert.equal(left.vx, 10)
  assert.equal(right.vx, -10)
  assert.deepEqual({ vx: corner.vx, vy: corner.vy }, { vx: 10, vy: 10 })
  assert.equal(left.x, 10)
})

test('resolves square collision and exchanges the approaching velocity', () => {
  const first: AmbientSquare = { x: 50, y: 80, size: 30, vx: 40, vy: 0 }
  const second: AmbientSquare = { x: 72, y: 80, size: 30, vx: -40, vy: 0 }
  assert.equal(overlaps(first, second), true)
  assert.equal(resolvePairCollision(first, second), true)
  assert.equal(first.vx, -40)
  assert.equal(second.vx, 40)
  assert.equal(overlaps(first, second), false)
})

test('keeps fast diagonal trajectories inside bounds', () => {
  const bounds = { width: 500, height: 300 }
  let square: AmbientSquare = { x: 80, y: 80, size: 24, vx: 260, vy: 190 }
  for (let i = 0; i < 120; i++) {
    square.x += square.vx / 60
    square.y += square.vy / 60
    square = { ...square, ...keepInside(square, bounds) }
  }
  assert.ok(square.x >= square.size / 2 && square.x <= bounds.width - square.size / 2)
  assert.ok(square.y >= square.size / 2 && square.y <= bounds.height - square.size / 2)
})
