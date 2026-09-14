/**
 * Wave 45 TOKENMAXX — Par-55 placeBlock missing-base identity. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  selectBlock,
  placeBlock,
  isValidPlacement,
} from '../../src/games/par-55/rules';

describe('Wave 45 par55 — place missing base', () => {
  it('identity when selected but base map entry deleted', () => {
    const open = createInitialState();
    const blockId = open.hands.player1[0].id;
    let selected = selectBlock(open, blockId);
    const baseId = [...selected.bases.keys()][0];
    // Force validity path then delete base
    // pick a valid placement if any
    const bases = [...selected.bases.keys()];
    let target = bases.find((id) => isValidPlacement(selected, id)) ?? bases[0];
    selected = selectBlock(open, blockId);
    const forged = {
      ...selected,
      bases: new Map(selected.bases),
    };
    forged.bases.delete(target);
    // isValidPlacement may already reject; if it somehow passes, placeBlock still noops
    const next = placeBlock(forged, target);
    expect(next.hands.player1.length).toBe(forged.hands.player1.length);
  });
});
