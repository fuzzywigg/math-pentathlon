/**
 * Wave 64 leftover after tip/#301 + open #303 wave63 — Juggle occupied C1 aria exact.
 * Soft owner match in wave55; lock C1, Blue. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  placeShape,
  selectDie,
} from '../../src/games/juggle/rules';
import { renderBoard } from '../../src/games/juggle/board-ui';

describe('Wave 64 juggle — occupied C1 aria exact', () => {
  it('locks C1, Blue on monomino at col 2', () => {
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
    expect(
      el
        .querySelector('.juggle-cell[data-row="0"][data-col="2"]')
        ?.getAttribute('aria-label')
    ).toBe('C1, Blue');
  });
});
