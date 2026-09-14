/**
 * Wave 45 TOKENMAXX — Queens getAIMove restore null when outer full. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  cellKey,
  CONFIG,
  cellsInRing,
} from '../../src/games/queens-guards/types';
import { getAIMove } from '../../src/games/queens-guards/ai';

describe('Wave 45 queens — restore outer full', () => {
  it('getAIMove null when capturedPieces set but outer ring saturated', () => {
    const base = createInitialState();
    const outer = CONFIG.NUM_RINGS - 1;
    const cells = new Map(base.cells);
    for (let pos = 0; pos < cellsInRing(outer); pos++) {
      const key = cellKey(outer, pos);
      const cell = cells.get(key)!;
      if (!cell.piece) {
        cells.set(key, {
          ...cell,
          piece: { id: `fill-${pos}`, player: 'player1', type: 'guard' },
        });
      }
    }
    const state = {
      ...base,
      cells,
      capturedPieces: [{ ring: 3, position: 0 }],
    };
    expect(getAIMove(state, 'player1', 'medium')).toBeNull();
  });
});
