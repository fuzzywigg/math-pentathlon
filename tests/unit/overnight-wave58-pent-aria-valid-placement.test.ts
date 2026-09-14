/**
 * Wave 58 leftover after #267 — Pent valid-placement aria after select.
 * Distinct from wave56 Blue occupied leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/pent-em-in/types';
import { selectPiece } from '../../src/games/pent-em-in/rules';
import { renderBoard } from '../../src/games/pent-em-in/board-ui';

describe('Wave 58 pent — valid placement aria', () => {
  it('empty cell announces valid placement in placePiece phase', () => {
    const state = selectPiece(createInitialState(), 'I5');
    expect(state.phase).toBe('placePiece');
    const svg = renderBoard(state, () => undefined, () => undefined);
    const cell = svg.querySelector('.interaction [data-row="0"][data-col="0"]')!;
    expect(cell.getAttribute('aria-label')).toBe('0,0, empty, valid placement');
  });
});
