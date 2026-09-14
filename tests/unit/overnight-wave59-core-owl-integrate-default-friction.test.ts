/**
 * Overnight HEAVY leftover after #280 — integrate default OWL_FRICTION.
 * Opposite of wave55 friction-0 physics leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { integrate, OWL_FRICTION } from '../../src/core/owl';

describe('Wave 59 core owl — integrate default friction', () => {
  it('omitted friction arg uses OWL_FRICTION constant', () => {
    const next = integrate({ x: 0, y: 0, vx: 10, vy: -5 });
    expect(next.vx).toBeCloseTo(10 * OWL_FRICTION);
    expect(next.vy).toBeCloseTo(-5 * OWL_FRICTION);
    expect(next.x).toBe(10);
    expect(next.y).toBe(-5);
  });
});
