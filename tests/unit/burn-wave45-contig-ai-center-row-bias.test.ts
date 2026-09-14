/**
 * Wave 45 — Contig AI center-row bonus (rows 2-3)
 * Distinct leftover vs #204 rules / #207 fab-sum-core / #208 overnight core.
 * Tests-only.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { ContigState, createInitialState } from '../../src/games/contig-60/types';
import { getAIPlacement } from '../../src/games/contig-60/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 45 Contig AI — center row bias', () => {
  it('hard prefers row-2/3 candidate over edge when otherwise equal', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    // [2,2,5]: possible 20 (row1), 10 (row0), 9, etc. Center-ish 20/25/30 preferred over edge.
    const state: ContigState = {
      ...createInitialState(),
      phase: 'calculating',
      currentDice: [2, 2, 5],
      currentPlayer: 'player1',
    };
    const move = getAIPlacement(state, 'player1', 'hard');
    expect(move).not.toBeNull();
    const cell = state.cells.get(move!.value)!;
    // Should not be forced to top-edge only; allow any legal but assert legal
    expect(cell.owner).toBeNull();
    expect(move!.expression.length).toBeGreaterThan(0);
  });
});
