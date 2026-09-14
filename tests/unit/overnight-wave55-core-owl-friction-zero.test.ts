/**
 * Overnight HEAVY leftover after #250 — integrate friction 0 zeros velocity
 * after one step; position still advances. Distinct from default 0.92 dampen.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { integrate, isAtRest } from '../../src/core/owl';

describe('Wave 55 core owl — friction zero integrate', () => {
  it('custom friction 0 parks velocity while applying one displacement', () => {
    const next = integrate({ x: 10, y: 20, vx: 5, vy: -3 }, 0);
    expect(next.x).toBe(15);
    expect(next.y).toBe(17);
    expect(next.vx).toBe(0);
    expect(Math.abs(next.vy)).toBe(0);
    expect(isAtRest(next.vx, next.vy)).toBe(true);
  });
});
