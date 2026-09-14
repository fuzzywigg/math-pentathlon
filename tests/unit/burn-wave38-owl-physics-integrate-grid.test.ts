/**
 * Wave 38 — integrate position grid + clamp then rest pipeline.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  integrate,
  clampToViewport,
  isAtRest,
  OWL_FRICTION,
} from '../../src/core/owl/owl-physics';

describe('Wave 38 owl-physics — integrate velocity grid', () => {
  it('position advances by velocity before friction for many seeds', () => {
    for (const vx of [-5, -1, 0, 1, 5, 12]) {
      for (const vy of [-8, -2, 0, 3, 9]) {
        const next = integrate({ x: 10, y: 20, vx, vy }, OWL_FRICTION);
        expect(next.x).toBe(10 + vx);
        expect(next.y).toBe(20 + vy);
        expect(next.vx).toBeCloseTo(vx * OWL_FRICTION, 10);
        expect(next.vy).toBeCloseTo(vy * OWL_FRICTION, 10);
      }
    }
  });

  it('coast then clamp stays in viewport until rest', () => {
    let s = { x: 5, y: 5, vx: 40, vy: 30 };
    const bw = 50;
    const bh = 50;
    const vw = 300;
    const vh = 200;
    for (let i = 0; i < 80; i++) {
      s = integrate(s);
      const c = clampToViewport(s.x, s.y, bw, bh, vw, vh);
      s = { ...s, x: c.x, y: c.y };
      expect(s.x).toBeGreaterThanOrEqual(0);
      expect(s.y).toBeGreaterThanOrEqual(0);
      expect(s.x).toBeLessThanOrEqual(vw - bw);
      expect(s.y).toBeLessThanOrEqual(vh - bh);
      if (isAtRest(s.vx, s.vy)) break;
    }
    expect(isAtRest(s.vx, s.vy)).toBe(true);
  });
});
