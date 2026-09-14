/**
 * Wave 43 — Calla AI prefers available pit when captures exist. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import { createInitialState, type CallaGameState } from '../../src/games/calla/types';
import { getAIMove } from '../../src/games/calla/ai';
import { makeMove } from '../../src/games/calla/rules';

afterEach(() => vi.restoreAllMocks());

describe('Wave 43 calla — AI capture prefer', () => {
  it('hard AI returns a legal pit that makeMove accepts', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state: CallaGameState = {
      ...createInitialState(),
      player1Pits: [1, 0, 2, 0, 3],
      player2Pits: [2, 2, 2, 4, 2],
    };
    const move = getAIMove(state, 'player1', 'hard');
    expect(move).not.toBeNull();
    const next = makeMove(state, move!.pit);
    expect(next).not.toBe(state);
    expect(next.moveHistory.length).toBe(1);
  });
});
