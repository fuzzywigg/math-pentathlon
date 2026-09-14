/**
 * Wave 58 leftover after #267 — Queens selected piece aria extras.
 * Distinct from wave56 opening queen leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/queens-guards/types';
import { selectPiece } from '../../src/games/queens-guards/rules';
import { renderBoard } from '../../src/games/queens-guards/board-ui';

describe('Wave 58 queens — selected aria', () => {
  it('appends selected to Blue Queen aria after selectPiece', () => {
    const state = selectPiece(createInitialState(), { ring: 5, position: 7 });
    const svg = renderBoard(state, () => undefined);
    expect(svg.querySelector('[data-cell-key="5-7"]')?.getAttribute('aria-label')).toBe(
      'ring 5 pos 7, Blue Queen, selected'
    );
  });
});
