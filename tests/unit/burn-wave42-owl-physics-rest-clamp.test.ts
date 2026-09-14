/**
 * Wave 42 — owl physics rest threshold / clamp edges leftovers.
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

describe('Wave 42 owl-physics — rest clamp', () => {
  it('repeated integrate drives velocity under rest threshold', () => {
    let s = { x: 0, y: 0, vx: 5, vy: 5 };
    for (let i = 0; i < 80; i++) s = integrate(s);
    expect(isAtRest(s.vx, s.vy)).toBe(true);
  });

  it('custom friction 0 freezes velocity after one step', () => {
    const next = integrate({ x: 1, y: 2, vx: 3, vy: 4 }, 0);
    expect(next.vx).toBe(0);
    expect(next.vy).toBe(0);
    expect(next.x).toBe(4);
    expect(next.y).toBe(6);
  });

  it('clamp pins negative coords to 0', () => {
    expect(clampToViewport(-10, -5, 20, 20, 100, 100)).toEqual({ x: 0, y: 0 });
  });

  it('clamp pins past max edge', () => {
    expect(clampToViewport(90, 90, 20, 20, 100, 100)).toEqual({
      x: 80,
      y: 80,
    });
  });

  it('OWL_REST_SPEED boundary: equal hypot is not at rest', () => {
    expect(isAtRest(OWL_REST_SPEED, 0)).toBe(false);
    expect(isAtRest(OWL_REST_SPEED - 0.01, 0)).toBe(true);
    expect(OWL_FRICTION).toBeGreaterThan(0);
    expect(OWL_FRICTION).toBeLessThan(1);
  });
});
