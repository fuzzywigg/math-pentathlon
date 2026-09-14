/**
 * Overnight HEAVY leftover after #234 — Juggle grid data-row/data-col. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/juggle/rules';
import { CONFIG } from '../../src/games/juggle/types';
import { renderBoard } from '../../src/games/juggle/board-ui';

describe('Wave 52 juggle — cell data attrs', () => {
  it('tags every cell with row/col dataset', () => {
    const s = createInitialState();
    const el = renderBoard(
      s.boards.player1,
      'player1',
      true,
      s,
      () => undefined,
      () => undefined,
      () => undefined
    );
    expect(el.querySelectorAll('.juggle-cell').length).toBe(
      CONFIG.GRID_SIZE * CONFIG.GRID_SIZE
    );
    expect(el.querySelector(`.juggle-cell[data-row="0"][data-col="0"]`)).toBeTruthy();
    expect(
      el.querySelector(
        `.juggle-cell[data-row="${CONFIG.GRID_SIZE - 1}"][data-col="${CONFIG.GRID_SIZE - 1}"]`
      )
    ).toBeTruthy();
  });
});
