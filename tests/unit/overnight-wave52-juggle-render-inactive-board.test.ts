/**
 * Overnight HEAVY leftover after #234 — Juggle inactive seat board chrome. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/juggle/rules';
import { renderBoard, getPlayerName } from '../../src/games/juggle/board-ui';

describe('Wave 52 juggle — inactive board', () => {
  it('renders Red board without active class when not current', () => {
    const s = createInitialState();
    const el = renderBoard(
      s.boards.player2,
      'player2',
      false,
      s,
      () => undefined,
      () => undefined,
      () => undefined
    );
    expect(el.classList.contains('active')).toBe(false);
    expect(el.classList.contains('player2')).toBe(true);
    expect(el.querySelector('.player-name')?.textContent).toBe(getPlayerName('player2'));
  });
});
