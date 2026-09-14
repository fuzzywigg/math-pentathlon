/**
 * Overnight HEAVY leftover after #256 — integrate friction >1 amplifies velocity.
 * Distinct from wave55 friction 0 park. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { integrate, isAtRest } from '../../src/core/owl';

describe('Wave 56 core owl — friction amplify', () => {
  it('friction 2 doubles vx and keeps motion above rest', () => {
    const next = integrate({ x: 1, y: 2, vx: 2, vy: 0 }, 2);
    expect(next.x).toBe(3);
    expect(next.y).toBe(2);
    expect(next.vx).toBe(4);
    expect(next.vy).toBe(0);
    expect(isAtRest(next.vx, next.vy)).toBe(false);
  });
});
