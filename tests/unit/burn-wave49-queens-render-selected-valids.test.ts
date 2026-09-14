/**
 * Wave 49 leftover after #221/#226/#227 — Queens selected piece still renders cells. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/queens-guards/types';
import { renderBoard } from '../../src/games/queens-guards/board-ui';

describe('Wave 49 queens — selected piece render', () => {
  it('keeps cell count when a piece key is selected', () => {
    const base = createInitialState();
    const pieceKey = [...base.cells.entries()].find(([, c]) => c.piece)?.[0] ?? null;
    expect(pieceKey).toBeTruthy();
    const state = { ...base, selectedPiece: pieceKey };
    const svg = renderBoard(state, () => undefined);
    expect(svg.querySelectorAll('[data-cell-key]').length).toBe(state.cells.size);
  });
});
