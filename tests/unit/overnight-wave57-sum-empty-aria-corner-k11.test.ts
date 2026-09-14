/**
 * Wave 57 leftover after #267 — Sum empty-cell K11 corner aria. Tests-only.
 * Distinct from wave56 A1 leftover.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/sum-dominoes/rules';
import { renderBoard } from '../../src/games/sum-dominoes/board-ui';

describe('Wave 57 sum — empty aria K11', () => {
  it('bottom-right empty cell uses K11, empty', () => {
    const el = renderBoard(createInitialState(), () => undefined);
    const cell = el.querySelector(
      '.sd-cell[data-row="10"][data-col="10"]'
    ) as HTMLElement;
    expect(cell.getAttribute('aria-label')).toBe('K11, empty');
  });
});
