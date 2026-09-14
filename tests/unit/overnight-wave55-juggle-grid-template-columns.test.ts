/**
 * Wave 55 leftover after #250 — Juggle grid-template-columns uses CONFIG.GRID_SIZE.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/juggle/rules';
import { CONFIG } from '../../src/games/juggle/types';
import { renderBoard } from '../../src/games/juggle/board-ui';

describe('Wave 55 juggle — grid template columns', () => {
  it('sets repeat(GRID_SIZE, 1fr) on the grid', () => {
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
    const grid = el.querySelector('.juggle-grid') as HTMLElement;
    expect(grid.style.gridTemplateColumns).toBe(`repeat(${CONFIG.GRID_SIZE}, 1fr)`);
  });
});
