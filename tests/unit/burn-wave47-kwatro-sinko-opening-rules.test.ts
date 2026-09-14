/**
 * Wave 47 leftover after #214/#215 — Kwatro-Sinko opening rules leftovers. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  selectChip,
  clearSelection,
  getValidMoves,
  hasValidMoves,
} from '../../src/games/kwatro-sinko/rules';
import { PLAYER_CHIPS } from '../../src/games/kwatro-sinko/types';

describe('Wave 47 kwatro deepen 9 — kwatro — opening createInitialState / select / clear', () => {
  it('createInitialState seats p1/p2 chips on numbered rows with selectingChip', () => {
    const state = createInitialState();
    expect(state.phase).toBe('selectingChip');
    expect(state.currentPlayer).toBe('player1');
    expect(state.selectedChip).toBeNull();
    expect(state.winner).toBeNull();
    expect(state.moveHistory).toEqual([]);
    expect(state.chips.size).toBe(
      PLAYER_CHIPS.player1.length + PLAYER_CHIPS.player2.length
    );

    PLAYER_CHIPS.player1.forEach((value, index) => {
      const chip = state.chips.get(`p1-${index}`);
      expect(chip?.value).toBe(value);
      expect(chip?.position).toBe(`n0-${index}`);
      expect(state.nodes.get(`n0-${index}`)?.chip?.id).toBe(`p1-${index}`);
      expect(state.nodes.get(`n0-${index}`)?.isNumbered).toBe(true);
    });

    PLAYER_CHIPS.player2.forEach((value, index) => {
      const chip = state.chips.get(`p2-${index}`);
      expect(chip?.value).toBe(value);
      expect(chip?.position).toBe(`n4-${index}`);
    });
  });

  it('selectChip accepts own movable chip and clearSelection restores selectingChip', () => {
    let state = createInitialState();
    expect(hasValidMoves(state)).toBe(true);
    const chip = [...state.chips.values()].find((c) => c.owner === 'player1')!;
    const moves = getValidMoves(state, chip.id);
    expect(moves.length).toBeGreaterThan(0);

    state = selectChip(state, chip.id);
    expect(state.selectedChip).toBe(chip.id);
    expect(state.phase).toBe('selectingDest');

    state = clearSelection(state);
    expect(state.selectedChip).toBeNull();
    expect(state.phase).toBe('selectingChip');
  });

  it('selectChip rejects opponent chip and unknown id (identity)', () => {
    const state = createInitialState();
    const opp = [...state.chips.values()].find((c) => c.owner === 'player2')!;
    expect(selectChip(state, opp.id)).toBe(state);
    expect(selectChip(state, 'missing-chip')).toBe(state);
  });

  it('getValidMoves lists only empty connected nodes from opening edge chips', () => {
    const state = createInitialState();
    const corner = getValidMoves(state, 'p1-0');
    expect(corner).toContain('n1-0');
    expect(corner.every((id) => !state.nodes.get(id)?.chip)).toBe(true);

    // Occupied neighbor on same top row is never a valid destination
    expect(corner).not.toContain('n0-1');
  });
});
