/**
 * Overnight TOKENMAXX HEAVY — queens-guards restore null when outer full leftovers after #202.
 * Tests-only. Distinct from demos (#202) and wave43/44 Contig/SD/Star/Fab drafts.
 * No product inventing.
 */

import { describe, it, expect } from 'vitest';
import { getAIMove } from '../../src/games/queens-guards/ai';
import { createInitialState, cellKey, cellsInRing, CONFIG, type QueensGuardsState } from '../../src/games/queens-guards/types';

describe('Overnight queens — restore null when outer full', () => {
  it('getAIMove returns null when captured pending but outer ring packed', () => {
    const state = createInitialState();
    const captured = { ring: 2, position: 1 };
    const cells = new Map(state.cells);
    cells.set(cellKey(captured.ring, captured.position), {
      ...cells.get(cellKey(captured.ring, captured.position))!,
      piece: { id: 'cap2', player: 'player1', type: 'guard' },
    });
    const outer = CONFIG.NUM_RINGS - 1;
    const outerCount = cellsInRing(outer);
    for (let pos = 0; pos < outerCount; pos++) {
      const key = cellKey(outer, pos);
      if (!cells.get(key)?.piece) {
        cells.set(key, {
          ...cells.get(key)!,
          piece: { id: `fill-${pos}`, player: 'player2', type: 'guard' },
        });
      }
    }
    const jammed: QueensGuardsState = { ...state, cells, capturedPieces: [captured] };
    expect(getAIMove(jammed, 'player1', 'hard')).toBeNull();
  });
});
