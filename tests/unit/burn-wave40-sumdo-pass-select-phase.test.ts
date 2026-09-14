/**
 * Wave 40 — Sum Dominoes passTurn / selectDomino / placeDomino phase gates.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  passTurn,
  selectDomino,
  placeDomino,
} from '../../src/games/sum-dominoes/rules';

describe('Wave 40 sum-dominoes — pass / select / place phase identity', () => {
  it('passTurn wrong phase (rolling / placing) → identity', () => {
    const rolling = createInitialState();
    expect(rolling.phase).toBe('rolling');
    expect(passTurn(rolling)).toBe(rolling);

    const placing = { ...rolling, phase: 'placing' as const };
    expect(passTurn(placing)).toBe(placing);
  });

  it('selectDomino ghost id → identity', () => {
    const state = {
      ...createInitialState(),
      phase: 'placing' as const,
      currentDice: [3, 4] as [number, number],
    };
    expect(selectDomino(state, 'ghost-domino-id')).toBe(state);
  });

  it('selectDomino with no dice → identity', () => {
    const state = {
      ...createInitialState(),
      phase: 'placing' as const,
      currentDice: null,
    };
    const id = state.hands.player1[0].id;
    expect(selectDomino(state, id)).toBe(state);
  });

  it('placeDomino wrong phase → identity', () => {
    const state = createInitialState();
    expect(state.phase).toBe('rolling');
    expect(placeDomino(state, { row: 0, col: 0 }, 'horizontal')).toBe(state);

    const passing = {
      ...state,
      phase: 'passing' as const,
      selectedDomino: state.hands.player1[0].id,
      currentDice: [2, 3] as [number, number],
    };
    expect(placeDomino(passing, { row: 0, col: 0 }, 'vertical')).toBe(passing);
  });
});
