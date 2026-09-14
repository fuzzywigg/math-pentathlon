/**
 * Wave 49 — Queens selected stroke leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/queens-guards/types';
import { selectPiece } from '../../src/games/queens-guards/rules';
import { renderBoard } from '../../src/games/queens-guards/board-ui';

describe('Wave 49 queens — selected stroke', () => {
  it('uses #ff9800 stroke width 3 on selected piece hex', () => {
    let state = createInitialState();
    state = selectPiece(state, { ring: 5, position: 7 });
    expect(state.selectedPiece).toBe('5-7');
    const svg = renderBoard(state, () => undefined);
    const g = svg.querySelector('[data-cell-key="5-7"]')!;
    const hex = g.querySelector('path')!;
    expect(hex.getAttribute('stroke')).toBe('#ff9800');
    expect(hex.getAttribute('stroke-width')).toBe('3');
  });
});
