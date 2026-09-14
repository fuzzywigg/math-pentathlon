/**
 * Overnight HEAVY leftovers after #234 — Hex last-move cell class. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { makeMove } from '../../src/games/hex/rules';
import { renderBoard } from '../../src/games/hex/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 51 hex — last-move', () => {
  it('marks only the latest move with hex-cell-last-move', () => {
    let state = createInitialState(4);
    state = makeMove(state, { row: 1, col: 1 });
    state = makeMove(state, { row: 2, col: 2 });
    const box = document.createElement('div');
    document.body.appendChild(box);
    renderBoard(state, box, () => undefined);
    const lasts = box.querySelectorAll('.hex-cell-last-move');
    expect(lasts.length).toBe(1);
    const g = box.querySelector('.hex-cell-group[data-row="2"][data-col="2"]')!;
    expect(g.querySelector('.hex-cell-last-move')).toBeTruthy();
    expect(
      box
        .querySelector('.hex-cell-group[data-row="1"][data-col="1"]')!
        .querySelector('.hex-cell-last-move')
    ).toBeNull();
  });
});
