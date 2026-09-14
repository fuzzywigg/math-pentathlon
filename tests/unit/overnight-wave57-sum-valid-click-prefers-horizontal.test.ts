/**
 * Wave 57 leftover after #267 — Sum valid click prefers horizontal. Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { createInitialState, getValidPlacements } from '../../src/games/sum-dominoes/rules';
import { CONFIG, getDiceSum } from '../../src/games/sum-dominoes/types';
import { renderBoard } from '../../src/games/sum-dominoes/board-ui';

describe('Wave 57 sum — click prefers horizontal', () => {
  it('when both orients valid, callback gets horizontal', () => {
    const base = createInitialState();
    const dice: [number, number] = [3, 4];
    const seed = {
      id: 'seed-66',
      face1: 6,
      face2: 6,
      owner: null,
      orientation: 'horizontal' as const,
    };
    const playable = {
      id: 'force-61',
      face1: 6,
      face2: 1,
      owner: 'player1' as const,
      orientation: 'horizontal' as const,
    };
    const board = base.board.map((row) => row.map(() => null));
    board[CONFIG.CENTER_ROW][CONFIG.CENTER_COL] = {
      domino: seed,
      position: { row: CONFIG.CENTER_ROW, col: CONFIG.CENTER_COL },
      orientation: 'horizontal',
    };
    const state = {
      ...base,
      board,
      hands: { ...base.hands, player1: [playable] },
      currentDice: dice,
      selectedDomino: playable.id,
      phase: 'placing' as const,
    };
    const placements = getValidPlacements(state, playable, getDiceSum(dice));
    const both = placements.filter((p) => {
      const h = placements.some(
        (q) =>
          q.position.row === p.position.row &&
          q.position.col === p.position.col &&
          q.orientation === 'horizontal'
      );
      const v = placements.some(
        (q) =>
          q.position.row === p.position.row &&
          q.position.col === p.position.col &&
          q.orientation === 'vertical'
      );
      return h && v;
    });
    expect(both.length).toBeGreaterThan(0);
    const target = both[0]!;
    const onClick = vi.fn();
    const el = renderBoard(state, onClick);
    const cell = el.querySelector(
      `.sd-cell-valid[data-row="${target.position.row}"][data-col="${target.position.col}"]`
    ) as HTMLElement;
    cell.click();
    expect(onClick).toHaveBeenCalledWith(
      { row: target.position.row, col: target.position.col },
      'horizontal'
    );
  });
});
