/**
 * Wave 39 — owl physics integrate / clamp / rest leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  integrate,
  clampToViewport,
  isAtRest,
  OWL_FRICTION,
  OWL_REST_SPEED,
} from '../../src/core/owl';

describe('Wave 39 owl — physics', () => {
  it('integrate applies friction', () => {
    const next = integrate({ x: 0, y: 0, vx: 10, vy: -4 });
    expect(next.x).toBe(10);
    expect(next.y).toBe(-4);
    expect(next.vx).toBeCloseTo(10 * OWL_FRICTION);
    expect(next.vy).toBeCloseTo(-4 * OWL_FRICTION);
  });

  it('clampToViewport keeps box inside', () => {
    expect(clampToViewport(-20, -10, 50, 50, 200, 100)).toEqual({ x: 0, y: 0 });
    expect(clampToViewport(300, 200, 50, 50, 200, 100)).toEqual({
      x: 150,
      y: 50,
    });
  });

  it('isAtRest threshold', () => {
    expect(isAtRest(0, 0)).toBe(true);
    expect(isAtRest(OWL_REST_SPEED, 0)).toBe(false);
    expect(isAtRest(0.1, 0.1, 1)).toBe(true);
  });
});
