/**
 * Wave 47 leftover after #214/#215 — Hex-a-Gone selectBlock / deselectBlock leftovers. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  type BlockShape,
} from '../../src/games/hex-a-gone/types';
import { selectBlock, deselectBlock } from '../../src/games/hex-a-gone/rules';

describe('Wave 47 hex-a-gone deepen 5 — hex-a-gone — select max-3 / duplicate / empty bank / deselect', () => {
  it('selectBlock accepts up to 3 distinct shapes then rejects fourth', () => {
    let state = createInitialState();
    state = selectBlock(state, 'hexagon');
    state = selectBlock(state, 'triangle');
    state = selectBlock(state, 'square');
    expect(state.turnSelection.blocks).toEqual([
      'hexagon',
      'triangle',
      'square',
    ]);
    const capped = selectBlock(state, 'rhombus');
    expect(capped).toBe(state);
    expect(capped.turnSelection.blocks).toHaveLength(3);
  });

  it('selectBlock rejects duplicate shape (identity)', () => {
    let state = createInitialState();
    state = selectBlock(state, 'trapezoid');
    const again = selectBlock(state, 'trapezoid');
    expect(again).toBe(state);
  });

  it('selectBlock rejects shape with empty bank count', () => {
    const state = {
      ...createInitialState(),
      bank: {
        ...createInitialState().bank,
        hexagon: 0,
      },
    };
    expect(selectBlock(state, 'hexagon')).toBe(state);
  });

  it('deselectBlock removes shape and clears selectedBlockForPlacement when matched', () => {
    let state = createInitialState();
    state = selectBlock(state, 'triangle');
    state = selectBlock(state, 'square');
    state = {
      ...state,
      selectedBlockForPlacement: 'triangle',
    };
    state = deselectBlock(state, 'triangle');
    expect(state.turnSelection.blocks).toEqual(['square']);
    expect(state.selectedBlockForPlacement).toBeNull();

    // Deselecting non-selected placement keeps selectedBlockForPlacement
    state = {
      ...state,
      selectedBlockForPlacement: 'square',
    };
    state = deselectBlock(state, 'square');
    expect(state.turnSelection.blocks).toEqual([]);
    expect(state.selectedBlockForPlacement).toBeNull();
  });

  it('deselectBlock identity when shape not in selection or wrong phase', () => {
    const open = createInitialState();
    expect(deselectBlock(open, 'hexagon' as BlockShape)).toBe(open);
    const placing = {
      ...open,
      phase: 'placeBlocks' as const,
      turnSelection: { blocks: ['hexagon' as BlockShape], committed: true },
    };
    expect(deselectBlock(placing, 'hexagon')).toBe(placing);
  });
});
