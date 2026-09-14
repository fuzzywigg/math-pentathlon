/**
 * Wave 47 leftover after #214/#215 — Par 55 placeBlock wrong-phase identity + passTurn.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  selectBlock,
  placeBlock,
  passTurn,
  getValidPlacements,
} from '../../src/games/par-55/rules';

describe('Wave 47 par deepen 3 — Wave 47 Par 55 — place identity / pass', () => {
  it('placeBlock identity when still selectingBlock', () => {
    const state = createInitialState();
    const baseId = [...state.bases.keys()][0];
    expect(placeBlock(state, baseId)).toBe(state);
  });

  it('passTurn from selecting flips seat without placing', () => {
    const state = createInitialState();
    const next = passTurn(state);
    expect(next.currentPlayer).toBe('player2');
    expect(next.selectedBlock).toBeNull();
    expect(next.moveHistory.length).toBe(state.moveHistory.length);
  });

  it('select then invalid base place identity', () => {
    let state = createInitialState();
    state = selectBlock(state, state.hands.player1[0].id);
    expect(placeBlock(state, 'ghost-base')).toBe(state);
    expect(getValidPlacements(state).length).toBeGreaterThan(0);
  });
});
