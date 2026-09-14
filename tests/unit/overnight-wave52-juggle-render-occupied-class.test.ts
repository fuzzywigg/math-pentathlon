/**
 * Overnight HEAVY leftover after #234 — Juggle occupied seat cell class. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, selectDie, placeShape } from '../../src/games/juggle/rules';
import { renderBoard } from '../../src/games/juggle/board-ui';

describe('Wave 52 juggle — occupied class', () => {
  it('adds occupied-player1 after monomino place', () => {
    let s = selectDie(
      {
        ...createInitialState(),
        phase: 'selectingShape',
        currentDice: [1, 1],
      },
      0
    );
    s = placeShape(s, { row: 1, col: 1 });
    const el = renderBoard(
      s.boards.player1,
      'player1',
      false,
      { ...createInitialState(), boards: s.boards },
      () => undefined,
      () => undefined,
      () => undefined
    );
    expect(
      el.querySelector('.juggle-cell[data-row="1"][data-col="1"]')?.classList.contains(
        'occupied-player1'
      )
    ).toBe(true);
  });
});
