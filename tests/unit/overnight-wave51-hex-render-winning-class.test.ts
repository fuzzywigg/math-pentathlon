/**
 * Wave 51 leftover after #233 — classic Hex winning path class. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { makeMove } from '../../src/games/hex/rules';
import { renderBoard } from '../../src/games/hex/board-ui';

describe('Wave 51 hex — winning class', () => {
  it('adds hex-cell-winning on vertical Blue path', () => {
    let state = createInitialState(3);
    // P1 connects top→bottom on col 1: (0,1)(1,1)(2,1) with P2 filler moves
    state = makeMove(state, { row: 0, col: 1 }); // P1
    state = makeMove(state, { row: 0, col: 0 }); // P2
    state = makeMove(state, { row: 1, col: 1 }); // P1
    state = makeMove(state, { row: 0, col: 2 }); // P2
    state = makeMove(state, { row: 2, col: 1 }); // P1 wins
    expect(state.winner).toBe('player1');
    const container = document.createElement('div');
    renderBoard(state, container);
    expect(container.querySelectorAll('.hex-cell-winning').length).toBeGreaterThan(0);
  });
});
