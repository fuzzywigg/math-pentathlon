/**
 * Wave 44 — Sum Dominoes getRemainingCount seat asymmetry. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { createInitialState, getRemainingCount } from '../../src/games/sum-dominoes/rules';
import { CONFIG, type Domino, type SumDominoesState } from '../../src/games/sum-dominoes/types';

function tile(id: string, owner: Domino['owner'], face1 = 1, face2 = 1): Domino {
  return { id, face1, face2, owner, orientation: 'horizontal' };
}

describe('Wave 44 sum-dominoes — getRemainingCount seats', () => {
  it('opening deal reports STARTING_HAND_SIZE per seat', () => {
    const state = createInitialState();
    expect(getRemainingCount(state, 'player1')).toBe(CONFIG.STARTING_HAND_SIZE);
    expect(getRemainingCount(state, 'player2')).toBe(CONFIG.STARTING_HAND_SIZE);
  });

  it('asymmetric hands report independently', () => {
    const state: SumDominoesState = {
      ...createInitialState(),
      hands: {
        player1: [tile('a', 'player1'), tile('b', 'player1')],
        player2: [
          tile('c', 'player2'),
          tile('d', 'player2'),
          tile('e', 'player2'),
          tile('f', 'player2'),
          tile('g', 'player2'),
        ],
      },
    };
    expect(getRemainingCount(state, 'player1')).toBe(2);
    expect(getRemainingCount(state, 'player2')).toBe(5);
  });

  it('empty seat is zero without affecting opponent', () => {
    const base = createInitialState();
    const state: SumDominoesState = {
      ...base,
      hands: { player1: [], player2: base.hands.player2 },
    };
    expect(getRemainingCount(state, 'player1')).toBe(0);
    expect(getRemainingCount(state, 'player2')).toBe(base.hands.player2.length);
  });

  it('both empty seats report zero', () => {
    const state: SumDominoesState = {
      ...createInitialState(),
      hands: { player1: [], player2: [] },
    };
    expect(getRemainingCount(state, 'player1')).toBe(0);
    expect(getRemainingCount(state, 'player2')).toBe(0);
  });
});
