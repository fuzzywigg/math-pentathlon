/**
 * Wave 44 — doPlacementsOverlap adjacent vs share leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { doPlacementsOverlap, SIMPLE_SHAPES } from '../../src/core/polyomino';
import type { Placement } from '../../src/core/polyomino/placement';

describe('Wave 44 poly — placements overlap', () => {
  it('adjacent monominoes do not overlap; same cell does', () => {
    const m = SIMPLE_SHAPES.find((s) => s.id === 'monomino')!;
    const a: Placement = {
      polyomino: m,
      position: { row: 0, col: 0 },
      rotation: 0,
      flipped: false,
    };
    const b: Placement = {
      polyomino: m,
      position: { row: 0, col: 1 },
      rotation: 0,
      flipped: false,
    };
    const c: Placement = {
      polyomino: m,
      position: { row: 0, col: 0 },
      rotation: 0,
      flipped: false,
    };
    expect(doPlacementsOverlap(a, b)).toBe(false);
    expect(doPlacementsOverlap(a, c)).toBe(true);
  });
});
