/**
 * Wave 41 — Hex-a-Gone selectBlock / deselectBlock / commitSelection over/under.
 * Cap-3, duplicate, empty-commit, wrong-phase identity. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  type BlockShape,
  type HexAGoneGameState,
} from '../../src/games/hex-a-gone/types';
import {
  selectBlock,
  deselectBlock,
  commitSelection,
} from '../../src/games/hex-a-gone/rules';

const SHAPES: BlockShape[] = [
  'hexagon',
  'trapezoid',
  'rhombus',
  'triangle',
  'square',
];

describe('Wave 41 hex-a-gone — select over/under', () => {
  it('commitSelection under-select (empty) is identity', () => {
    const state = createInitialState();
    expect(commitSelection(state)).toBe(state);
  });

  it('selectBlock over-cap rejects fourth distinct shape', () => {
    let state = createInitialState();
    state = selectBlock(state, 'hexagon');
    state = selectBlock(state, 'triangle');
    state = selectBlock(state, 'square');
    expect(state.turnSelection.blocks).toHaveLength(3);
    const before = state;
    expect(selectBlock(state, 'rhombus')).toBe(before);
  });

  it('duplicate select and empty-bank are identity', () => {
    let state = selectBlock(createInitialState(), 'triangle');
    expect(selectBlock(state, 'triangle')).toBe(state);

    const emptyBank: HexAGoneGameState = {
      ...createInitialState(),
      bank: {
        hexagon: 0,
        trapezoid: 0,
        rhombus: 0,
        triangle: 0,
        square: 0,
      },
    };
    for (const shape of SHAPES) {
      expect(selectBlock(emptyBank, shape)).toBe(emptyBank);
    }
  });

  it('deselect missing shape / wrong phase / committed are identity', () => {
    const opening = createInitialState();
    expect(deselectBlock(opening, 'triangle')).toBe(opening);

    let state = selectBlock(createInitialState(), 'hexagon');
    state = commitSelection(state);
    expect(state.phase).toBe('placeBlocks');
    expect(deselectBlock(state, 'hexagon')).toBe(state);
    expect(selectBlock(state, 'triangle')).toBe(state);
    expect(commitSelection(state)).toBe(state);
  });

  it('deselect removes shape; commit after single select advances', () => {
    let state = selectBlock(createInitialState(), 'rhombus');
    state = selectBlock(state, 'square');
    state = deselectBlock(state, 'rhombus');
    expect(state.turnSelection.blocks).toEqual(['square']);
    state = commitSelection(state);
    expect(state.phase).toBe('placeBlocks');
    expect(state.selectedBlockForPlacement).toBe('square');
    expect(state.turnSelection.committed).toBe(true);
  });
});
