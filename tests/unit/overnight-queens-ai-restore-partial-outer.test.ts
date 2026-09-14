/**
 * Overnight HEAVY after #210 — Queens restore picks first empty after partial outer fill.
 * #210 only covered full-outer → null.
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

describe('Overnight queens — restore partial outer', () => {
  it('restore to.position is first empty after early outer slots filled', () => {
    const base = createInitialState();
    const cells = new Map(base.cells);
    for (const [key, cell] of cells) {
      cells.set(key, { ...cell, piece: null });
    }
    const outerRing = CONFIG.NUM_RINGS - 1;
    const outerCount = cellsInRing(outerRing);
    const fillUntil = 3;
    expect(fillUntil).toBeLessThan(outerCount);

    for (let pos = 0; pos < fillUntil; pos++) {
      cells.set(cellKey(outerRing, pos), {
        ...cells.get(cellKey(outerRing, pos))!,
        piece: {
          id: `fill-${pos}`,
          player: 'player2',
          type: 'guard',
        },
      });
    }

    const captured = { ring: 2, position: 1 };
    const state: QueensGuardsState = {
      ...base,
      cells,
      currentPlayer: 'player1',
      capturedPieces: [captured],
      winner: null,
    };

    const move = getAIMove(state, 'player1', 'hard');
    expect(move).not.toBeNull();
    expect(move!.from).toEqual(captured);
    expect(move!.to).toEqual({ ring: outerRing, position: fillUntil });
  });
});
