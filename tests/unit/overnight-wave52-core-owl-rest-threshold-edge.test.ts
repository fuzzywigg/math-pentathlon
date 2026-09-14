/**
 * Overnight HEAVY leftover after #234 — isAtRest at exact OWL_REST_SPEED is false (< not <=).
 * Distinct from burn-wave39-owl-physics-clamp-rest. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { isAtRest, OWL_REST_SPEED } from '../../src/core/owl';

describe('Wave 52 core owl — rest threshold edge', () => {
  it('hypot exactly at threshold → not at rest; just under → rest', () => {
    expect(isAtRest(OWL_REST_SPEED, 0)).toBe(false);
    expect(isAtRest(OWL_REST_SPEED - 1e-9, 0)).toBe(true);
    expect(isAtRest(0, 0)).toBe(true);
  });
});
