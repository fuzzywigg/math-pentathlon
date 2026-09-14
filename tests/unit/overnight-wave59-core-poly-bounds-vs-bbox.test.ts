/**
 * Overnight HEAVY leftover after #280 — getBounds vs getBoundingBox agree.
 * Distinct from wave58 hex-pattern / shapes-by-size leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  getBounds,
  getBoundingBox,
  SIMPLE_SHAPES,
} from '../../src/core/polyomino';

describe('Wave 59 core poly — bounds vs bbox', () => {
  it('L-tromino bounds width/height/min match bounding box', () => {
    const L = SIMPLE_SHAPES.find((s) => s.id === 'tromino-L')!;
    const bounds = getBounds(L.cells);
    const box = getBoundingBox(L.cells);
    expect(bounds.width).toBe(box.width);
    expect(bounds.height).toBe(box.height);
    expect(bounds.minRow).toBe(box.minRow);
    expect(bounds.minCol).toBe(box.minCol);
  });
});
