/**
 * Overnight HEAVY leftover after #234 — box size equals viewport → maxX/Y=0 clamps any positive xy.
 * Distinct from burn-wave39 oversized / in-range clamps. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { clampToViewport } from '../../src/core/owl';

describe('Wave 52 core owl — clamp exact viewport', () => {
  it('width===viewportWidth and height===viewportHeight → {0,0}', () => {
    expect(clampToViewport(40, 40, 100, 80, 100, 80)).toEqual({ x: 0, y: 0 });
    expect(clampToViewport(0, 0, 100, 80, 100, 80)).toEqual({ x: 0, y: 0 });
  });
});
