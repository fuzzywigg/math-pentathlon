/**
 * Wave 42 leftovers D — Hex-a-Gone select committed reject. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import {
  selectBlock,
  deselectBlock,
  commitSelection,
} from '../../src/games/hex-a-gone/rules';

describe('Wave 42 D hexagone — selectBlock committed / wrong-phase reject', () => {
  it('selectBlock and deselectBlock are identity when committed', () => {
    let state = createInitialState();
    state = selectBlock(state, 'triangle');
    state = commitSelection(state);
    expect(state.turnSelection.committed).toBe(true);
    expect(selectBlock(state, 'hexagon')).toBe(state);
    expect(deselectBlock(state, 'triangle')).toBe(state);
  });

  it('selectBlock identity when phase is placeBlocks or gameOver', () => {
    const placing = {
      ...createInitialState(),
      phase: 'placeBlocks' as const,
      turnSelection: { blocks: ['triangle' as const], committed: true },
    };
    expect(selectBlock(placing, 'hexagon')).toBe(placing);

    const over = {
      ...createInitialState(),
      phase: 'gameOver' as const,
      winner: 'player1' as const,
    };
    expect(selectBlock(over, 'triangle')).toBe(over);
  });
});
