/**
 * Wave 42 — Par 55 executeAITurn pass / empty hand leftovers after #186. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import { createInitialState } from '../../src/games/par-55/rules';
import { executeAITurn, getAIMove } from '../../src/games/par-55/ai';
import type { Par55State } from '../../src/games/par-55/types';

describe('Wave 42 par55 — executeAITurn pass paths', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('empty hand → getAIMove null → executeAITurn passes turn', () => {
    const state = createInitialState();
    const empty: Par55State = {
      ...state,
      hands: { ...state.hands, player1: [] },
    };
    expect(getAIMove(empty, 'player1', 'hard')).toBeNull();
    const next = executeAITurn(empty, 'player1', 'hard');
    expect(next.currentPlayer).toBe('player2');
    expect(next.phase).toBe('selectingBlock');
    expect(next.selectedBlock).toBeNull();
  });

  it('executeAITurn on wrong seat still passes via null move path', () => {
    const state = createInitialState();
    const next = executeAITurn(state, 'player2', 'medium');
    expect(next.currentPlayer).toBe('player1');
  });

  it('executeAITurn hard advances state with history when moves exist', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = createInitialState();
    const next = executeAITurn(state, 'player1', 'hard');
    expect(next.currentPlayer).toBe('player2');
    expect(next.moveHistory.length).toBe(1);
    expect(next.phase).toBe('selectingBlock');
  });

  it('executeAITurn easy records a placement move', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = createInitialState();
    const next = executeAITurn(state, 'player1', 'easy');
    expect(next.moveHistory.length).toBeGreaterThanOrEqual(1);
    expect(next.hands.player1.length).toBe(4);
  });
});
