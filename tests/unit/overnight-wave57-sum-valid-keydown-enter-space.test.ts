/**
 * Wave 57 leftover after #267 — Sum valid cell Enter/Space. Tests-only.
 * Mirrors wave53 contig keydown leftover for sum board.
 */
import { describe, it, expect, vi } from 'vitest';
import { createInitialState, getValidPlacements } from '../../src/games/sum-dominoes/rules';
import { CONFIG, getDiceSum } from '../../src/games/sum-dominoes/types';
import { renderBoard } from '../../src/games/sum-dominoes/board-ui';

describe('Wave 57 sum — valid keydown', () => {
  it('Enter and Space on a valid cell fire onCellClick', () => {
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
    const onClick = vi.fn();
    const el = renderBoard(state, onClick);
    const valid = el.querySelector('.sd-cell-valid') as HTMLElement;
    valid.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(onClick).toHaveBeenCalled();
    onClick.mockClear();
    valid.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    expect(onClick).toHaveBeenCalled();
  });
});
