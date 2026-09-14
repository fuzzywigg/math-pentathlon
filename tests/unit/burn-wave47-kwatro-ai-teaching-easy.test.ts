/**
 * Wave 47 leftover after #214/#215 — Kwatro-Sinko AI easy teachingMode behavior with mocked random. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import { createInitialState, passTurn } from '../../src/games/kwatro-sinko/rules';
import { getAIMove, executeAITurn } from '../../src/games/kwatro-sinko/ai';

describe('Wave 47 kwatro deepen 14 — kwatro-sinko — AI teaching easy', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('easy mode returns a move for player2 after pass', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = passTurn(createInitialState());
    const move = getAIMove(state, 'player2', 'easy');

    expect(move).not.toBeNull();
    expect(move!.chipId).toMatch(/^p2-/);
    expect(move!.nodeId).toMatch(/^n/);
  });

  it('easy suboptimal branch fires when random below 0.4', () => {
    const state = passTurn(createInitialState());
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.1) // teaching suboptimal gate
      .mockReturnValueOnce(0); // pick first suboptimal slice entry

    const move = getAIMove(state, 'player2', 'easy');
    expect(move).not.toBeNull();
  });

  it('easy optimal branch uses top evaluated move when random high', () => {
    const state = passTurn(createInitialState());
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const top = getAIMove(state, 'player2', 'easy');
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const again = getAIMove(state, 'player2', 'easy');

    expect(top).toEqual(again);
  });

  it('executeAITurn easy completes a full turn from player2 opening', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = passTurn(createInitialState());
    const after = executeAITurn(state, 'player2', 'easy');

    expect(after.currentPlayer).toBe('player1');
    expect(after.selectedChip).toBeNull();
    expect(after.moveHistory).toHaveLength(1);
  });
});
