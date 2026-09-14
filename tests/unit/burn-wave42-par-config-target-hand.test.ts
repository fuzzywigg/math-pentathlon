/**
 * Wave 42 — Par-55 CONFIG target/hand/board dims. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { CONFIG, createBlockSet, shuffleArray } from '../../src/games/par-55/types';

describe('Wave 42 par-55 — config', () => {
  it('target 55; hand size positive; shuffle preserves multiset', () => {
    expect(CONFIG.TARGET_SCORE).toBe(55);
    expect(CONFIG.HAND_SIZE).toBeGreaterThan(0);
    const blocks = createBlockSet();
    const shuffled = shuffleArray([...blocks]);
    expect(shuffled).toHaveLength(blocks.length);
    expect(new Set(shuffled.map((b) => b.id))).toEqual(
      new Set(blocks.map((b) => b.id))
    );
  });
});
