/**
 * Wave 57 leftover after #267 — Pent valid-placement aria while placing.
 * Distinct from wave56 occupied Blue leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/pent-em-in/types';
import { renderBoard } from '../../src/games/pent-em-in/board-ui';

describe('Wave 57 pent — valid placement aria', () => {
  it('empty cell aria ends with valid placement when piece selected', () => {
    const state = {
      ...createInitialState(),
      phase: 'placePiece' as const,
      selectedPiece: 'I5',
    };
    const svg = renderBoard(state, () => undefined, () => undefined);
    const cell = svg.querySelector(
      '.interaction [data-row="0"][data-col="0"]'
    )!;
    expect(cell.getAttribute('aria-label')).toBe('0,0, empty, valid placement');
  });
});
