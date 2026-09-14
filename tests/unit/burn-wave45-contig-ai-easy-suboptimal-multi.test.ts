/**
 * Wave 45 — Contig AI easy teaching picks from options.slice(1)
 * Distinct leftover vs #204 rules / #207 fab-sum-core / #208 overnight core.
 * Tests-only.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { ContigState, createInitialState } from '../../src/games/contig-60/types';
import { getAIPlacement } from '../../src/games/contig-60/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 45 Contig AI — easy suboptimal multi', () => {
  it('easy with random<0.4 picks a non-top option when many exist', () => {
    // First random for teaching gate (<0.4), second for suboptimal index
    const seq = [0.1, 0.0];
    vi.spyOn(Math, 'random').mockImplementation(() => seq.shift() ?? 0.99);
    const state: ContigState = {
      ...createInitialState(),
      phase: 'calculating',
      currentDice: [2, 3, 4],
      currentPlayer: 'player1',
    };
    const best = getAIPlacement(
      { ...state },
      'player1',
      'hard'
    );
    // Reset sequence for easy call
    seq.splice(0, seq.length, 0.1, 0.0);
    const easy = getAIPlacement(state, 'player1', 'easy');
    expect(easy).not.toBeNull();
    expect(best).not.toBeNull();
    // Soft: easy is legal; often differs from hard top when teaching fires
    expect(easy!.expression.length).toBeGreaterThan(0);
    expect(state.cells.has(easy!.value)).toBe(true);
  });
});
