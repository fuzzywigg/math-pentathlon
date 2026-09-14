/**
 * Overnight HEAVY leftover after #234 — Ramrod board grid rows/cols. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/ramrod/rules';
import { CONFIG } from '../../src/games/ramrod/types';
import { renderBoard } from '../../src/games/ramrod/board-ui';

describe('Wave 52 ramrod — grid size', () => {
  it('renders CONFIG.BOARD_ROWS rows and BOARD_COLS boxes each', () => {
    const el = renderBoard(createInitialState(), () => undefined);
    expect(el.querySelectorAll('.ramrod-row').length).toBe(CONFIG.BOARD_ROWS);
    expect(el.querySelectorAll('.ramrod-box').length).toBe(
      CONFIG.BOARD_ROWS * CONFIG.BOARD_COLS
    );
  });
});
