/**
 * Wave 40 — Kwatro moveChip phase/invalid-dest + passTurn leftovers.
 * After #177; tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  selectChip,
  moveChip,
  isValidMove,
  passTurn,
  hasValidMoves,
} from '../../src/games/kwatro-sinko/rules';

describe('Wave 40 kwatro — moveChip / pass leftovers', () => {
  it('moveChip identity without selection or wrong phase', () => {
    const state = createInitialState();
    expect(moveChip(state, 'n0')).toBe(state);
  });

  it('moveChip rejects invalid destination after select', () => {
    const state = createInitialState();
    const own = [...state.chips.values()].find(
      (c) => c.owner === 'player1' && c.position
    )!;
    const selected = selectChip(state, own.id);
    if (selected === state) {
      // Opening may jam some chips — still assert API identity on ghost dest
      const forced = {
        ...state,
        selectedChip: own.id,
        phase: 'selectingDest' as const,
      };
      expect(isValidMove(forced, own.id, '__ghost__')).toBe(false);
      expect(moveChip(forced, '__ghost__')).toBe(forced);
      return;
    }
    expect(selected.phase).toBe('selectingDest');
    expect(moveChip(selected, '__ghost__')).toBe(selected);
  });

  it('passTurn flips player when stuck; hasValidMoves boolean', () => {
    const state = createInitialState();
    expect(typeof hasValidMoves(state)).toBe('boolean');
    const next = passTurn(state);
    expect(next.currentPlayer).toBe('player2');
    expect(next.selectedChip).toBeNull();
  });
});
