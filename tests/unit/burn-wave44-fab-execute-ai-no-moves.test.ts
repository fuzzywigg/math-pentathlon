/**
 * Wave 44 — Fab-a-Diffy executeAITurn / getAIMove empty-board leftovers.
 * Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState, hasAnyValidMove } from '../../src/games/fab-a-diffy/rules';
import { executeAITurn, getAIMove } from '../../src/games/fab-a-diffy/ai';
import type { FabADiffyState } from '../../src/games/fab-a-diffy/types';

afterEach(() => vi.restoreAllMocks());

describe('Wave 44 Fab AI — no-move execute / getAIMove', () => {
  function jammedState(scores = { player1: 4, player2: 1 }): FabADiffyState {
    const state = createInitialState();
    const bars = new Map(state.fractionBars);
    for (const [id, b] of bars) {
      bars.set(id, { ...b, used: true });
    }
    return { ...state, fractionBars: bars, scores };
  }

  it('getAIMove returns null when no unused bar pairs', () => {
    const jammed = jammedState();
    expect(hasAnyValidMove(jammed)).toBe(false);
    expect(getAIMove(jammed, 'player1', 'hard')).toBeNull();
    expect(getAIMove(jammed, 'player1', 'easy')).toBeNull();
  });

  it('executeAITurn with no moves → passTurn ends game with score winner', () => {
    const jammed = jammedState({ player1: 5, player2: 2 });
    const next = executeAITurn(jammed, 'player1', 'hard');
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
    expect(next.moveHistory).toHaveLength(0);
  });

  it('executeAITurn jammed equal scores → winner null', () => {
    const jammed = jammedState({ player1: 3, player2: 3 });
    const next = executeAITurn(jammed, 'player1', 'medium');
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBeNull();
  });
});
