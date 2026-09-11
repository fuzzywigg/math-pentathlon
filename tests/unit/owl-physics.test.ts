import { describe, it, expect } from 'vitest';
import {
  integrate,
  clampToViewport,
  isAtRest,
  OWL_FRICTION,
  OWL_REST_SPEED,
} from '../../src/core/owl/owl-physics';

describe('owl-physics (thin coast)', () => {
  it('integrates position and applies friction', () => {
    const next = integrate({ x: 10, y: 20, vx: 8, vy: -4 }, 0.5);
    expect(next.x).toBe(18);
    expect(next.y).toBe(16);
    expect(next.vx).toBe(4);
    expect(next.vy).toBe(-2);
  });

  it('clamps to viewport without bounce invent', () => {
    expect(clampToViewport(-10, -5, 64, 64, 390, 844)).toEqual({ x: 0, y: 0 });
    expect(clampToViewport(400, 900, 64, 64, 390, 844)).toEqual({ x: 326, y: 780 });
  });

  it('detects rest under speed threshold', () => {
    expect(isAtRest(0, 0)).toBe(true);
    expect(isAtRest(OWL_REST_SPEED / 2, 0)).toBe(true);
    expect(isAtRest(5, 5)).toBe(false);
    expect(OWL_FRICTION).toBeGreaterThan(0);
    expect(OWL_FRICTION).toBeLessThan(1);
  });
});
