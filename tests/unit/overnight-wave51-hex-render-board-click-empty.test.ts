/**
 * Overnight HEAVY leftovers after #234 — Hex empty-cell click callback. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { renderBoard } from '../../src/games/hex/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 51 hex — empty click', () => {
  it('invokes onCellClick with row/col for empty cells', () => {
    const box = document.createElement('div');
    document.body.appendChild(box);
    const hits: Array<[number, number]> = [];
    renderBoard(createInitialState(3), box, (r, c) => hits.push([r, c]));
    const cell = box.querySelector(
      '.hex-cell-group[data-row="1"][data-col="2"]'
    ) as SVGGElement;
    cell.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(hits).toEqual([[1, 2]]);
  });
});
