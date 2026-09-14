/**
 * Wave 58 Contig/SD residual — Sum hand playable class on matching tile. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/sum-dominoes/rules';
import { CONFIG } from '../../src/games/sum-dominoes/types';
import { renderHand } from '../../src/games/sum-dominoes/board-ui';

describe('Wave 58 sum — hand playable class', () => {
  it('marks playable hand tile; leaves unplayable unmarked', () => {
    const base = createInitialState();
    const seed = {
      id: 'seed-66',
      face1: 6,
      face2: 6,
      owner: null,
      orientation: 'horizontal' as const,
    };
    const playable = {
      id: 'p-61',
      face1: 6,
      face2: 1,
      owner: 'player1' as const,
      orientation: 'horizontal' as const,
    };
    const unplayable = {
      id: 'u-00',
      face1: 0,
      face2: 0,
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
      hands: { player1: [playable, unplayable], player2: [] },
      currentDice: [3, 4] as [number, number],
      phase: 'placing' as const,
      selectedDomino: null,
    };
    const el = renderHand(state, 'player1', () => undefined);
    const tiles = [...el.querySelectorAll('.sd-hand-domino')];
    expect(tiles.some((t) => t.classList.contains('sd-hand-domino-playable'))).toBe(
      true
    );
    expect(tiles.some((t) => !t.classList.contains('sd-hand-domino-playable'))).toBe(
      true
    );
  });
});
