/**
 * Wave 45 — Contig getAdjacentPositions corner vs edge vs interior counts
 * Distinct leftover vs #204 rules / #207 fab-sum-core / #208 overnight core.
 * Tests-only.
 */

import { describe, it, expect } from 'vitest';
import { getAdjacentPositions, CONFIG } from '../../src/games/contig-60/types';

describe('Wave 45 Contig — adjacent count matrix leftover', () => {
  it('corners 3, edges 5, interior 8 including far corner', () => {
    expect(getAdjacentPositions(0, CONFIG.GRID_COLS - 1)).toHaveLength(3);
    expect(getAdjacentPositions(CONFIG.GRID_ROWS - 1, 0)).toHaveLength(3);
    expect(getAdjacentPositions(3, 0)).toHaveLength(5);
    expect(getAdjacentPositions(5, 4)).toHaveLength(5);
    expect(getAdjacentPositions(3, 5)).toHaveLength(8);
  });
});
