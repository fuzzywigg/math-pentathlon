/**
 * Wave 43 — Sum Dominoes hasPlayableMove vs hand scan leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, canPlayDomino } from '../../src/games/sum-dominoes/rules';
import { getDiceSum } from '../../src/games/sum-dominoes/types';
import { hasPlayableMove } from '../../src/games/sum-dominoes/ai';
import type { SumDominoesState } from '../../src/games/sum-dominoes/types';

describe('Wave 43 sum-dominoes — hasPlayableMove consistency', () => {
  it('matches any canPlayDomino on forged placing state', () => {
    const base = createInitialState();
    const state: SumDominoesState = {
      ...base,
      phase: 'placing',
      currentDice: [2, 2],
    };
    const sum = getDiceSum(state.currentDice!);
    const any = state.hands.player1.some((d) => canPlayDomino(state, d, sum));
    expect(hasPlayableMove(state, 'player1', sum)).toBe(any);
  });
});
