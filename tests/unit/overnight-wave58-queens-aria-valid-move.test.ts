/**
 * Wave 58 leftover after #267 (unit-only; #277 closed RED e2e) — Queens valid-move destination aria.
 * Distinct from wave52 valid fill leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/queens-guards/types';
import { selectPiece, getValidMoves } from '../../src/games/queens-guards/rules';
import { renderBoard } from '../../src/games/queens-guards/board-ui';

describe('Wave 58 queens — valid move aria', () => {
  it('marks empty legal destination with valid move suffix', () => {
    let state = createInitialState();
    state = selectPiece(state, { ring: 5, position: 7 });
    const moves = getValidMoves(state, { ring: 5, position: 7 });
    expect(moves.length).toBeGreaterThan(0);
    const dest = moves[0]!;
    const svg = renderBoard(state, () => undefined);
    const g = svg.querySelector(
      `[data-cell-key="${dest.ring}-${dest.position}"]`
    )!;
    expect(g.getAttribute('aria-label')).toMatch(/valid move$/);
  });
});
