/**
 * Wave 39 — handshake: align region stats → attr compare → score exact.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { getRegionStats, countMaxAligned } from '../../src/core/alignment';
import { compare, createMathPiece } from '../../src/core/attributes';
import {
  createScoringState,
  addPlayer,
  addScore,
  checkWinCondition,
} from '../../src/core/timer-scoring';

describe('Wave 39 handshake — align/attr/score', () => {
  it('region totalSize feeds exact win target', () => {
    const board = [
      ['X', 'X', null],
      [null, null, 'Y'],
      [null, null, null],
    ];
    const dims = { rows: 3, cols: 3 };
    const get = (r: number, c: number) => board[r]?.[c] ?? null;
    const stats = getRegionStats(dims, get);
    expect(stats.totalSize).toBe(3);

    let state = createScoringState({
      winCondition: { type: 'exact', value: stats.totalSize },
    });
    state = addPlayer(state, 'p1');
    state = addScore(state, 'p1', stats.totalSize);
    expect(checkWinCondition(state)).toBe('p1');
  });

  it('countMaxAligned length compared via attr compare', () => {
    const board = [
      ['A', 'A', 'A', null],
      [null, null, null, null],
    ];
    const get = (r: number, c: number) => board[r]?.[c] ?? null;
    const { count } = countMaxAligned(
      { row: 0, col: 1 },
      { rows: 2, cols: 4 },
      get
    );
    const piece = createMathPiece(count);
    expect(compare(piece.attributes.number as number, 'equals', 3)).toBe(true);
    expect(piece.attributes.isPrime).toBe(true);
  });
});
