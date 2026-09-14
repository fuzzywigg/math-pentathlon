/**
 * Wave 42 — FIAR AI getAIMove in movement phase. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import { getAIMove, applyAIMove } from '../../src/games/fiar/ai';
import { createInitialState, CONFIG } from '../../src/games/fiar/types';
import { placeChip, canMove } from '../../src/games/fiar/rules';

afterEach(() => {
  vi.restoreAllMocks();
});

function toMovement() {
  let state = createInitialState();
  const ids = [...state.board.nodes.keys()];
  for (let i = 0; i < CONFIG.CHIPS_PER_PLAYER * 2; i++) {
    state = placeChip(state, ids[i]);
  }
  return state;
}

describe('Wave 42 fiar — AI movement phase', () => {
  it('getAIMove returns a move-type suggestion after full place', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = toMovement();
    expect(state.phase).toBe('movement');
    const move = getAIMove(state, state.currentPlayer, 'easy');
    expect(move).not.toBeNull();
    expect(move!.type).toBe('move');
    expect(move!.from).toBeTruthy();
    expect(move!.to).toBeTruthy();
    expect(canMove(state, move!.from!, move!.to!)).toBe(true);
  });

  it('applyAIMove executes the suggested movement', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = toMovement();
    const move = getAIMove(state, state.currentPlayer, 'easy');
    const next = applyAIMove(state, move!);
    expect(next).not.toBe(state);
    expect(next.board.nodes.get(move!.from!)?.chip).toBeNull();
    expect(next.board.nodes.get(move!.to!)?.chip).toBe(state.currentPlayer);
    expect(next.moveHistory.at(-1)?.type).toBe('move');
  });

  it('getAIMove on gameOver returns null', () => {
    const over = {
      ...toMovement(),
      phase: 'gameOver' as const,
      winner: 'player1' as const,
    };
    expect(getAIMove(over, 'player1', 'easy')).toBeNull();
  });
});
