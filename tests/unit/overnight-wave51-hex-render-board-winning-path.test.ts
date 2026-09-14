/**
 * Overnight HEAVY leftovers after #234 — Hex winning-path highlight. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { makeMove } from '../../src/games/hex/rules';
import { renderBoard } from '../../src/games/hex/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 51 hex — winning path', () => {
  it('marks hex-cell-winning on Blue top-bottom column win', () => {
    let state = createInitialState(3);
    // P1 column 0: (0,0) then P2 elsewhere then P1 (1,0) then P2 then P1 (2,0)
    state = makeMove(state, { row: 0, col: 0 });
    state = makeMove(state, { row: 0, col: 1 });
    state = makeMove(state, { row: 1, col: 0 });
    state = makeMove(state, { row: 0, col: 2 });
    state = makeMove(state, { row: 2, col: 0 });
    expect(state.winner).toBe('player1');
    const box = document.createElement('div');
    document.body.appendChild(box);
    renderBoard(state, box, () => undefined);
    const winning = box.querySelectorAll('.hex-cell-winning');
    expect(winning.length).toBeGreaterThanOrEqual(3);
    for (const row of [0, 1, 2]) {
      expect(
        box
          .querySelector(`.hex-cell-group[data-row="${row}"][data-col="0"]`)!
          .querySelector('.hex-cell-winning')
      ).toBeTruthy();
    }
  });
});
