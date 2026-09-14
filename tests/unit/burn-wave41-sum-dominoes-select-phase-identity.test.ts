/**
 * Wave 41 — Sum Dominoes selectDomino phase / missing identity. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  selectDomino,
  canPlayDomino,
} from '../../src/games/sum-dominoes/rules';
import { type Domino, type SumDominoesState } from '../../src/games/sum-dominoes/types';

function makeDomino(id: string, face1: number, face2: number): Domino {
  return { id, face1, face2, owner: 'player1', orientation: 'horizontal' };
}

describe('Wave 41 sum-dominoes — selectDomino identity', () => {
  it('identity when phase is rolling', () => {
    const state = createInitialState();
    expect(state.phase).toBe('rolling');
    expect(selectDomino(state, state.hands.player1[0].id)).toBe(state);
  });

  it('identity when phase is passing / gameOver', () => {
    const base = createInitialState();
    const passing: SumDominoesState = {
      ...base,
      phase: 'passing',
      currentDice: [2, 2],
    };
    expect(selectDomino(passing, base.hands.player1[0].id)).toBe(passing);
    const over: SumDominoesState = { ...base, phase: 'gameOver', winner: 'player1' };
    expect(selectDomino(over, base.hands.player1[0].id)).toBe(over);
  });

  it('identity for missing id / no dice / unplayable tile', () => {
    const base = createInitialState();
    const placing: SumDominoesState = {
      ...base,
      phase: 'placing',
      currentDice: [6, 6],
      hands: {
        ...base.hands,
        player1: [makeDomino('zero', 0, 0), makeDomino('playable', 0, 0)],
      },
    };
    expect(selectDomino(placing, 'ghost-id')).toBe(placing);

    const noDice: SumDominoesState = { ...placing, currentDice: null };
    expect(selectDomino(noDice, 'zero')).toBe(noDice);

    // 0+0 cannot match targetSum 12 against center 6s
    const unplayable: SumDominoesState = {
      ...placing,
      currentDice: [6, 6],
      hands: { ...placing.hands, player1: [makeDomino('zero', 0, 0)] },
    };
    expect(canPlayDomino(unplayable, unplayable.hands.player1[0], 12)).toBe(false);
    expect(selectDomino(unplayable, 'zero')).toBe(unplayable);
  });
});
