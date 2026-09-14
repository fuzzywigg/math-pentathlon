/**
 * Wave 42 — Hex game makeMove history + identity chain.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { makeMove, isValidMove } from '../../src/games/hex/rules';

describe('Wave 42 hex game — history / identity', () => {
  it('moveHistory increments moveNumber and records position', () => {
    let state = createInitialState(5);
    state = makeMove(state, { row: 2, col: 2 });
    state = makeMove(state, { row: 3, col: 1 });
    expect(state.moveHistory).toHaveLength(2);
    expect(state.moveHistory[0]).toMatchObject({
      player: 'player1',
      position: { row: 2, col: 2 },
      moveNumber: 1,
    });
    expect(state.moveHistory[1]).toMatchObject({
      player: 'player2',
      position: { row: 3, col: 1 },
      moveNumber: 2,
    });
  });

  it('double-play same cell is identity after first', () => {
    const state = createInitialState(4);
    const first = makeMove(state, { row: 0, col: 0 });
    expect(first).not.toBe(state);
    expect(makeMove(first, { row: 0, col: 0 })).toBe(first);
    expect(isValidMove(first, { row: 0, col: 0 })).toBe(false);
  });

  it('boardSize preserved across moves', () => {
    let state = createInitialState(6);
    state = makeMove(state, { row: 5, col: 5 });
    expect(state.boardSize).toBe(6);
    expect(state.board).toHaveLength(6);
  });
});
