/**
 * Wave 57 leftover after #267 — Sum Space activates valid placement cell.
 * Distinct from wave56 valid aria leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, getValidPlacements } from '../../src/games/sum-dominoes/rules';
import { CONFIG, getDiceSum } from '../../src/games/sum-dominoes/types';
import { renderBoard } from '../../src/games/sum-dominoes/board-ui';

describe('Wave 57 sum — keydown Space valid', () => {
  it('Space on .sd-cell-valid fires onCellClick', () => {
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
    expect(
      getValidPlacements(state, playable, getDiceSum(dice)).length
    ).toBeGreaterThan(0);

    let clicked: { row: number; col: number } | null = null;
    const el = renderBoard(state, (pos) => {
      clicked = pos;
    });
    const valid = el.querySelector('.sd-cell-valid')!;
    valid.dispatchEvent(
      new KeyboardEvent('keydown', { key: ' ', bubbles: true })
    );
    expect(clicked).not.toBeNull();
    expect(typeof clicked!.row).toBe('number');
    expect(typeof clicked!.col).toBe('number');
  });
});
