/**
 * Wave 42 — Fab-a-Diffy passTurn flip and double-pass end. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  passTurn,
  hasAnyValidMove,
} from '../../src/games/fab-a-diffy/rules';
import type { FabADiffyState } from '../../src/games/fab-a-diffy/types';

describe('Wave 42 fab — pass double end', () => {
  it('passTurn flips seat and clears mid-selection', () => {
    const state = createInitialState();
    const mid: FabADiffyState = {
      ...state,
      selectedBar1: [...state.fractionBars.keys()][0],
      phase: 'selectingBar2',
    };
    const next = passTurn(mid);
    expect(next.currentPlayer).toBe('player2');
    expect(next.selectedBar1).toBeNull();
    expect(next.selectedBar2).toBeNull();
    expect(next.selectedOperation).toBeNull();
    expect(next.phase).toBe('selectingBar1');
  });

  it('pass when opponent also has no moves ends game', () => {
    const state = createInitialState();
    const bars = new Map(state.fractionBars);
    for (const [id, b] of bars) {
      bars.set(id, { ...b, used: true });
    }
    const stuck: FabADiffyState = {
      ...state,
      fractionBars: bars,
      scores: { player1: 2, player2: 5 },
    };
    expect(hasAnyValidMove(stuck)).toBe(false);
    const ended = passTurn(stuck);
    expect(ended.phase).toBe('gameOver');
    expect(ended.winner).toBe('player2');
  });
});
