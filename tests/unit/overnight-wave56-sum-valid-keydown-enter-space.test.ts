/**
 * Wave 56 leftover after #243 — Sum Dominoes valid keydown residual.
 * Contig covered in wave53; SD was not. Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { createInitialState, getValidPlacements } from '../../src/games/sum-dominoes/rules';
import { CONFIG, getDiceSum } from '../../src/games/sum-dominoes/types';
import { renderBoard } from '../../src/games/sum-dominoes/board-ui';

function forgePlayable() {
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
  expect(getValidPlacements(state, playable, getDiceSum(dice)).length).toBeGreaterThan(0);
  return state;
}

describe('Wave 56 sum — valid keydown', () => {
  it('activates .sd-cell-valid on Enter and Space', () => {
    const onClick = vi.fn();
    const el = renderBoard(forgePlayable(), onClick);
    const cell = el.querySelector('.sd-cell-valid') as HTMLElement;
    cell.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    cell.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    expect(onClick).toHaveBeenCalledTimes(2);
  });
});
