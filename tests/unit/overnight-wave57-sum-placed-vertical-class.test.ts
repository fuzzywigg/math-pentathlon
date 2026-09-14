/**
 * Wave 57 leftover after #267 — Sum placed vertical domino class.
 * Distinct from wave51 horizontal seed leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/sum-dominoes/rules';
import { CONFIG } from '../../src/games/sum-dominoes/types';
import { renderBoard } from '../../src/games/sum-dominoes/board-ui';

describe('Wave 57 sum — placed vertical class', () => {
  it('renders .sd-domino-vertical for vertical placed domino', () => {
    const base = createInitialState();
    const board = base.board.map((row) => row.map(() => null));
    const seed = {
      id: 'seed-v',
      face1: 3,
      face2: 4,
      owner: null,
      orientation: 'vertical' as const,
    };
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
