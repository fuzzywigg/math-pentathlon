/**
 * Wave 42 — Fab-a-Diffy AI getAIMove / executeAITurn / applyAIMoveSteps / isAITurn. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { createInitialState, passTurn } from '../../src/games/fab-a-diffy/rules';
import {
  getAIMove,
  executeAITurn,
  applyAIMoveSteps,
  isAITurn,
} from '../../src/games/fab-a-diffy/ai';

describe('Wave 42 fab — AI pipeline', () => {
  it('getAIMove / executeAITurn claim for current AI seat', () => {
    const state = createInitialState();
    const move = getAIMove(state, 'player1', 'hard');
    expect(move).not.toBeNull();
    const next = executeAITurn(state, 'player1', 'hard');
    expect(next.scores.player1 + next.scores.player2).toBeGreaterThanOrEqual(1);
    expect(next.moveHistory.length).toBeGreaterThanOrEqual(1);
  });

  it('applyAIMoveSteps applies a concrete move; bad move falls back to pass', () => {
    const state = createInitialState();
    const move = getAIMove(state, 'player1', 'hard');
    expect(move).not.toBeNull();
    const applied = applyAIMoveSteps(state, move!);
    expect(applied.moveHistory.length).toBe(1);

    const bad = applyAIMoveSteps(state, {
      bar1Id: 'ghost-a',
      bar2Id: 'ghost-b',
      operation: 'add',
      answerId: 'ghost-ans',
    });
    // failed selectBar1 → passTurn(state)
    expect(bad.currentPlayer).toBe(passTurn(state).currentPlayer);
    expect(bad.moveHistory).toHaveLength(0);
  });

  it('isAITurn respects mode seat and gameOver', () => {
    const state = createInitialState();
    expect(isAITurn(state, 'player1', 'human-vs-ai')).toBe(true);
    expect(isAITurn(state, 'player2', 'human-vs-ai')).toBe(false);
    expect(isAITurn(state, 'player1', 'human-vs-human')).toBe(false);
    const over = { ...state, phase: 'gameOver' as const, winner: 'player1' as const };
    expect(isAITurn(over, 'player1', 'human-vs-ai')).toBe(false);
  });
});
