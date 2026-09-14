/**
 * Overnight HEAVY leftover after #234 — Juggle empty-board 0% fill header. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/juggle/rules';
import { renderBoard } from '../../src/games/juggle/board-ui';

describe('Wave 52 juggle — fill zero', () => {
  it('shows 0% fill on empty opening board', () => {
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
    expect(el.querySelector('.fill-percent')?.textContent).toBe('0%');
  });
});
