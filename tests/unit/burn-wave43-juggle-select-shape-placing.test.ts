/**
 * Wave 43 — Juggle selectShape multi-option → placing leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { TETROMINOES } from '../../src/core/polyomino/types';
import {
  createInitialState,
  selectDie,
  selectShape,
  isPlacementValid,
  placeShape,
} from '../../src/games/juggle/rules';

describe('Wave 43 juggle — selectShape placing path', () => {
  it('die4 keeps selectingShape until shape chosen then places', () => {
    const selecting = {
      ...createInitialState(),
      phase: 'selectingShape' as const,
      currentDice: [4, 4] as [number, number],
    };
    const mid = selectDie(selecting, 0);
    expect(mid.phase).toBe('selectingShape');
    expect(mid.selectedCategory).toBe('tetromino');
    const shape = TETROMINOES[0];
    const placing = selectShape(mid, shape);
    expect(placing.phase).toBe('placing');
    expect(placing.selectedShape?.id).toBe(shape.id);
    expect(isPlacementValid(placing, { row: 0, col: 0 })).toBe(true);
    const next = placeShape(placing, { row: 0, col: 0 });
    expect(next.currentPlayer).toBe('player2');
    expect(next.phase).toBe('rolling');
  });
});
