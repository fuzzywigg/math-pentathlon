/**
 * Wave 42 — Kwatro-Sinko multi-move sequences advancing seats without win. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  selectChip,
  moveChip,
  passTurn,
} from '../../src/games/kwatro-sinko/rules';

function playMove(
  state: ReturnType<typeof createInitialState>,
  chipId: string,
  dest: string
) {
  return moveChip(selectChip(state, chipId), dest);
}

describe('Wave 42 kwatro-sinko — multi-move seats', () => {
  it('two consecutive p1-then-p2 moves alternate seats', () => {
    let state = createInitialState();
    expect(state.currentPlayer).toBe('player1');

    state = playMove(state, 'p1-0', 'n1-0');
    expect(state.phase).toBe('selectingChip');
    expect(state.currentPlayer).toBe('player2');
    expect(state.winner).toBeNull();

    state = playMove(state, 'p2-0', 'n3-0');
    expect(state.currentPlayer).toBe('player1');
    expect(state.moveHistory).toHaveLength(2);
  });

  it('three-move opening exchange keeps game in selectingChip', () => {
    let state = createInitialState();
    state = playMove(state, 'p1-2', 'n1-2');
    state = playMove(state, 'p2-2', 'n3-2');
    state = playMove(state, 'p1-4', 'n1-4');

    expect(state.phase).toBe('selectingChip');
    expect(state.winner).toBeNull();
    expect(state.currentPlayer).toBe('player2');
    expect(state.moveHistory).toHaveLength(3);
  });

  it('passTurn sandwiched between moves preserves alternating flow', () => {
    let state = playMove(createInitialState(), 'p1-1', 'n1-1');
    expect(state.currentPlayer).toBe('player2');

    state = passTurn(state);
    expect(state.currentPlayer).toBe('player1');

    state = playMove(state, 'p1-3', 'n1-3');
    expect(state.currentPlayer).toBe('player2');
    expect(state.moveHistory).toHaveLength(2);
  });

  it('move numbers increment across the sequence', () => {
    let state = createInitialState();
    state = playMove(state, 'p1-0', 'n1-0');
    state = playMove(state, 'p2-4', 'n3-4');
    state = playMove(state, 'p1-2', 'n1-2');

    expect(state.moveHistory.map((m) => m.moveNumber)).toEqual([1, 2, 3]);
    expect(state.moveHistory[0].player).toBe('player1');
    expect(state.moveHistory[1].player).toBe('player2');
  });
});
