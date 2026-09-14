/**
 * Wave 43 TOKENMAXX — Star Track progress / isGameOver leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getProgress, isGameOver } from '../../src/games/star-track/rules';
import { createInitialState, TRACK_LENGTH } from '../../src/games/star-track/types';

describe('Wave 43 star-track — progress/gameOver', () => {
  it('progress ladder and gameOver gates', () => {
    const base = createInitialState();
    expect(getProgress(base, 'player1')).toBe(0);
    expect(
      getProgress({ ...base, player1Position: TRACK_LENGTH / 2 }, 'player1')
    ).toBe(50);
    expect(
      getProgress({ ...base, player2Position: TRACK_LENGTH }, 'player2')
    ).toBe(100);
    expect(isGameOver(base)).toBe(false);
    expect(isGameOver({ ...base, phase: 'gameOver' })).toBe(true);
    expect(isGameOver({ ...base, winner: 'player2' })).toBe(true);
  });
});
