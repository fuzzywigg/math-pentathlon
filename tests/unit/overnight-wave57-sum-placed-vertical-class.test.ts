/**
 * Wave 57 leftover after #267 — Sum placed vertical domino class. Tests-only.
 * Distinct from wave51 horizontal seed.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/sum-dominoes/rules';
import { CONFIG } from '../../src/games/sum-dominoes/types';
import { renderBoard } from '../../src/games/sum-dominoes/board-ui';

describe('Wave 57 sum — placed vertical class', () => {
  it('vertical placement renders sd-domino-vertical + divider', () => {
    const base = createInitialState();
    const board = base.board.map((row) => row.map(() => null));
    board[CONFIG.CENTER_ROW][CONFIG.CENTER_COL] = {
      domino: {
        id: 'v-seed',
        face1: 3,
        face2: 4,
        owner: null,
        orientation: 'vertical',
      },
      position: { row: CONFIG.CENTER_ROW, col: CONFIG.CENTER_COL },
      orientation: 'vertical',
    };
    const el = renderBoard({ ...base, board }, () => undefined);
    const domino = el.querySelector('.sd-domino-vertical');
    expect(domino).toBeTruthy();
    expect(domino?.querySelector('.sd-domino-divider')).toBeTruthy();
  });
});
