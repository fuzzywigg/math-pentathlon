/**
 * Wave 45 — Contig AI empty-neighbor position bias
 * Distinct leftover vs #204 rules / #207 fab-sum-core / #208 overnight core.
 * Tests-only.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { ContigState, createInitialState } from '../../src/games/contig-60/types';
import { getAIPlacement } from '../../src/games/contig-60/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 45 Contig AI — empty neighbor bias', () => {
  it('hard prefers interior cell with more empty neighbors when points equal', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    // Dice [1,1,1] → results include 1,2,3 via various ops: 1+1+1=3, (1+1)*1=2, 1*1*1=1
    // Corner 1 has few empty neighbors; 3 is more interior on top row.
    const state: ContigState = {
      ...createInitialState(),
      phase: 'calculating',
      currentDice: [1, 1, 1],
      currentPlayer: 'player1',
    };
    const move = getAIPlacement(state, 'player1', 'hard');
    expect(move).not.toBeNull();
    expect([1, 2, 3]).toContain(move!.value);
    // Prefer not the absolute corner when better empty-neighbor options exist
    expect(move!.value).not.toBe(1);
  });
});
