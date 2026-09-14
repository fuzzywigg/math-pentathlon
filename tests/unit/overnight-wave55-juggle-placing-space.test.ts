/**
 * Wave 55 leftover after #250 — Juggle placing Space activate.
 * Complements Enter leftover; not calla #251. Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { createInitialState, selectDie } from '../../src/games/juggle/rules';
import { renderBoard } from '../../src/games/juggle/board-ui';

describe('Wave 55 juggle — placing Space', () => {
  it('Space keydown on an empty placing cell activates click', () => {
    const s = selectDie(
      {
        ...createInitialState(),
        phase: 'selectingShape',
        currentDice: [1, 1],
      },
      0
    );
    const onClick = vi.fn();
    const el = renderBoard(
      s.boards.player1,
      'player1',
      true,
      s,
      onClick,
      () => undefined,
      () => undefined
    );
    const cell = el.querySelector('.juggle-cell[data-row="3"][data-col="0"]') as HTMLElement;
    cell.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    expect(onClick).toHaveBeenCalledWith(3, 0);
  });
});
