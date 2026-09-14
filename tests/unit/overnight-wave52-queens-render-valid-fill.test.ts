/**
 * Wave 52 — Queens valid-move fill leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/queens-guards/types';
import { selectPiece, getValidMoves } from '../../src/games/queens-guards/rules';
import { renderBoard } from '../../src/games/queens-guards/board-ui';

describe('Wave 52 queens — valid fill', () => {
  it('uses #4caf50 fill and stroke-width 2 on valid hexes', () => {
    let state = createInitialState();
    state = selectPiece(state, { ring: 5, position: 7 });
    const moves = getValidMoves(state, { ring: 5, position: 7 });
    expect(moves.length).toBeGreaterThan(0);
    const key = `${moves[0]!.ring}-${moves[0]!.position}`;
    const svg = renderBoard(state, () => undefined);
    const hex = svg.querySelector(`[data-cell-key="${key}"] path`)!;
    expect(hex.getAttribute('fill')).toBe('#4caf50');
    expect(hex.getAttribute('stroke-width')).toBe('2');
  });
});
