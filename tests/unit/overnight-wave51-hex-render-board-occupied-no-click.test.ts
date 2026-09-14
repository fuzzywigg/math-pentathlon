/**
 * Overnight HEAVY leftovers after #234 — Hex occupied cells do not click. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { makeMove } from '../../src/games/hex/rules';
import { renderBoard } from '../../src/games/hex/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 51 hex — occupied no-click', () => {
  it('does not fire callback on occupied cell; marks p1 class', () => {
    let state = createInitialState(3);
    state = makeMove(state, { row: 0, col: 0 });
    const box = document.createElement('div');
    document.body.appendChild(box);
    let hits = 0;
    renderBoard(state, box, () => {
      hits++;
    });
    const cell = box.querySelector(
      '.hex-cell-group[data-row="0"][data-col="0"]'
    ) as SVGGElement;
    expect(cell.querySelector('.hex-cell-p1')).toBeTruthy();
    cell.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(hits).toBe(0);
  });
});
