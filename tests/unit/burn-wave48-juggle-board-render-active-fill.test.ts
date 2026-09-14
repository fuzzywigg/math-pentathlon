/**
 * Wave 48 — Juggle renderBoard active + fill percent. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/juggle/rules';
import { CONFIG } from '../../src/games/juggle/types';
import { renderBoard, getPlayerName } from '../../src/games/juggle/board-ui';

describe('Wave 48 juggle — renderBoard chrome', () => {
  it('marks active seat and shows Blue fill header', () => {
    const s = createInitialState();
    const el = renderBoard(s.boards.player1, 'player1', true, s, () => undefined, () => undefined, () => undefined);
    expect(el.classList.contains('active')).toBe(true);
    expect(el.classList.contains('player1')).toBe(true);
    expect(el.querySelector('.player-name')?.textContent).toBe(getPlayerName('player1'));
    expect(el.querySelector('.fill-percent')?.textContent).toMatch(/%/);
    expect(el.querySelectorAll('.juggle-cell').length).toBe(
      CONFIG.GRID_SIZE * CONFIG.GRID_SIZE
    );
  });
});
