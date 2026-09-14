/**
 * Overnight HEAVY leftover after #234 — Juggle preview-valid hover chrome. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, selectDie } from '../../src/games/juggle/rules';
import { renderBoard } from '../../src/games/juggle/board-ui';

describe('Wave 52 juggle — preview-valid', () => {
  it('marks monomino hover cell as preview-valid on empty board', () => {
    const placing = selectDie(
      {
        ...createInitialState(),
        phase: 'selectingShape',
        currentDice: [1, 1],
      },
      0
    );
    const s = { ...placing, hoverPosition: { row: 2, col: 3 } };
    const el = renderBoard(
      s.boards.player1,
      'player1',
      true,
      s,
      () => undefined,
      () => undefined,
      () => undefined
    );
    const cell = el.querySelector('.juggle-cell[data-row="2"][data-col="3"]');
    expect(cell?.classList.contains('preview-valid')).toBe(true);
  });
});
