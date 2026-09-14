/**
 * Wave 58 Contig/SD residual — Sum vertical-only valid click. Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { createInitialState, getValidPlacements } from '../../src/games/sum-dominoes/rules';
import { CONFIG, getDiceSum } from '../../src/games/sum-dominoes/types';
import { renderBoard } from '../../src/games/sum-dominoes/board-ui';

describe('Wave 58 sum — vertical-only click', () => {
  it('callback gets vertical when only V is legal at cell', () => {
    const base = createInitialState();
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
    // Occupy horizontal neighbor slots so only vertical placements remain near seed
    const blocker = {
      id: 'block',
      face1: 0,
      face2: 0,
      owner: null,
      orientation: 'horizontal' as const,
    };
    const dice: [number, number] = [3, 4]; // sum 7 — 6+1
    const state = {
      ...base,
      board,
      hands: { ...base.hands, player1: [playable] },
      currentDice: dice,
      selectedDomino: playable.id,
      phase: 'placing' as const,
    };
    const placements = getValidPlacements(state, playable, getDiceSum(dice));
    const vertOnly = placements.filter((p) => {
      if (p.orientation !== 'vertical') return false;
      const hasH = placements.some(
        (q) =>
          q.position.row === p.position.row &&
          q.position.col === p.position.col &&
          q.orientation === 'horizontal'
      );
      return !hasH;
    });
    expect(vertOnly.length).toBeGreaterThan(0);
    const target = vertOnly[0]!;
    const onClick = vi.fn();
    const el = renderBoard(state, onClick);
    const cell = el.querySelector(
      `.sd-cell-valid[data-row="${target.position.row}"][data-col="${target.position.col}"]`
    ) as HTMLElement;
    cell.click();
    expect(onClick).toHaveBeenCalledWith(
      { row: target.position.row, col: target.position.col },
      'vertical'
    );
    void blocker;
  });
});
