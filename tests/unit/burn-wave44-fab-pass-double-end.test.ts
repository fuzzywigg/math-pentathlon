/**
 * Wave 44 — Fab-a-Diffy passTurn double-end / score settle leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  passTurn,
  hasAnyValidMove,
} from '../../src/games/fab-a-diffy/rules';
import type { FabADiffyState } from '../../src/games/fab-a-diffy/types';

describe('Wave 44 Fab — passTurn double-end scores', () => {
  function noMoves(scores: { player1: number; player2: number }): FabADiffyState {
    const state = createInitialState();
    const bars = new Map(state.fractionBars);
    for (const [id, b] of bars) {
      bars.set(id, { ...b, used: true });
    }
    return { ...state, fractionBars: bars, scores };
  }

  it('pass when opponent also jammed → gameOver with p2 winner', () => {
    const jammed = noMoves({ player1: 1, player2: 4 });
    expect(hasAnyValidMove(jammed)).toBe(false);
    const next = passTurn(jammed);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player2');
    expect(next.currentPlayer).toBe('player2');
  });

  it('pass when opponent jammed with tie → winner null', () => {
    const next = passTurn(noMoves({ player1: 0, player2: 0 }));
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBeNull();
  });

  it('first pass keeps game alive when opponent still has moves', () => {
    const open = createInitialState();
    expect(hasAnyValidMove(open)).toBe(true);
    const after = passTurn({
      ...open,
      selectedBar1: 'x',
      selectedBar2: 'y',
      selectedOperation: 'add',
      phase: 'confirmingMove',
    });
    expect(after.phase).toBe('selectingBar1');
    expect(after.winner).toBeNull();
    expect(after.currentPlayer).toBe('player2');
    expect(after.selectedOperation).toBeNull();
  });
});
