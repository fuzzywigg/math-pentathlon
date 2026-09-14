/**
 * Wave 55 leftover after #250 — Par 55 opening zero valids + viewBox from CONFIG. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/par-55/rules';
import { renderBoard } from '../../src/games/par-55/board-ui';
import { CONFIG } from '../../src/games/par-55/types';

describe('Wave 55 par55 — opening board chrome', () => {
  it('no valid bases while selecting; viewBox matches formula', () => {
    const el = renderBoard(createInitialState(), () => undefined);
    expect(el.querySelectorAll('.par55-valid-base')).toHaveLength(0);
    const w = CONFIG.BOARD_COLS * 50 * 1.2 + 50;
    const h = CONFIG.BOARD_ROWS * 50 * 0.9 + 50;
    expect(el.querySelector('svg')?.getAttribute('viewBox')).toBe(`0 0 ${w} ${h}`);
  });
});
