/**
 * Wave 49 — Queens aria valid-move label leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, cellKey, CONFIG } from '../../src/games/queens-guards/types';
import { getValidMoves } from '../../src/games/queens-guards/rules';
import { renderBoard } from '../../src/games/queens-guards/board-ui';

describe('Wave 49 queens — aria valid', () => {
  it('marks valid destination aria as valid move', () => {
    const outer = CONFIG.NUM_RINGS - 1;
    const from = { ring: outer, position: 1 };
    const key = cellKey(from.ring, from.position);
    const base = createInitialState();
    const moves = getValidMoves(base, from);
    expect(moves.length).toBeGreaterThan(0);
    const s = { ...base, selectedPiece: key };
    const svg = renderBoard(s, () => undefined);
    const dest = cellKey(moves[0].ring, moves[0].position);
    const label = svg.querySelector(`[data-cell-key="${dest}"]`)?.getAttribute('aria-label') || '';
    expect(label.toLowerCase()).toMatch(/valid/);
  });
});
