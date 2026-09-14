/**
 * Overnight HEAVY leftover after #234 — Juggle preview-invalid OOB hover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, selectDie, selectShape } from '../../src/games/juggle/rules';
import { getShapesForDie, CONFIG } from '../../src/games/juggle/types';
import { renderBoard } from '../../src/games/juggle/board-ui';

describe('Wave 52 juggle — preview-invalid', () => {
  it('marks empty preview cells invalid when domino hangs off the board', () => {
    let s = selectDie(
      {
        ...createInitialState(),
        phase: 'selectingShape',
        currentDice: [2, 2],
      },
      0
    );
    const domino = getShapesForDie(2)[0];
    s = selectShape(s, domino);
    // Hover at last column so horizontal domino spills OOB
    const col = CONFIG.GRID_SIZE - 1;
    s = { ...s, hoverPosition: { row: 0, col } };
    const el = renderBoard(
      s.boards.player1,
      'player1',
      true,
      s,
      () => undefined,
      () => undefined,
      () => undefined
    );
    const edge = el.querySelector(`.juggle-cell[data-row="0"][data-col="${col}"]`);
    expect(edge?.classList.contains('preview-invalid')).toBe(true);
  });
});
