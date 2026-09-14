/**
 * Overnight HEAVY leftover after #280 — normalizeCells([]) passthrough.
 * Distinct from wave57 empty COM / wave58 empty solve. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { normalizeCells } from '../../src/core/polyomino';

describe('Wave 59 core poly — normalize empty', () => {
  it('empty cell list normalizes to empty', () => {
    expect(normalizeCells([])).toEqual([]);
  });
});
