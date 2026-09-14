/**
 * Wave 46 — Prime Gold CONFIG/DICE leftovers distinct from wave45 types. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { CONFIG, DICE_CONFIG } from '../../src/games/prime-gold/types';

describe('Wave 46 prime — config dice', () => {
  it('7×7 board; veins; d6/d8/d10 ranges', () => {
    expect(CONFIG.BOARD_SIZE).toBe(7);
    expect(CONFIG.VEINS_TO_WIN).toBe(4);
    expect(CONFIG.MIN_VEIN_LENGTH).toBe(4);
    expect(DICE_CONFIG.die1.max).toBe(6);
    expect(DICE_CONFIG.die2.max).toBe(8);
    expect(DICE_CONFIG.die3.max).toBe(10);
  });
});
