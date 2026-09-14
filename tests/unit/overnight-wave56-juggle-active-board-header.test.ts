/**
 * Wave 56 leftover after #256 — Juggle active board class + Blue header.
 * Distinct from wave52 inactive board leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/juggle/rules';
import { renderBoard } from '../../src/games/juggle/board-ui';

describe('Wave 56 juggle — active board class header', () => {
  it('marks current P1 board active with Blue name', () => {
    const state = createInitialState();
    const el = renderBoard(
      state.boards.player1,
      'player1',
      true,
      state,
      () => undefined,
      () => undefined,
      () => undefined
    );
    expect(el.classList.contains('juggle-board')).toBe(true);
    expect(el.classList.contains('player1')).toBe(true);
    expect(el.classList.contains('active')).toBe(true);
    expect(el.querySelector('.player-name')?.textContent).toBe('Blue');
  });
});
