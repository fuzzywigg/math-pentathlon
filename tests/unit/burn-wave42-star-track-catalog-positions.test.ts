/**
 * Wave 42 leftovers D — star-track catalog / position helpers. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import {
  TRACK_LENGTH,
  CHAINS_PER_LENGTH,
  createInitialState,
  getOpponent,
  getPlayerPosition,
  createChainBucket,
} from '../../src/games/star-track/types';

describe('Wave 42 D star-track — catalog + position helpers', () => {
  it('TRACK_LENGTH and CHAINS_PER_LENGTH constants', () => {
    expect(TRACK_LENGTH).toBe(12);
    expect(CHAINS_PER_LENGTH).toBe(4);
    expect(createChainBucket()).toHaveLength(6 * CHAINS_PER_LENGTH);
  });

  it('opening positions are 0; getOpponent flips; getPlayerPosition reads seats', () => {
    const state = createInitialState();
    expect(state.player1Position).toBe(0);
    expect(state.player2Position).toBe(0);
    expect(getPlayerPosition(state, 'player1')).toBe(0);
    expect(getPlayerPosition(state, 'player2')).toBe(0);
    expect(getOpponent('player1')).toBe('player2');
    expect(getOpponent('player2')).toBe('player1');

    const mid = {
      ...state,
      player1Position: 5,
      player2Position: 9,
    };
    expect(getPlayerPosition(mid, 'player1')).toBe(5);
    expect(getPlayerPosition(mid, 'player2')).toBe(9);
  });
});
