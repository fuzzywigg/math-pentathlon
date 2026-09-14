/**
 * Wave 57 leftover after #267 — Queens selected piece aria ends with selected.
 * Distinct from wave49 selected stroke leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/queens-guards/types';
import { selectPiece } from '../../src/games/queens-guards/rules';
import { renderBoard } from '../../src/games/queens-guards/board-ui';

describe('Wave 57 queens — selected aria extra', () => {
  it('appends selected to Blue Queen aria after selectPiece', () => {
    let state = createInitialState();
    state = selectPiece(state, { ring: 5, position: 7 });
    const svg = renderBoard(state, () => undefined);
    const g = svg.querySelector('[data-cell-key="5-7"]')!;
    expect(g.getAttribute('aria-label')).toBe(
      'ring 5 pos 7, Blue Queen, selected'
    );
  });
});
