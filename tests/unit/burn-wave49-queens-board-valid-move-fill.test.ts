/**
 * Wave 49 — Queens valid-move green fill leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, cellKey, CONFIG } from '../../src/games/queens-guards/types';
import { getValidMoves } from '../../src/games/queens-guards/rules';
import { renderBoard } from '../../src/games/queens-guards/board-ui';

describe('Wave 49 queens — valid move fill', () => {
  it('paints valid destinations green when piece selected', () => {
    const outer = CONFIG.NUM_RINGS - 1;
    const from = { ring: outer, position: 1 };
    const key = cellKey(from.ring, from.position);
    const base = createInitialState();
    expect(base.cells.get(key)?.piece?.type).toBe('guard');
    const moves = getValidMoves(base, from);
    expect(moves.length).toBeGreaterThan(0);
    const s = { ...base, selectedPiece: key };
    const svg = renderBoard(s, () => undefined);
    const dest = cellKey(moves[0].ring, moves[0].position);
    const hex = svg.querySelector(`[data-cell-key="${dest}"] path`)!;
    expect(hex.getAttribute('fill')).toBe('#4caf50');
    expect(hex.getAttribute('stroke-width')).toBe('2');
  });
});
