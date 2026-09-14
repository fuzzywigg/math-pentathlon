/**
 * Wave 57 leftover after #267 — Pent empty opening cell aria.
 * Distinct from wave56 occupied Blue aria leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/pent-em-in/types';
import { renderBoard } from '../../src/games/pent-em-in/board-ui';

describe('Wave 57 pent — empty opening aria', () => {
  it('announces 0,0, empty on opening interaction cell', () => {
    const svg = renderBoard(createInitialState(), () => undefined, () => undefined);
    const cell = svg.querySelector(
      '.interaction [data-row="0"][data-col="0"]'
    )!;
    expect(cell.getAttribute('aria-label')).toBe('0,0, empty');
  });
});
