/**
 * Wave 44 overnight HEAVY — Fab createInitialState invariants.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fab-a-diffy/rules';
import { FRACTION_BAR_VALUES, ANSWER_BAR_VALUES } from '../../src/games/fab-a-diffy/types';

describe('Wave 44 fab — initial state', () => {
  it('opens selectingBar1 with full unused pools', () => {
    const s = createInitialState();
    expect(s.phase).toBe('selectingBar1');
    expect(s.currentPlayer).toBe('player1');
    expect(s.winner).toBeNull();
    expect(s.selectedBar1).toBeNull();
    expect(s.selectedBar2).toBeNull();
    expect(s.selectedOperation).toBeNull();
    expect(s.moveHistory).toEqual([]);
    expect(s.scores).toEqual({ player1: 0, player2: 0 });
    expect(s.fractionBars.size).toBe(FRACTION_BAR_VALUES.length);
    expect(s.answerBars.size).toBe(ANSWER_BAR_VALUES.length);
    for (const b of s.fractionBars.values()) {
      expect(b.used).toBe(false);
      expect(b.owner).toBeNull();
    }
    for (const a of s.answerBars.values()) {
      expect(a.claimedBy).toBeNull();
    }
  });
});
