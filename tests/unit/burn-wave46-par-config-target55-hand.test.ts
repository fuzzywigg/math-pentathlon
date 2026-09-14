/**
 * Wave 46 — Par 55 CONFIG target/hand leftovers distinct from wave45 types. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { CONFIG, getOpponent, createBaseId } from '../../src/games/par-55/types';

describe('Wave 46 par — config helpers', () => {
  it('TARGET_SCORE is 55; HAND_SIZE positive; opponent + baseId', () => {
    expect(CONFIG.TARGET_SCORE).toBe(55);
    expect(CONFIG.HAND_SIZE).toBeGreaterThan(0);
    expect(getOpponent('player1')).toBe('player2');
    expect(createBaseId(2, 3)).toBe('base-2-3');
  });
});
