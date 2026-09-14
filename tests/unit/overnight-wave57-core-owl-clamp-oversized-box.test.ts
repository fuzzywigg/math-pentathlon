/**
 * Overnight HEAVY leftover after #264 — clampToViewport when box exceeds viewport.
 * Distinct from wave52 exact-equal viewport edge. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { clampToViewport } from '../../src/core/owl';

describe('Wave 57 core owl — clamp oversized', () => {
  it('oversized box clamps to origin', () => {
    expect(clampToViewport(9, 9, 120, 120, 100, 80)).toEqual({ x: 0, y: 0 });
  });
});
