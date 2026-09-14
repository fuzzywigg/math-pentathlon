/**
 * Wave 49 leftover after #221/#226/#227 — Stars renderBoard cells. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/stars-bars/rules';
import { CONFIG } from '../../src/games/stars-bars/types';
import { renderBoard } from '../../src/games/stars-bars/board-ui';

describe('Wave 49 stars — renderBoard', () => {
  it('renders BOARD_SIZE^2 cells with star corners', () => {
    const el = renderBoard(createInitialState(), () => undefined);
    expect(el.classList.contains('stars-board-container')).toBe(true);
    expect(el.querySelectorAll('.stars-cell').length).toBe(CONFIG.BOARD_SIZE * CONFIG.BOARD_SIZE);
    expect(el.querySelectorAll('.stars-cell.star').length).toBeGreaterThan(0);
  });
});
