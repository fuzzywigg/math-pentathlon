/**
 * Wave 42 — FIAR getAIMove movement phase returns type move with valid from/to. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import { getAIMove } from '../../src/games/fiar/ai';
import { placeChip, getValidMoves, canMove } from '../../src/games/fiar/rules';
import { createInitialState, CONFIG } from '../../src/games/fiar/types';

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
  it('after full place, getAIMove easy returns type move', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = toMovement();
    expect(state.phase).toBe('movement');
    const move = getAIMove(state, state.currentPlayer, 'easy');
    expect(move).not.toBeNull();
    expect(move!.type).toBe('move');
    expect(typeof move!.from).toBe('string');
    expect(typeof move!.to).toBe('string');
  });

  it('returned from/to passes canMove / getValidMoves', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const state = toMovement();
    const move = getAIMove(state, state.currentPlayer, 'easy');
    expect(move?.type).toBe('move');
    expect(state.board.nodes.get(move!.from!)?.chip).toBe(state.currentPlayer);
    expect(getValidMoves(state, move!.from!)).toContain(move!.to!);
    expect(canMove(state, move!.from!, move!.to!)).toBe(true);
  });

  it('medium difficulty also yields a legal movement', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = toMovement();
    const move = getAIMove(state, state.currentPlayer, 'medium');
    expect(move?.type).toBe('move');
    expect(canMove(state, move!.from!, move!.to!)).toBe(true);
  });

  it('placement phase AI is place, not move', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = createInitialState();
    const move = getAIMove(state, 'player1', 'easy');
    expect(move?.type).toBe('place');
    expect(move?.from).toBeUndefined();
  });
});
