/**
 * Wave 55 leftover after #250 — Juggle placing mouseenter/leave callbacks.
 * Distinct from wave52 hoverPosition preview class. Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { createInitialState, selectDie } from '../../src/games/juggle/rules';
import { renderBoard } from '../../src/games/juggle/board-ui';

describe('Wave 55 juggle — hover leave', () => {
  it('mouseenter reports coords; mouseleave fires leave handler', () => {
    const s = selectDie(
      {
        ...createInitialState(),
        phase: 'selectingShape',
        currentDice: [1, 1],
      },
      0
    );
    const onHover = vi.fn();
    const onLeave = vi.fn();
    const el = renderBoard(
      s.boards.player1,
      'player1',
      true,
      s,
      () => undefined,
      onHover,
      onLeave
    );
    const cell = el.querySelector('.juggle-cell[data-row="1"][data-col="8"]') as HTMLElement;
    cell.dispatchEvent(new Event('mouseenter'));
    expect(onHover).toHaveBeenCalledWith(1, 8);
    cell.dispatchEvent(new Event('mouseleave'));
    expect(onLeave).toHaveBeenCalled();
  });
});
