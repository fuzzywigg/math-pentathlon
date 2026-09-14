/**
 * Wave 59 Contig/SD residual — Sum hand selected class. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/sum-dominoes/rules';
import { CONFIG } from '../../src/games/sum-dominoes/types';
import { renderHand } from '../../src/games/sum-dominoes/board-ui';

describe('Wave 59 sum — hand selected class', () => {
  it('marks selected domino with selected class', () => {
    const base = createInitialState();
    const playable = {
      id: 'p-61',
      face1: 6,
      face2: 1,
      owner: 'player1' as const,
      orientation: 'horizontal' as const,
    };
    const board = base.board.map((row) => row.map(() => null));
    board[CONFIG.CENTER_ROW][CONFIG.CENTER_COL] = {
      domino: {
        id: 'seed',
        face1: 6,
        face2: 6,
        owner: null,
        orientation: 'horizontal',
      },
      position: { row: CONFIG.CENTER_ROW, col: CONFIG.CENTER_COL },
      orientation: 'horizontal',
    };
    const state = {
      ...base,
      board,
      hands: { player1: [playable], player2: [] },
      currentDice: [3, 4] as [number, number],
      phase: 'placing' as const,
      selectedDomino: playable.id,
    };
    const el = renderHand(state, 'player1', () => undefined);
    expect(
      el.querySelector('.sd-hand-domino')?.classList.contains(
        'sd-hand-domino-selected'
      )
    ).toBe(true);
  });
});
