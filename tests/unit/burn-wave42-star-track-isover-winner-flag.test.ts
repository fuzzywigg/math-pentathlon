/** Wave 42 — Star Track isGameOver respects winner flag. Tests-only. */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  TRACK_LENGTH,
} from '../../src/games/star-track/types';
import { isGameOver, selectChain } from '../../src/games/star-track/rules';

describe('Wave 42 Star Track — isOver winner flag', () => {
  it('false on fresh initial state', () => {
    expect(isGameOver(createInitialState())).toBe(false);
  });

  it('true when phase is gameOver', () => {
    const state = {
      ...createInitialState(),
      phase: 'gameOver' as const,
      winner: null,
    };
    expect(isGameOver(state)).toBe(true);
  });

  it('true when winner is set even if phase not yet gameOver', () => {
    const state = {
      ...createInitialState(),
      phase: 'drawChains' as const,
      winner: 'player2' as const,
    };
    expect(isGameOver(state)).toBe(true);
  });

  it('true after selectChain reaches TRACK_LENGTH', () => {
    let state = {
      ...createInitialState(),
      player1Position: TRACK_LENGTH - 2,
      phase: 'selectChain' as const,
      drawnChains: [
        { length: 5 as const, id: 1 },
        { length: 1 as const, id: 2 },
      ],
    };
    state = selectChain(state, 0);
    expect(state.winner).toBe('player1');
    expect(isGameOver(state)).toBe(true);
  });

  it('false midrace with null winner', () => {
    const state = {
      ...createInitialState(),
      player1Position: 4,
      player2Position: 3,
      phase: 'selectChain' as const,
      winner: null,
    };
    expect(isGameOver(state)).toBe(false);
  });
});
