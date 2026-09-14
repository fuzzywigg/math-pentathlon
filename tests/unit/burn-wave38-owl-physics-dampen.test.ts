/**
 * Wave 38 — owl physics multi-frame dampen / clamp lattice / rest threshold.
 * Beyond thin owl-physics.test.ts smoke. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  integrate,
  clampToViewport,
  isAtRest,
  OWL_FRICTION,
  OWL_REST_SPEED,
  type OwlPhysicsState,
} from '../../src/core/owl/owl-physics';

describe('Wave 38 owl-physics — dampen ladder', () => {
  it('default friction decays speed toward rest within N frames', () => {
    let s: OwlPhysicsState = { x: 0, y: 0, vx: 20, vy: -15 };
    let frames = 0;
    while (!isAtRest(s.vx, s.vy) && frames < 200) {
      s = integrate(s);
      frames++;
    }
    expect(frames).toBeGreaterThan(5);
    expect(frames).toBeLessThan(200);
    expect(isAtRest(s.vx, s.vy)).toBe(true);
    expect(OWL_FRICTION).toBe(0.92);
  });

  it('custom friction 0 freezes velocity after one step', () => {
    const next = integrate({ x: 1, y: 2, vx: 9, vy: 9 }, 0);
    expect(next).toEqual({ x: 10, y: 11, vx: 0, vy: 0 });
    expect(isAtRest(next.vx, next.vy)).toBe(true);
  });

  it('friction 1 never damps; rest stays false for nonzero v', () => {
    let s: OwlPhysicsState = { x: 0, y: 0, vx: 3, vy: 4 };
    for (let i = 0; i < 10; i++) s = integrate(s, 1);
    expect(s.vx).toBe(3);
    expect(s.vy).toBe(4);
    expect(isAtRest(s.vx, s.vy)).toBe(false);
  });
});

describe('Wave 38 owl-physics — clamp lattice', () => {
  it('clamps across viewport × box size grid', () => {
    const viewports = [
      [320, 568],
      [390, 844],
      [1024, 768],
    ];
    const boxes = [
      [32, 32],
      [64, 64],
      [120, 80],
    ];
    for (const [vw, vh] of viewports) {
      for (const [bw, bh] of boxes) {
        const maxX = Math.max(0, vw - bw);
        const maxY = Math.max(0, vh - bh);
        expect(clampToViewport(-100, -100, bw, bh, vw, vh)).toEqual({
          x: 0,
          y: 0,
        });
        expect(clampToViewport(1e6, 1e6, bw, bh, vw, vh)).toEqual({
          x: maxX,
          y: maxY,
        });
        expect(clampToViewport(maxX / 2, maxY / 2, bw, bh, vw, vh)).toEqual({
          x: maxX / 2,
          y: maxY / 2,
        });
      }
    }
  });

  it('box larger than viewport pins to 0,0', () => {
    expect(clampToViewport(50, 50, 500, 500, 200, 200)).toEqual({ x: 0, y: 0 });
  });
});

describe('Wave 38 owl-physics — rest threshold boundary', () => {
  it('hypot exactly at threshold is not at rest; below is', () => {
    expect(isAtRest(OWL_REST_SPEED, 0)).toBe(false);
    expect(isAtRest(OWL_REST_SPEED - 1e-6, 0)).toBe(true);
    expect(isAtRest(0, OWL_REST_SPEED)).toBe(false);
    expect(isAtRest(OWL_REST_SPEED / Math.SQRT2, OWL_REST_SPEED / Math.SQRT2)).toBe(
      false
    );
    expect(isAtRest(0.1, 0.1, 1)).toBe(true);
  });
});
