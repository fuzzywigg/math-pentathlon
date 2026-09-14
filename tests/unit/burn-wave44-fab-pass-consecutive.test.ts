/**
 * Wave 44 — Fab-a-Diffy passTurn seat flip then second pass end leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  passTurn,
  hasAnyValidMove,
} from '../../src/games/fab-a-diffy/rules';
import type { FabADiffyState, FractionBar } from '../../src/games/fab-a-diffy/types';

describe('Wave 44 Fab — consecutive passTurn end', () => {
  it('open board: pass flips; second pass still open if moves exist', () => {
    let state = createInitialState();
    expect(hasAnyValidMove(state)).toBe(true);
    state = passTurn(state);
    expect(state.currentPlayer).toBe('player2');
    expect(state.phase).toBe('selectingBar1');
    state = passTurn(state);
    expect(state.currentPlayer).toBe('player1');
    expect(state.phase).toBe('selectingBar1');
    expect(state.winner).toBeNull();
  });

  it('after first pass into jammed opponent seat → game ends', () => {
    const state = createInitialState();
    // Only one unused bar → after flip, opponent also has no move
    const bars = new Map<string, FractionBar>();
    for (const [id, b] of state.fractionBars) {
      bars.set(id, { ...b, used: true });
    }
    const ids = [...bars.keys()];
    bars.set(ids[0], { ...bars.get(ids[0])!, used: false });
    const almost: FabADiffyState = {
      ...state,
      fractionBars: bars,
      scores: { player1: 2, player2: 5 },
      currentPlayer: 'player1',
    };
    expect(hasAnyValidMove(almost)).toBe(false);
    const next = passTurn(almost);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player2');
  });

  it('pass clears selection fields even when ending', () => {
    const state = createInitialState();
    const bars = new Map(state.fractionBars);
    for (const [id, b] of bars) {
      bars.set(id, { ...b, used: true });
    }
    const jammed: FabADiffyState = {
      ...state,
      fractionBars: bars,
      selectedBar1: 'keep?',
      selectedBar2: 'nope',
      selectedOperation: 'divide',
      phase: 'confirmingMove',
      scores: { player1: 1, player2: 0 },
    };
    const next = passTurn(jammed);
    expect(next.selectedBar1).toBeNull();
    expect(next.selectedBar2).toBeNull();
    expect(next.selectedOperation).toBeNull();
    expect(next.phase).toBe('gameOver');
  });
});
