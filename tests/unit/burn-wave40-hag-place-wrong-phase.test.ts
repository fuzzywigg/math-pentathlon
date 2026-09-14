/**
 * Wave 40 — Hex-a-Gone placeBlock / deselect / commit empty / placement select.
 * Tests-only leftover after #178.
 */
import { describe, it, expect } from 'vitest';

import {
  selectBlock,
  deselectBlock,
  commitSelection,
  placeBlock,
  selectBlockForPlacement,
} from '../../src/games/hex-a-gone/rules';
import { createInitialState } from '../../src/games/hex-a-gone/types';

describe('Wave 40 hex-a-gone — place / deselect gates', () => {
  it('placeBlock wrong phase or missing selection → identity', () => {
    const state = createInitialState();
    expect(placeBlock(state, 0, 0)).toBe(state);

    const placingEmpty = {
      ...state,
      phase: 'placeBlocks' as const,
      selectedBlockForPlacement: null,
    };
    expect(placeBlock(placingEmpty, 0, 0)).toBe(placingEmpty);
  });

  it('commitSelection with empty blocks → identity', () => {
    const state = createInitialState();
    expect(commitSelection(state)).toBe(state);
  });

  it('deselectBlock clears selectedBlockForPlacement when that shape removed', () => {
    let state = createInitialState();
    state = selectBlock(state, 'hexagon');
    state = selectBlock(state, 'triangle');
    const withPlacement = {
      ...state,
      selectedBlockForPlacement: 'hexagon' as const,
    };
    const next = deselectBlock(withPlacement, 'hexagon');
    expect(next.selectedBlockForPlacement).toBeNull();
    expect(next.turnSelection.blocks).toEqual(['triangle']);
  });

  it('selectBlockForPlacement wrong phase / not in selection → identity', () => {
    const state = createInitialState();
    expect(selectBlockForPlacement(state, 'hexagon')).toBe(state);

    let selected = selectBlock(state, 'rhombus');
    selected = commitSelection(selected);
    expect(selectBlockForPlacement(selected, 'square')).toBe(selected);
  });
});
