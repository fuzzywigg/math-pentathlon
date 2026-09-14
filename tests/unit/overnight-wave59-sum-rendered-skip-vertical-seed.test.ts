/**
 * Wave 59 Contig/SD residual — Sum vertical seed skips second cell. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/sum-dominoes/rules';
import { CONFIG } from '../../src/games/sum-dominoes/types';
import { renderBoard } from '../../src/games/sum-dominoes/board-ui';

describe('Wave 59 sum — vertical seed skip', () => {
  it('vertical center seed yields one vertical domino and 119 empties', () => {
    const base = createInitialState();
    const board = base.board.map((row) => row.map(() => null));
    const placed = {
      domino: {
        id: 'seed-v',
        face1: 6,
        face2: 6,
        owner: null,
        orientation: 'vertical' as const,
      },
      position: { row: CONFIG.CENTER_ROW, col: CONFIG.CENTER_COL },
      orientation: 'vertical' as const,
    };
    board[CONFIG.CENTER_ROW][CONFIG.CENTER_COL] = placed;
    board[CONFIG.CENTER_ROW + 1][CONFIG.CENTER_COL] = placed;
    const el = renderBoard({ ...base, board }, () => undefined);
    expect(el.querySelectorAll('.sd-domino-vertical').length).toBe(1);
    expect(el.querySelectorAll('.sd-cell').length).toBe(
      CONFIG.BOARD_SIZE * CONFIG.BOARD_SIZE - 2
    );
  });
});
