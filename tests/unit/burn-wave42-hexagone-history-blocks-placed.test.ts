/**
 * Wave 42 leftovers D — Hex-a-Gone history blocks placed. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import {
  selectBlock,
  commitSelection,
  placeBlock,
  getValidPlacements,
} from '../../src/games/hex-a-gone/rules';

describe('Wave 42 hexagone — moveHistory.blocksPlaced at turnComplete', () => {
  it('single-block turn records full selection', () => {
    let state = createInitialState();
    state = selectBlock(state, 'hexagon');
    state = commitSelection(state);
    const spot = getValidPlacements(state)[0];
    state = placeBlock(state, spot.q, spot.r);
    expect(state.moveHistory).toHaveLength(1);
    expect(state.moveHistory[0].blocksPlaced).toEqual(['hexagon']);
  });

  it('multi-block turn records selection present at final place (last remaining only)', () => {
    // Verified: placeBlock filters turnSelection.blocks after each place.
    // At turnComplete, state.turnSelection.blocks is already only the last piece.
    let state = createInitialState();
    state = selectBlock(state, 'triangle');
    state = selectBlock(state, 'square');
    state = commitSelection(state);

    const a = getValidPlacements(state)[0];
    state = placeBlock(state, a.q, a.r);
    expect(state.turnSelection.blocks).toEqual(['square']);

    const b = getValidPlacements(state)[0];
    state = placeBlock(state, b.q, b.r);

    expect(state.moveHistory).toHaveLength(1);
    // Input state's turnSelection.blocks at final place is ['square'] only
    expect(state.moveHistory[0].blocksPlaced).toEqual(['square']);
    expect(state.placedBlocks.map((p) => p.shape)).toEqual([
      'triangle',
      'square',
    ]);
  });
});
