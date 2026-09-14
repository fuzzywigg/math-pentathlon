/**
 * Wave 58 Contig/SD residual — Sum opening board skips second seed cell. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/sum-dominoes/rules';
import { CONFIG } from '../../src/games/sum-dominoes/types';
import { renderBoard } from '../../src/games/sum-dominoes/board-ui';

describe('Wave 58 sum — skip second cell', () => {
  it('opening board renders one sd-domino and 119 empty cells', () => {
    const state = createInitialState();
    const el = renderBoard(state, () => undefined);
    expect(el.querySelectorAll('.sd-domino').length).toBe(1);
    // 11x11 = 121 cells; horizontal seed occupies 2 → 119 empties rendered
    expect(el.querySelectorAll('.sd-cell').length).toBe(
      CONFIG.BOARD_SIZE * CONFIG.BOARD_SIZE - 2
    );
  });
});
