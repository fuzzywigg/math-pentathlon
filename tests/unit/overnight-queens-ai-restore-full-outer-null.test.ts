/**
 * Overnight HEAVY — Queens AI restore null when outer ring is full.
 * Wave42 covers restore-with-slot; this is the full-outer deny path.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getAIMove } from '../../src/games/queens-guards/ai';
import {
  createInitialState,
  cellKey,
  cellsInRing,
  CONFIG,
  type QueensGuardsState,
} from '../../src/games/queens-guards/types';

describe('Overnight queens — restore full-outer null', () => {
  it('getAIMove returns null when captured pending but outer ring full', () => {
    const base = createInitialState();
    const cells = new Map(base.cells);
    // Clear all pieces first
    for (const [key, cell] of cells) {
      cells.set(key, { ...cell, piece: null });
    }
    const outerRing = CONFIG.NUM_RINGS - 1;
    const outerCount = cellsInRing(outerRing);
    for (let pos = 0; pos < outerCount; pos++) {
      cells.set(cellKey(outerRing, pos), {
        ...cells.get(cellKey(outerRing, pos))!,
        piece: {
          id: `fill-${pos}`,
          player: pos % 2 === 0 ? 'player1' : 'player2',
          type: 'guard',
        },
      });
    }
    const captured = { ring: 2, position: 0 };
    const state: QueensGuardsState = {
      ...base,
      cells,
      currentPlayer: 'player1',
      capturedPieces: [captured],
      winner: null,
    };
    expect(getAIMove(state, 'player1', 'hard')).toBeNull();
    expect(getAIMove(state, 'player1', 'easy')).toBeNull();
  });
});
