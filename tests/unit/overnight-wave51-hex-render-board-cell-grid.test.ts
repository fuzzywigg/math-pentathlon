/**
 * Overnight HEAVY leftovers after #234 — Hex game renderBoard cell grid.
 * Distinct from tip prime/frac/pent and core hex-ui. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { renderBoard } from '../../src/games/hex/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 51 hex — renderBoard cells', () => {
  it('renders size² cell groups with data-row/col', () => {
    const size = 5;
    const box = document.createElement('div');
    document.body.appendChild(box);
    renderBoard(createInitialState(size), box, () => undefined);
    const cells = box.querySelectorAll('.hex-cell-group[data-row][data-col]');
    expect(cells.length).toBe(size * size);
    expect(box.querySelector('.hex-cell-group[data-row="0"][data-col="0"]')).toBeTruthy();
    expect(
      box.querySelector(`.hex-cell-group[data-row="${size - 1}"][data-col="${size - 1}"]`)
    ).toBeTruthy();
    expect(box.querySelectorAll('.hex-cell-empty').length).toBe(size * size);
  });
});
