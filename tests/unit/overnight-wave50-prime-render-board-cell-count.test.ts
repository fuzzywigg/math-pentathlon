/**
 * Overnight HEAVY leftover after #229 — Prime Gold renderBoard cell grid. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/prime-gold/rules';
import { CONFIG } from '../../src/games/prime-gold/types';
import { renderBoard } from '../../src/games/prime-gold/board-ui';

describe('Wave 50 prime — renderBoard cells', () => {
  it('renders BOARD_SIZE² cells with data-row/col', () => {
    const el = renderBoard(createInitialState(), () => undefined);
    expect(el.classList.contains('pg-board-container')).toBe(true);
    const cells = el.querySelectorAll('.pg-cell');
    expect(cells.length).toBe(CONFIG.BOARD_SIZE * CONFIG.BOARD_SIZE);
    expect(el.querySelector('.pg-cell[data-row="0"][data-col="0"]')).toBeTruthy();
    expect(
      el.querySelector(
        `.pg-cell[data-row="${CONFIG.BOARD_SIZE - 1}"][data-col="${CONFIG.BOARD_SIZE - 1}"]`
      )
    ).toBeTruthy();
  });
});
