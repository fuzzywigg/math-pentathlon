/**
 * Wave 42 — Star Track getProgress percent ladder. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getProgress, isGameOver } from '../../src/games/star-track/rules';
import { createInitialState, TRACK_LENGTH } from '../../src/games/star-track/types';

describe('Wave 42 star-track — progress ladder', () => {
  it('progress scales linearly to 100', () => {
    for (const pos of [0, 3, 6, TRACK_LENGTH]) {
      const s = {
        ...createInitialState(),
        player1Position: pos,
        player2Position: 0,
      };
      expect(getProgress(s, 'player1')).toBe((pos / TRACK_LENGTH) * 100);
      expect(getProgress(s, 'player2')).toBe(0);
    }
  });

  it('isGameOver true when winner set even if phase drawChains', () => {
    const s = {
      ...createInitialState(),
      winner: 'player2' as const,
      phase: 'drawChains' as const,
    };
    expect(isGameOver(s)).toBe(true);
    expect(isGameOver(createInitialState())).toBe(false);
  });
});
