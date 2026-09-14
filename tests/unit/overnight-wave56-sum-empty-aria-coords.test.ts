/**
 * Wave 56 leftover after #256 — Sum Dominoes empty-cell A1-style aria coords.
 * Distinct from wave51 .sd-cell-valid class leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/sum-dominoes/rules';
import { renderBoard } from '../../src/games/sum-dominoes/board-ui';

describe('Wave 56 sum — empty aria coords', () => {
  it('opening empty cell uses letter-row coord + empty', () => {
    const el = renderBoard(createInitialState(), () => undefined);
    const cell = el.querySelector(
      '.sd-cell[data-row="0"][data-col="0"]'
    ) as HTMLElement;
    expect(cell.getAttribute('aria-label')).toBe('A1, empty');
  });
});
