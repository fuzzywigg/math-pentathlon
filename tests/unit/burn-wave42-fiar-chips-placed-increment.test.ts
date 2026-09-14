/**
 * Wave 42 — FIAR chipsPlaced increments per place. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { placeChip } from '../../src/games/fiar/rules';
import { createInitialState, CONFIG } from '../../src/games/fiar/types';

describe('Wave 42 fiar — chipsPlaced increment', () => {
  it('each place increments only the acting seat counter', () => {
    let state = createInitialState();
    expect(state.chipsPlaced).toEqual({ player1: 0, player2: 0 });
    state = placeChip(state, '0-0');
    expect(state.chipsPlaced).toEqual({ player1: 1, player2: 0 });
    state = placeChip(state, '1-0');
    expect(state.chipsPlaced).toEqual({ player1: 1, player2: 1 });
    state = placeChip(state, '2-0');
    expect(state.chipsPlaced).toEqual({ player1: 2, player2: 1 });
  });

  it('after four places each, counters equal CONFIG.CHIPS_PER_PLAYER', () => {
    let state = createInitialState();
    const ids = [...state.board.nodes.keys()];
    for (let i = 0; i < CONFIG.CHIPS_PER_PLAYER * 2; i++) {
      state = placeChip(state, ids[i]);
      const expectedP1 = Math.ceil((i + 1) / 2);
      const expectedP2 = Math.floor((i + 1) / 2);
      expect(state.chipsPlaced.player1).toBe(expectedP1);
      expect(state.chipsPlaced.player2).toBe(expectedP2);
    }
    expect(state.chipsPlaced.player1).toBe(CONFIG.CHIPS_PER_PLAYER);
    expect(state.chipsPlaced.player2).toBe(CONFIG.CHIPS_PER_PLAYER);
  });

  it('rejected place does not bump chipsPlaced', () => {
    let state = placeChip(createInitialState(), '0-0');
    const before = state.chipsPlaced;
    state = placeChip(state, '0-0'); // occupied
    expect(state.chipsPlaced).toEqual(before);
  });
});
