/**
 * Wave 39 — Sum Dominoes placeDomino / passTurn / selectDomino leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  selectDomino,
  placeDomino,
  passTurn,
  doRollDice,
  getValidPlacements,
  canPlayDomino,
} from '../../src/games/sum-dominoes/rules';
import { getDiceSum, isDouble } from '../../src/games/sum-dominoes/types';

describe('Wave 39 Sum Dominoes — place pass double', () => {
  it('selectDomino identity when wrong phase / missing id', () => {
    const state = createInitialState();
    expect(selectDomino(state, 'nope')).toBe(state);
    const rolled = {
      ...state,
      phase: 'placing' as const,
      currentDice: [2, 3] as [number, number],
    };
    expect(selectDomino(rolled, 'missing-id')).toBe(rolled);
  });

  it('selectDomino succeeds for playable hand piece in placing phase', () => {
    let selected = false;
    for (let attempt = 0; attempt < 30 && !selected; attempt++) {
      let state = createInitialState();
      state = doRollDice(state);
      if (state.phase !== 'placing' || !state.currentDice) continue;
      const sum = getDiceSum(state.currentDice);
      const playable = state.hands.player1.find((d) =>
        canPlayDomino(state, d, sum)
      );
      if (!playable) continue;
      state = selectDomino(state, playable.id);
      expect(state.selectedDomino).toBe(playable.id);
      selected = true;
    }
    expect(selected).toBe(true);
  });

  it('passTurn identity wrong phase; dual pass settles game', () => {
    const base = createInitialState();
    expect(passTurn(base)).toBe(base);
    let state = { ...base, phase: 'passing' as const };
    state = passTurn(state);
    expect(state.phase).toBe('rolling');
    expect(state.passCount).toBe(1);
    state = { ...state, phase: 'passing' };
    state = passTurn(state);
    expect(state.phase).toBe('gameOver');
    expect(state.passCount).toBe(2);
  });

  it('placeDomino when valid placement exists', () => {
    let placed = false;
    for (let attempt = 0; attempt < 40 && !placed; attempt++) {
      let state = createInitialState();
      state = doRollDice(state);
      if (!state.currentDice || state.phase !== 'placing') continue;
      const sum = getDiceSum(state.currentDice);
      const playable = state.hands.player1.find((d) =>
        canPlayDomino(state, d, sum)
      );
      if (!playable) continue;
      const places = getValidPlacements(state, playable, sum);
      if (!places.length) continue;
      state = { ...state, selectedDomino: playable.id };
      const { position, orientation } = places[0];
      const next = placeDomino(state, position, orientation);
      expect(next.moveHistory.length).toBe(1);
      expect(next.hands.player1.length).toBe(state.hands.player1.length - 1);
      placed = true;
    }
    expect(placed).toBe(true);
  });

  it('isDouble recognizes equal faces', () => {
    expect(
      isDouble({
        id: 'a',
        face1: 4,
        face2: 4,
        owner: null,
        orientation: 'horizontal',
      })
    ).toBe(true);
    expect(
      isDouble({
        id: 'b',
        face1: 1,
        face2: 2,
        owner: null,
        orientation: 'horizontal',
      })
    ).toBe(false);
  });
});
