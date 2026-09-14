/**
 * Wave 56 leftover after #243 — Sum Dominoes vertical placed class residual.
 * Horizontal seed covered in wave51; vertical was not. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/sum-dominoes/rules';
import { CONFIG } from '../../src/games/sum-dominoes/types';
import { renderBoard } from '../../src/games/sum-dominoes/board-ui';

describe('Wave 56 sum — placed vertical class', () => {
  it('mounts .sd-domino-vertical for a vertical center seed', () => {
    const base = createInitialState();
    const seed = {
      id: 'seed-33v',
      face1: 3,
      face2: 3,
      owner: null,
      orientation: 'vertical' as const,
    };
    const board = base.board.map((row) => row.map(() => null));
    board[CONFIG.CENTER_ROW][CONFIG.CENTER_COL] = {
      domino: seed,
      position: { row: CONFIG.CENTER_ROW, col: CONFIG.CENTER_COL },
      orientation: 'vertical',
    };
    const el = renderBoard({ ...base, board }, () => undefined);
    expect(el.querySelector('.sd-domino-vertical')).toBeTruthy();
    expect(el.querySelector('.sd-domino-horizontal')).toBeNull();
  });
});
