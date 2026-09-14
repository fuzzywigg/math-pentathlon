/**
 * Overnight HEAVY after #214/#215 — Hex-a-Gone canPlayerMove opening. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import { canPlayerMove, getValidPlacements, selectBlock, commitSelection } from '../../src/games/hex-a-gone/rules';

describe('Overnight hex-a-gone — canPlayerMove', () => {
  it('opening can move; placements nonempty after commit', () => {
    const s = createInitialState();
    expect(canPlayerMove(s)).toBe(true);
    const placing = commitSelection(selectBlock(s, 'triangle'));
    expect(placing.phase).toBe('placeBlocks');
    expect(getValidPlacements(placing).length).toBeGreaterThan(0);
  });
});
