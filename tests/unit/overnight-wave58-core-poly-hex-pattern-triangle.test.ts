/**
 * Overnight HEAVY leftover after #274 — HEX_PATTERN triangle lookup size 1.
 * Distinct from wave52 order6 excludes hex. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  getPolyominoById,
  HEX_PATTERN_BLOCKS,
} from '../../src/core/polyomino';

describe('Wave 58 core poly — hex pattern triangle', () => {
  it('triangle pattern block has one cell and canFlip', () => {
    const t = getPolyominoById('triangle');
    expect(t).toBeTruthy();
    expect(HEX_PATTERN_BLOCKS.some((s) => s.id === 'triangle')).toBe(true);
    expect(t!.cells).toHaveLength(1);
    expect(t!.canFlip).toBe(false);
    expect(t!.canRotate).toBe(true);
  });
});
