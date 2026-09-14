/**
 * Wave 55 leftover after #250 — Juggle fill-percent after a monomino place.
 * Distinct from wave52 opening 0%. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, placeShape, selectDie } from '../../src/games/juggle/rules';
import { renderBoard } from '../../src/games/juggle/board-ui';

describe('Wave 55 juggle — fill one percent', () => {
  it('shows 1% after placing a single cell on a 9×9 board', () => {
    let s = selectDie(
      {
        ...createInitialState(),
        phase: 'selectingShape',
        currentDice: [1, 1],
      },
      0
    );
    s = placeShape(s, { row: 8, col: 0 });
    const el = renderBoard(
      s.boards.player1,
      'player1',
      false,
      s,
      () => undefined,
      () => undefined,
      () => undefined
    );
    expect(el.querySelector('.fill-percent')?.textContent).toBe('1%');
  });
});
