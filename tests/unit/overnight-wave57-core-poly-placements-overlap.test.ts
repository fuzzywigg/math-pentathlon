/**
 * Overnight HEAVY leftover after #264 — doPlacementsOverlap true/false.
 * Distinct from wave55 validpos occupy. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { doPlacementsOverlap, type Placement } from '../../src/core/polyomino';
import { SIMPLE_SHAPES } from '../../src/core/polyomino';

describe('Wave 57 core poly — placements overlap', () => {
  it('overlapping monominoes true; adjacent false', () => {
    const mono = SIMPLE_SHAPES.find((s) => s.id === 'monomino')!;
    const a: Placement = {
      polyomino: mono,
      position: { row: 0, col: 0 },
      rotation: 0,
      flipped: false,
    };
    const same: Placement = {
      polyomino: mono,
      position: { row: 0, col: 0 },
      rotation: 0,
      flipped: false,
    };
    const adj: Placement = {
      polyomino: mono,
      position: { row: 0, col: 1 },
      rotation: 0,
      flipped: false,
    };
    expect(doPlacementsOverlap(a, same)).toBe(true);
    expect(doPlacementsOverlap(a, adj)).toBe(false);
  });
});
