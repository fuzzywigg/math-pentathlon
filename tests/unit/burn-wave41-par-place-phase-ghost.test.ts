/**
 * Wave 41 — Par 55 placeBlock phase / ghost identity leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  selectBlock,
  placeBlock,
  getValidPlacements,
  isValidPlacement,
} from '../../src/games/par-55/rules';
import type { Par55State } from '../../src/games/par-55/types';

describe('Wave 41 par — place phase / ghost', () => {
  it('placeBlock identity when phase is selectingBlock', () => {
    const state = createInitialState();
    const baseId = getValidPlacements(state)[0];
    expect(placeBlock(state, baseId)).toBe(state);
  });

  it('placeBlock identity when selectedBlock is null', () => {
    const state: Par55State = {
      ...createInitialState(),
      phase: 'placingBlock',
      selectedBlock: null,
    };
    const baseId = getValidPlacements(state)[0];
    expect(placeBlock(state, baseId)).toBe(state);
  });

  it('placeBlock identity for ghost selectedBlock not in hand', () => {
    const state: Par55State = {
      ...createInitialState(),
      phase: 'placingBlock',
      selectedBlock: 'ghost-not-in-hand',
    };
    const baseId = getValidPlacements(state)[0];
    expect(placeBlock(state, baseId)).toBe(state);
  });

  it('placeBlock identity for illegal base; success mutates board', () => {
    let state = createInitialState();
    const blockId = state.hands.player1[0].id;
    state = selectBlock(state, blockId);
    expect(placeBlock(state, 'base-99-99')).toBe(state);

    const occupied = [...state.bases.values()].find((b) => b.block)!;
    expect(isValidPlacement(state, occupied.id)).toBe(false);
    expect(placeBlock(state, occupied.id)).toBe(state);

    const valid = getValidPlacements(state)[0];
    const next = placeBlock(state, valid);
    expect(next).not.toBe(state);
    expect(next.bases.get(valid)?.block?.id).toBe(blockId);
    expect(next.selectedBlock).toBeNull();
    expect(next.moveHistory).toHaveLength(1);
  });
});
