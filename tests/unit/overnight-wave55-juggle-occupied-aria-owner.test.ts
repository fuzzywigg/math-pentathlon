/**
 * Wave 55 leftover after #250 — Juggle occupied cell aria owner, no pointer.
 * Distinct from wave52 occupied class. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, placeShape, selectDie } from '../../src/games/juggle/rules';
import { renderBoard, getPlayerName } from '../../src/games/juggle/board-ui';

describe('Wave 55 juggle — occupied aria owner', () => {
  it('announces Blue owner and skips pointer cursor on occupied cell', () => {
    let s = selectDie(
      {
        ...createInitialState(),
        phase: 'selectingShape',
        currentDice: [1, 1],
      },
      0
    );
    s = placeShape(s, { row: 0, col: 2 });
    const el = renderBoard(
      s.boards.player1,
      'player1',
      true,
      { ...s, phase: 'placing', hoverPosition: null },
      () => undefined,
      () => undefined,
      () => undefined
    );
    const cell = el.querySelector('.juggle-cell[data-row="0"][data-col="2"]') as HTMLElement;
    expect(cell.classList.contains('occupied-player1')).toBe(true);
    expect(cell.getAttribute('aria-label') ?? '').toMatch(getPlayerName('player1'));
    expect(cell.style.cursor).not.toBe('pointer');
  });
});
