/**
 * Wave 39 — owl physics integrate/clamp/rest leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  integrate,
  clampToViewport,
  isAtRest,
  OWL_FRICTION,
  OWL_REST_SPEED,
} from '../../src/core/owl/owl-physics';

describe('Wave 39 owl — clamp / rest', () => {
  it('integrate applies friction and advances position', () => {
    const next = integrate({ x: 10, y: 20, vx: 4, vy: -2 });
    expect(next.x).toBe(14);
    expect(next.y).toBe(18);
    expect(next.vx).toBeCloseTo(4 * OWL_FRICTION);
    expect(next.vy).toBeCloseTo(-2 * OWL_FRICTION);
  });

  it('clampToViewport with oversized box pins to 0', () => {
    expect(clampToViewport(50, 50, 200, 200, 100, 80)).toEqual({
      x: 0,
      y: 0,
    });
  });

  it('clampToViewport keeps in-range coords', () => {
    expect(clampToViewport(10, 15, 20, 20, 100, 100)).toEqual({
      x: 10,
      y: 15,
    });
  });

  it('isAtRest respects custom threshold', () => {
    expect(isAtRest(0.1, 0.1)).toBe(true);
    expect(isAtRest(OWL_REST_SPEED, 0)).toBe(false);
    expect(isAtRest(1, 1, 3)).toBe(true);
  });
});
