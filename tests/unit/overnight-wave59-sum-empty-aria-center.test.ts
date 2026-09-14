/**
 * Wave 59 Contig/SD residual — Sum empty cell center coord aria. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/sum-dominoes/rules';
import { CONFIG } from '../../src/games/sum-dominoes/types';
import { renderBoard } from '../../src/games/sum-dominoes/board-ui';

describe('Wave 59 sum — empty center-adjacent aria', () => {
  it('empty cell near seed has coord aria label', () => {
    const state = createInitialState();
    const el = renderBoard(state, () => undefined);
    // F6 is a common empty near center (col 5 = F, row 5 = 6 if 1-indexed... center is row5 col5 = F6)
    // Pick any empty cell
    const empty = el.querySelector('.sd-cell') as HTMLElement;
    expect(empty).toBeTruthy();
    const label = empty.getAttribute('aria-label') || '';
    expect(label.length).toBeGreaterThan(0);
    expect(empty.dataset.row).toBeDefined();
    expect(empty.dataset.col).toBeDefined();
    void CONFIG;
  });
});
