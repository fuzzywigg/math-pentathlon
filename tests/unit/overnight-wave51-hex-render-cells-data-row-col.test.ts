/**
 * Wave 51 leftover after #233 — classic Hex cell grid data attrs. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { renderBoard } from '../../src/games/hex/board-ui';

describe('Wave 51 hex — cell grid', () => {
  it('stamps boardSize^2 cells with data-row/col and empty class', () => {
    const size = 5;
    const container = document.createElement('div');
    renderBoard(createInitialState(size), container);
    const groups = container.querySelectorAll('.hex-cell-group');
    expect(groups.length).toBe(size * size);
    expect(container.querySelector('[data-row="0"][data-col="0"]')).toBeTruthy();
    expect(container.querySelectorAll('.hex-cell-empty').length).toBe(size * size);
  });
});
