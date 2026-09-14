/**
 * Overnight HEAVY leftover — Calla analyzeMoves free-turn / opponent-land / empty-opposite.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { analyzeMoves } from '../../src/games/calla/ai';

describe('Overnight wave50 calla — analyze reasoning leftovers', () => {
  it('opening pit 2 is a free-turn land in Calla', () => {
    const analyses = analyzeMoves(createInitialState(), 'player1');
    const pit2 = analyses.find((a) => a.pit === 2);
    expect(pit2?.outcome.landsInCalla).toBe(true);
    expect(pit2?.outcome.landsSide).toBe('calla');
    expect(pit2?.reasoning).toMatch(/free turn/i);
  });

  it('opening pit 4 lands on opponent side', () => {
    const analyses = analyzeMoves(createInitialState(), 'player1');
    const pit4 = analyses.find((a) => a.pit === 4);
    expect(pit4?.outcome.landsSide).toBe('opponent');
    expect(pit4?.reasoning).toMatch(/opponent/i);
  });

  it('empty opposite yields no-capture own-side reasoning', () => {
    const analyses = analyzeMoves(
      {
        ...createInitialState(),
        player1Pits: [1, 0, 0, 0, 0],
        player2Pits: [1, 0, 0, 0, 0],
      },
      'player1'
    );
    expect(analyses).toHaveLength(1);
    expect(analyses[0].outcome.captureAmount).toBe(0);
    expect(analyses[0].outcome.landsSide).toBe('own');
    expect(analyses[0].reasoning).toMatch(/opposite pit is empty/i);
  });
});
