/**
 * Wave 44 — Star Track getProgress leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, TRACK_LENGTH } from '../../src/games/star-track/types';
import { getProgress } from '../../src/games/star-track/rules';

describe('Wave 44 Star Track — progress ladder', () => {
  it('0% at start; 100% at TRACK_LENGTH', () => {
    const s = createInitialState();
    expect(getProgress(s, 'player1')).toBe(0);
    expect(getProgress({ ...s, player2Position: TRACK_LENGTH }, 'player2')).toBe(100);
    expect(getProgress({ ...s, player1Position: TRACK_LENGTH / 2 }, 'player1')).toBe(50);
  });
});
