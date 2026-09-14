/**
 * Wave 49 — Queens valid-move cells get green fill. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, cellKey } from '../../src/games/queens-guards/types';
import { getValidMoves } from '../../src/games/queens-guards/rules';
import { renderBoard } from '../../src/games/queens-guards/board-ui';

describe('Wave 49 queens — valid move fill', () => {
  it('highlights at least one valid destination', () => {
    const base = createInitialState();
    const from = { ring: 5, position: 7 };
    const moves = getValidMoves(base, from);
    expect(moves.length).toBeGreaterThan(0);
    const s = { ...base, selectedPiece: cellKey(5, 7) };
    const svg = renderBoard(s, () => {});
    const dest = moves[0]!;
    const g = svg.querySelector(`g[data-cell-key="${cellKey(dest.ring, dest.position)}"]`);
    expect(g?.querySelector('path')?.getAttribute('fill')).toBe('#4caf50');
  });
});
