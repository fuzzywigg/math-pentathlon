/**
 * Overnight TOKENMAXX HEAVY — queens-guards select toggle deselect leftovers after #202.
 * Tests-only. Distinct from demos (#202) and wave43/44 Contig/SD/Star/Fab drafts.
 * No product inventing.
 */
import { describe, it, expect } from 'vitest';
import { selectPiece, getValidMoves } from '../../src/games/queens-guards/rules';
import { createInitialState, cellKey } from '../../src/games/queens-guards/types';

describe('Overnight queens — select toggle deselect', () => {
  it('selecting the same piece twice clears selection key', () => {
    const state = createInitialState();
    const coord = { ring: 5, position: 1 };
    expect(getValidMoves(state, coord).length).toBeGreaterThan(0);
    const key = cellKey(coord.ring, coord.position);
    const once = selectPiece(state, coord);
    expect(once.selectedPiece).toBe(key);
    const twice = selectPiece(once, coord);
    expect(twice.selectedPiece).toBeNull();
  });
});
