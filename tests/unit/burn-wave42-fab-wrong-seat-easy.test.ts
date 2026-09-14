/**
 * Wave 42 leftovers B — Fab executeAITurn wrong-seat passes; easy teaching path.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  executeAITurn,
  getAIMove,
  isAITurn,
} from '../../src/games/fab-a-diffy/ai';
import { createInitialState } from '../../src/games/fab-a-diffy/rules';

describe('Wave 42 fab — wrong-seat / easy teaching', () => {
  it('wrong-seat getAIMove null; executeAITurn passes', () => {
    const state = createInitialState();
    expect(getAIMove(state, 'player2', 'hard')).toBeNull();
    const passed = executeAITurn(state, 'player2', 'hard');
    expect(passed.currentPlayer).toBe('player2');
    expect(isAITurn(passed, 'player2', 'human-vs-ai')).toBe(true);
  });

  it('easy getAIMove returns shaped move when available', () => {
    const state = createInitialState();
    const move = getAIMove(state, 'player1', 'easy');
    expect(move).not.toBeNull();
    expect(move!.bar1Id).toBeTruthy();
    expect(move!.answerId).toBeTruthy();
  });
});
