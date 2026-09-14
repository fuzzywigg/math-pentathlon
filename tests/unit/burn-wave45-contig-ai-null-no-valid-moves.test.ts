/**
 * Wave 45 — Contig getAIPlacement null when hasValidMoves false
 * Distinct leftover vs #204 rules / #207 fab-sum-core / #208 overnight core.
 * Tests-only.
 */

import { describe, it, expect } from 'vitest';
import { ContigState, createInitialState } from '../../src/games/contig-60/types';
import { getAIPlacement } from '../../src/games/contig-60/ai';
import { hasValidMoves } from '../../src/games/contig-60/rules';

describe('Wave 45 Contig AI — null no valids', () => {
  it('returns null mid-calc when dice cannot hit free cells', () => {
    const cells = new Map(createInitialState().cells);
    for (const [v, cell] of cells) cells.set(v, { ...cell, owner: 'player2' });
    const state: ContigState = {
      ...createInitialState(),
      cells,
      phase: 'calculating',
      currentDice: [1, 1, 1],
      currentPlayer: 'player1',
    };
    expect(hasValidMoves(state)).toBe(false);
    expect(getAIPlacement(state, 'player1', 'hard')).toBeNull();
  });
});
